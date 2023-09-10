const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

//Setting up the server
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8060;

app.use(cors());
app.use(express.json());

//Setting up routing
app.use("/sales", require("./routes/SalesRoutes"));
app.use("/Buyers", require("./routes/BuyersRoutes"));
app.use("/purchase", require("./routes/PurchaseRoutes"));
app.use("/suppliers", require("./routes/SuppliersRoutes"));
app.use("/products", require("./routes/ProductsRoutes"));
app.use("/expenses", require("./routes/ExpensesRoutes"));
app.use("/reports", require("./routes/ReportsRoutes"));
app.use("/users", require("./routes/UsersRoutes"));
app.use("/roles", require("./routes/RolesRoutes"));
app.use("/rolesPermissions", require("./routes/RolesPermissionsRoutes"));
app.use("/sms", require("./routes/SMSRoutes"));
app.use("/tax", require("./routes/TaxListRouters"));
app.use("/unit", require("./routes/UnitListRoutes"));
app.use("/productCategory", require("./routes/ProductCategoryRoutes"));

app.listen(PORT, () => {
  console.log("Server up with port : " + PORT);
});

//Setting up the database connection
const URL = process.env.MONGODB_URL;

mongoose.set("strictQuery", true);
mongoose.connect(URL, { useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB connection established successfully!");
});
