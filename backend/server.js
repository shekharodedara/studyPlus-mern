const express = require("express");
const https = require("https");
const selfsigned = require("selfsigned");
const app = express();
// packages
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
// connection to DB and cloudinary
const { connectDB } = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");
// routes
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const paymentRoutes = require("./routes/payments");
const courseRoutes = require("./routes/course");
const note = require("./routes/note");
const liveClass = require("./routes/liveClass");
const aiRoutes = require("./routes/ai.js");
// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, cb) =>
      [process.env.FRONTEND_URL].includes(origin) || !origin
        ? cb(null, true)
        : cb(new Error("CORS not allowed")),
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);
// connections
connectDB();
cloudinaryConnect();
// mount route
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/notes", note);
app.use("/api/v1/live-class", liveClass);
app.use("/api/v1/api", aiRoutes);
// Default Route
app.get("/", (req, res) => {
  res.send(`<div>
    This is Default Route  
    <p>Everything is OK</p>
    </div>`);
});
const PORT = process.env.PORT || 5000;
const pems = selfsigned.generate([{ name: "commonName", value: "localhost" }], {
  days: 365,
});
https
  .createServer({ key: pems.private, cert: pems.cert }, app)
  .listen(PORT, () => {
    console.log(`Server Started on HTTPS PORT ${PORT}`);
  });
