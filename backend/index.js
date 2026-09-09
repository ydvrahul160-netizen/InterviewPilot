import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/connectDB.js";
import cookieParser from "cookie-parser";
dotenv.config();
import cors from "cors"
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import interviewRouter from "./routes/interview.route.js";
import paymentRouter from "./routes/payment.route.js";

const app = express();
const allowedOrigins = [
  "https://interviewpilot-1-hp61.onrender.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


app.use(express.json())
app.use(cookieParser())

app.use("/api/auth" , authRouter)
app.use("/api/user" , userRouter)
app.use("/api/interview" , interviewRouter)
app.use("/api/payment" , paymentRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
  connectDb();
});
