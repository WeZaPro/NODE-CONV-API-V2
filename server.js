const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

var corsOptions = {
  //origin: "http://localhost:8081",
  origin: true, // เปิดหมด
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.mongoose.set("strictQuery", false);
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,

  // autoIndex: false, // Don't build indexes
  //maxPoolSize: 15, // Maintain up to 10 socket connections
  //serverSelectionTimeoutMS: 2000, // Keep trying to send operations for 5 seconds
  //connectTimeoutMS: 2000,
  //socketTimeoutMS: 2000, // Close sockets after 45 seconds of inactivity

  //autoReconnect: true,
  //family: 4 // Use IPv4, skip trying IPv6
};

// db.mongoose.set("strictQuery", false);
// db.mongoose
//   .connect(process.env.MONGODBONLINE, options)
//   .then(() => {
//     console.log("Successfully connect to MongoDB.");
//   })
//   .catch((err) => {
//     console.error("Connection error", err);
//     process.exit();
//   });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bot api application." });
});

require("./app/routes/turorial.routes")(app);
require("./app/routes/userGtm.routes")(app);
require("./app/routes/userAudience.routes ")(app);
//chatbot
require("./app/routes/lineChatBot.routes")(app);
require("./app/routes/customer.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
