import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import bcrypt from "bcryptjs";
import http from "http";
import https from "https";
import connectDB from "./config/db.js";
import carRoutes from "./routes/carRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import Admin from "./models/Admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });
await connectDB();

async function ensureDefaultAdmin() {
  try {
    const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL;
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD;
    const forceReset = String(process.env.DEFAULT_ADMIN_FORCE_RESET || "false").toLowerCase() === "true";

    if (!defaultEmail || !defaultPassword) {
      console.warn("⚠️ لم يتم ضبط DEFAULT_ADMIN_EMAIL/DEFAULT_ADMIN_PASSWORD في البيئة؛ سيتم تخطي إنشاء الأدمن.");
      return;
    }

    const existingAdmin = await Admin.findOne({ email: defaultEmail });

    if (!existingAdmin) {
      // استخدم الـ pre-save hook لتشفير كلمة المرور
      await Admin.create({ email: defaultEmail, password: defaultPassword });
      console.log("✅ تم إنشاء حساب الأدمن الافتراضي بنجاح");
    } else {
      if (forceReset) {
        existingAdmin.password = defaultPassword;
        await existingAdmin.save();
        console.log("🔒 تم إعادة ضبط كلمة مرور الأدمن الافتراضي وفق البيئة");
      } else {
        console.log("ℹ️ حساب الأدمن موجود مسبقًا، لا حاجة لإنشائه.");
      }
    }
  } catch (err) {
    console.error("❌ فشل إنشاء/تحديث حساب الأدمن الافتراضي:", err.message);
  }
}

await ensureDefaultAdmin();

const app = express();
const allowedOrigins = [
  "https://www.clutchzone.co",
  "https://clutchzone.co",
  "https://clutch-zone.vercel.app",
  "http://localhost:3000",
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const ok =
      allowedOrigins.includes(origin) ||
      /^https:\/\/(?:[a-z0-9-]+\.)*clutchzone\.co$/i.test(origin);
    if (ok) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());

// ✅ المسارات (Routes)
app.use("/api/cars", carRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/upload", uploadRoutes);

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

function postJson(urlString, body, timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const lib = url.protocol === "https:" ? https : http;

    const req = lib.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || (url.protocol === "https:" ? 443 : 80),
        path: `${url.pathname}${url.search}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: timeoutMs,
      },
      (res) => {
        let raw = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(raw || "{}"));
            } catch {
              reject(new Error("Invalid JSON response from Ollama"));
            }
          } else {
            reject(new Error(`Ollama HTTP ${res.statusCode || 0}: ${raw?.slice(0, 500) || ""}`));
          }
        });
      }
    );

    req.on("timeout", () => {
      req.destroy(new Error("Ollama request timeout"));
    });
    req.on("error", reject);
    req.write(JSON.stringify(body || {}));
    req.end();
  });
}

const sellerAiSessions = new Map();
const SELLER_AI_SESSION_TTL_MS = 30 * 60 * 1000;

function getSellerAiSessionKey(req) {
  const ip = (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").toString().split(",")[0].trim();
  const ua = (req.headers["user-agent"] || "").toString().slice(0, 120);
  return `${ip}::${ua}`;
}

function getSellerAiSession(req) {
  const now = Date.now();
  for (const [k, v] of sellerAiSessions.entries()) {
    if (!v || typeof v !== "object" || now - (v.updatedAt || 0) > SELLER_AI_SESSION_TTL_MS) {
      sellerAiSessions.delete(k);
    }
  }

  const key = getSellerAiSessionKey(req);
  const existing = sellerAiSessions.get(key);
  if (existing && now - (existing.updatedAt || 0) <= SELLER_AI_SESSION_TTL_MS) {
    existing.updatedAt = now;
    return existing;
  }
  const session = { updatedAt: now, maintenance: { carType: "", model: "", year: "", odometerKm: "", usage: "", condition: "" } };
  sellerAiSessions.set(key, session);
  return session;
}

function toLatinDigits(input) {
  return String(input || "")
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[٬،]/g, ",");
}

function parseKmNumber(text) {
  const t = toLatinDigits(text).replace(/\s+/g, " ").trim();
  const m = t.match(/(\d[\d\s,\.]{0,14})/);
  if (!m) return "";
  const cleaned = m[1].replace(/[,\s]/g, "");
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n <= 0) return "";
  return String(Math.round(n));
}

function isMaintenanceIntent(text) {
  const t = String(text || "").toLowerCase();
  return (
    t.includes("جدول صيانة") ||
    t.includes("صيانة") ||
    t.includes("maintenance") ||
    t.includes("service schedule") ||
    t.includes("ميعاد الصيانة") ||
    t.includes("مواعيد الصيانة")
  );
}

function extractMaintenanceFields(message, current) {
  const next = { ...current };
  const m = String(message || "");

  if (!next.year) {
    const yearMatch = toLatinDigits(m).match(/\b(19\d{2}|20\d{2})\b/);
    if (yearMatch) next.year = yearMatch[1];
    const modelYearMatch = toLatinDigits(m).match(/(?:موديل|سنة|سنّة|year)\s*[:\-]?\s*(19\d{2}|20\d{2})/i);
    if (modelYearMatch) next.year = modelYearMatch[1];
  }

  if (!next.odometerKm) {
    const odoMatch = toLatinDigits(m).match(/(?:عداد|كم|كيلو(?:متر)?|km|kilometer|kilometre)\s*[:\-]?\s*([0-9٠-٩][0-9٠-٩\s,\.]{1,14})/i);
    if (odoMatch) next.odometerKm = parseKmNumber(odoMatch[1]);
  }

  if (!next.usage) {
    const t = m.toLowerCase();
    if (t.includes("مدينة") || t.includes("داخل المدينة") || t.includes("مشاوير") || t.includes("زحمة")) next.usage = "مدينة";
    else if (t.includes("سفر") || t.includes("طريق") || t.includes("سريع") || t.includes("highway")) next.usage = "سفر";
    else if (t.includes("تقيل") || t.includes("تحميل") || t.includes("شغل") || t.includes("commercial")) next.usage = "تقيل";
  }

  if (!next.condition) {
    const t = m.toLowerCase();
    if (t.includes("زيرو") || t.includes("جديدة") || t.includes("كسر زيرو") || t.includes("new")) next.condition = "زيرو";
    else if (t.includes("مستعملة") || t.includes("استعمال") || t.includes("used") || t.includes("second")) next.condition = "مستعملة";
  }

  if (!next.model) {
    const modelMatch = m.match(/(?:الموديل|model)\s*[:\-]?\s*([^\n\r،,]{2,40})/i);
    if (modelMatch) next.model = modelMatch[1].trim();
  }

  if (!next.carType) {
    const typeMatch = m.match(/(?:نوع السيارة|نوعها|الفئة|النوع|body)\s*[:\-]?\s*([^\n\r،,]{2,40})/i);
    if (typeMatch) next.carType = typeMatch[1].trim();
    const t = m.toLowerCase();
    if (!next.carType) {
      if (t.includes("suv") || t.includes("كروس") || t.includes("كروس اوفر") || t.includes("كروس أوفر")) next.carType = "SUV/كروس أوفر";
      else if (t.includes("سيدان") || t.includes("sedan")) next.carType = "سيدان";
      else if (t.includes("هاتش") || t.includes("hatch")) next.carType = "هاتشباك";
      else if (t.includes("بيك اب") || t.includes("pickup") || t.includes("بيك أب")) next.carType = "بيك أب";
    }
  }

  return next;
}

function missingMaintenanceFields(fields) {
  const missing = [];
  if (!fields.carType) missing.push("نوع السيارة");
  if (!fields.model) missing.push("الموديل");
  if (!fields.year) missing.push("سنة الصنع");
  if (!fields.odometerKm) missing.push("عداد الكيلومترات الحالي");
  if (!fields.usage) missing.push("نوع الاستخدام (مدينة / سفر / تقيل)");
  if (!fields.condition) missing.push("حالة السيارة (زيرو / مستعملة)");
  return missing;
}

function maintenanceAskFor(missing) {
  const lines = [
    "تمام — عشان أطلع جدول صيانة آمن ومناسب لظروف مصر، محتاج بيانات بسيطة:",
    ...missing.map((m) => `- ${m}`),
    "اكتبهم في رسالة واحدة لو تقدر.",
  ];
  return lines.join("\n");
}

function buildMaintenanceSchedule(fields) {
  const usageNote =
    fields.usage === "تقيل"
      ? "مع الاستخدام التقيل (تحميل/زحمة/سخونة) خلي الصيانة أقرب شوية من الطبيعي."
      : fields.usage === "سفر"
        ? "مع السفر كتير ركّز على الإطارات والفرامل والسوائل قبل أي مشوار طويل."
        : "مع استخدام المدينة والزحمة ركّز على التبريد والزيت والفرامل لأن التشغيل بيكون أصعب.";

  const km = Number(fields.odometerKm || 0);
  const start = Number.isFinite(km) && km > 0 ? km : 0;
  const header = [
    "جدول صيانة مقترح (بدون أسعار):",
    `السيارة: ${fields.carType} — ${fields.model} — ${fields.year}`,
    `العداد الحالي: ${fields.odometerKm} كم — الاستخدام: ${fields.usage} — الحالة: ${fields.condition}`,
    "",
    "ملحوظة أمان: ده جدول عام إرشادي. راجع كتيّب سيارتك لو فيه اختلاف، وأي لمبة تحذير/سخونة/صوت غريب لازم فحص في مركز متخصص.",
    "",
    "الكيلومترات | المطلوب",
    "0–5,000 | فحص سوائل (زيت/مياه/فرامل) + ضغط الإطارات + فحص تسريبات",
    "كل 7,000–10,000 | تغيير زيت المحرك + فلتر الزيت + فحص تربيط وعفشة + فحص الفرامل",
    "كل 10,000 | تدوير الإطارات + وزن/ترصيص لو فيه اهتزاز + فحص زوايا",
    "كل 15,000–20,000 | فحص/تنظيف فلتر الهواء (تغيير لو متّسخ) + فلتر التكييف (كبائن)",
    "كل 30,000–40,000 | تنظيف بوابة الهواء/الثروتل (لو لزم) + فحص سيور/خراطيم + فحص بوجيهات حسب النوع",
    "كل 40,000 أو كل سنتين | تغيير زيت الفرامل (Brake fluid) + فحص دورة التبريد وجودة المياه",
    "كل 60,000 | فحص زيت الفتيس (تغيير حسب توصية الشركة) + فحص البطارية والشحن",
    "كل 80,000–100,000 | تغيير بوجيهات (لو عادية/إيريديوم حسب المواصفات) + فحص طرمبة/فلتر البنزين حسب النظام",
    "كل 100,000 | فحص طقم السيور/شدادات (لو موجودة) + فحص المساعدين والجلود",
    "",
    "نصائح تشغيل في مصر:",
    `- ${usageNote}`,
    "- لو بتقف في زحمة كتير: راقب حرارة الموتور ومستوى المياه باستمرار.",
    "- خليك حذر من المياه العادية في الردياتير؛ الأفضل سوائل تبريد مناسبة حسب كتيّب السيارة.",
    "- نظافة فلتر الهواء بتفرق جدًا مع التراب (خصوصًا طرق السفر).",
    "",
    "لو تحب، ابعتلي هل عربيتك أوتوماتيك ولا مانيوال وهل البنزين 92 ولا 95؟ وهظبط الملاحظات بشكل أدق.",
  ];

  if (start >= 80000) {
    header.splice(
      header.indexOf("كل 60,000 | فحص زيت الفتيس (تغيير حسب توصية الشركة) + فحص البطارية والشحن") + 1,
      0,
      "قريبًا | لو مغيرتش زيت الفتيس قبل كده: الأفضل فحص متخصص قبل القرار بالتغيير"
    );
  }

  return header.join("\n");
}

function sanitizeAiReply(text) {
  const t = String(text || "").trim();
  if (!t) return "";
  return t
    .replace(/```[\s\S]*?```/g, "")
    .replace(/```/g, "")
    .replace(/\u0000/g, "")
    .trim();
}

app.post("/api/seller-ai", async (req, res) => {
  try {
    const msg = typeof req.body?.message === "string" ? req.body.message.trim() : "";
    if (!msg) return res.status(400).json({ reply: "من فضلك اكتب رسالتك." });
    if (msg.length > 2000) return res.status(400).json({ reply: "الرسالة طويلة جدًا. اختصرها من فضلك." });

    const ollamaBaseUrl = (process.env.OLLAMA_BASE_URL || "").trim();
    if (!ollamaBaseUrl) return res.status(500).json({ reply: "خدمة الذكاء الاصطناعي غير مفعلة حاليًا." });

    const model = (process.env.OLLAMA_MODEL || "llama3.2").trim();
    const session = getSellerAiSession(req);

    const maintenanceTriggered = isMaintenanceIntent(msg) || missingMaintenanceFields(session.maintenance).length < 6;
    if (maintenanceTriggered) {
      session.maintenance = extractMaintenanceFields(msg, session.maintenance);
      const missing = missingMaintenanceFields(session.maintenance);
      res.setHeader("Cache-Control", "no-store");
      if (missing.length) return res.json({ reply: maintenanceAskFor(missing) });
      return res.json({ reply: buildMaintenanceSchedule(session.maintenance) });
    }

    const systemPrompt =
      "أنت بائع ذكي في موقع ClutchZone، متخصص في السيارات والعقارات.\n" +
      "هدفك:\n" +
      "1. إقناع العميل بالشراء بثقة وبدون إزعاج\n" +
      "2. شرح الفائدة التي ستعود عليه من الشراء\n" +
      "3. رسم صورة مستقبلية إيجابية بعد الامتلاك\n" +
      "4. إذا كان مترددًا، حثّه على ترك بياناته:\n" +
      "   - الاسم\n" +
      "   - رقم الهاتف\n" +
      "   - مهتم بإيه (سيارات/عقارات)\n" +
      "   - استفساره أو طلبه\n" +
      "5. اختم دائمًا بتشجيعه على زيارة الموقع أو ترك البيانات للتواصل.\n";

    const prompt =
      `${systemPrompt}\n` +
      "قواعد مهمة للرد:\n" +
      "- اكتب بالعربية المصرية بأسلوب محترم ومختصر.\n" +
      "- استخدم نقاط واضحة.\n" +
      "- ممنوع وضع أي كود أو رموز برمجية أو Markdown داخل الرد.\n" +
      "- لو الرسالة مش واضحة اسأل سؤال توضيحي واحد.\n\n" +
      `رسالة العميل: ${msg}\n\nرد البائع AI:`;
    const options = {};
    const numThread = Number(process.env.OLLAMA_NUM_THREAD || "");
    if (Number.isFinite(numThread) && numThread > 0) options.num_thread = numThread;

    const payload = {
      model,
      prompt,
      stream: false,
      ...(Object.keys(options).length ? { options } : {}),
    };

    const data = await postJson(
      `${ollamaBaseUrl.replace(/\/+$/, "")}/api/generate`,
      payload,
      Number(process.env.OLLAMA_TIMEOUT_MS || 20000)
    );

    const rawReply = typeof data?.response === "string" ? data.response : "";
    const cleaned = sanitizeAiReply(rawReply);
    const reply = cleaned || "ممكن توضّح طلبك أكثر؟";
    res.setHeader("Cache-Control", "no-store");
    return res.json({ reply });
  } catch (err) {
    return res.status(502).json({ reply: "حصلت مشكلة مؤقتة في الرد. جرّب تاني بعد شوية." });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// ✅ التعامل مع الأخطاء
app.use(errorHandler);

// ✅ تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
