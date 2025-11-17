// utils/formatters.ts

// 🔹 تنسيق الأسعار بالجنيه المصري
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
  })
    .format(amount)
    .replace('ج.م.‏', 'ج.م'); // تعديل بسيط لتنسيق الرمز
};

// 🔹 تنسيق الأرقام العامة بالعربية المصرية
export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('ar-EG').format(num);
};