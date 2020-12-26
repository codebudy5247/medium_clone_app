const express = require("express");
var colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
//const path = require("path");
const app = express();

//Import routes
const userRoute = require("./routes/userRoutes");

dotenv.config();

//Connect to DB
connectDB();

// Setup static files path
//app.use("/public", express.static(path.join(__dirname, "public")));

//Middleware
app.use(express.json());

//Middleware for consoling every request
app.use((req, res, next) => {
  console.log(`${req.method}`.bold.green + `  ${req.originalUrl}`.dim);
  next();
});

app.get('/',(req,res)=>{
  res.json({
    message:"API is running"
  })
})

//Route middleware
app.use("/api/user", userRoute);

//Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server Up and Running`.yellow.bold);
});
