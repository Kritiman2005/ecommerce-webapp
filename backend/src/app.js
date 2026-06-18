import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config({
    path: "./.env"
});

const app = express();


//Middleware configuration
app.use(express.json({ limit : "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

//CORS configuration
app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(",") || "https://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"]
    })
);

// Routes
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";

app.get("/", (req, res) => {
    res.send("Welcome to ecommerce backend");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);


export default app;

