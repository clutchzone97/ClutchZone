// test-env.js
import dotenv from "dotenv";
dotenv.config();

console.log("cwd:", process.cwd());
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "<SET>" : "<NOT SET>");
