const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

app.get("/", (req, res) => {
  res.send("<h1>Bingo, Your Location is now  Compromised❗❗❗👌😒</h1>");
});

mongoose
  .connect(process.env.MONGO_URI, {
  })
  .then(() => console.log("DB Connected"));

mongoose.connection.on("error", (err) => {
  console.log(`DB connection error: ${err.message}`);
});


const Auth = require("./User/routes/user");
const AdminAuth = require("./User/routes/admin");
const Coures = require("./User/routes/coures");
const Class = require("./User/routes/class");
const Rating = require("./User/routes/rating");

// middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/auth",Auth);
app.use("/api/auth",AdminAuth);
app.use("/api",Coures);
app.use("/api",Class);
app.use("/api",Rating);



var PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`A Node Js API is listening on port: ${PORT}`);
});
