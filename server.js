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
  res.send(`<h1>A Node Js API is listening on port ${process.env.PORT}❗❗❗👌😒</h1>`);
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
const Cart = require("./User/routes/cart");
const fabric = require("./User/routes/fabric");
const User = require('./User/routes/user');
const Order = require('./User/routes/order');
const Banner = require("./User/routes/banner");
// middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/auth", Auth);
app.use("/api/auth", AdminAuth);
app.use("/api", Coures);
app.use("/api", Class);
app.use("/api", Cart);
app.use("/api", Rating);
app.use('/api', fabric);
app.use("/api", Banner);
app.use('/api', User);
app.use('/api', Order);




var PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`A Node Js API is listening on port: ${PORT}`);
});
