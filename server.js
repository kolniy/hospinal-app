import express from "express";
import connectDB from "./config/connection.js";

import userRoute from "./routes/user.js";
import hospitalRoute from "./routes/hospital.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ extended: false }));

connectDB();

app.use("/api/v1/user", userRoute);
app.use("/api/v1/hospital", hospitalRoute);

app.listen(PORT, () => console.log(`App is Listenng on port ${PORT}`));
