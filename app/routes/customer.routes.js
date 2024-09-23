module.exports = (app) => {
  // const tutorials = require("../controllers/tutorial.controller.js");
  const customer = require("../controllers/customer.controller");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", customer.create);

  router.post("/searchCusId", customer.searchCusId);
  router.post("/searchCusData", customer.searchCusData);
  // find cus id -> update line uid , bot uid , bot destination
  router.post("/findAndUpdateLine", customer.findAndUpdateLine);

  app.use("/api/customer", router);
};
