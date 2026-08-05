import dns from "node:dns";
if (process.env.NODE_ENV !== "production") {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import shopRoutes from "./routes/shopRoutes.js";

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "https://marketingsoftware.netlify.app",
  "http://localhost:5173",
  process.env.CORS_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // origin မပါတဲ့ request များ (eg. Mobile apps/Postman) သို့မဟုတ် allowedOrigins ထဲပါရင် ခွင့်ပြုမည်
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Field Operations API is running...");
});

app.use("/api/shops", shopRoutes);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
