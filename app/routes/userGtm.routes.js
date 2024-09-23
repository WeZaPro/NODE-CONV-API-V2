module.exports = (app) => {
  // const tutorials = require("../controllers/tutorial.controller.js");
  const userGtms = require("../controllers/userGTM.controller");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", userGtms.create);

  // Retrieve all Tutorials
  router.get("/", userGtms.findAll);

  // Retrieve all published Tutorials
  router.get("/published", userGtms.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", userGtms.findOne);

  // Update a Tutorial with id
  router.put("/:id", userGtms.update);

  // Delete a Tutorial with id
  router.delete("/:id", userGtms.delete);

  // Create a new Tutorial
  router.delete("/", userGtms.deleteAll);

  // test GA4
  router.post("/GA4", userGtms.ga4);

  app.use("/api/userGtms", router);
};
