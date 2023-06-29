import express from "express";
import connectDB from "./config/connection.js";
import cors from "cors";
import userRoute from "./routes/user.js";
import hospitalRoute from "./routes/hospital.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ extended: false }));

connectDB();

app.get("/", (req, res) => res.json({ msg: "welcome to hospital finder API" }));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/hospital", hospitalRoute);

app.listen(PORT, () => console.log(`App is Listenng on port ${PORT}`));
