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
  process.env.CORS_ORIGIN,
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  "http://localhost:5173",
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
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
