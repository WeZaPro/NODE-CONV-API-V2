// Create and Save a new Tutorial
const db = require("../models");
const https = require("https");
const Customer = db.customer;
const DataGTM = db.userGtms;

require("dotenv").config();
//TODO update line id , bot id , bot destination
//TODO ในขั้นตอนการ save bot id คือกด OK จาก chat
//TODO โดย เอา line id ไป Find custome (customer id)
exports.create = async (req, res) => {
  console.log("Customer Create---> ", req.body);
  try {
    const customer = new Customer({
      customer_id: req.body.customer_id, //fix ค่า

      line_bot_destination: req.body.line_bot_destination,
      // line_user_id: req.body.line_user_id,
      // line_bot_id: req.body.line_bot_id,
      line_OA: req.body.line_OA, //fix ค่า
      redirect_callback: req.body.redirect_callback,

      line_liff_login_id: req.body.line_liff_login_id, //fix ค่า
      line_login_channel_id: req.body.line_login_channel_id, //fix ค่า
      line_login_channel_secret: req.body.line_login_channel_secret, //fix ค่า

      line_liff_url: req.body.line_liff_url, //fix ค่า
      line_reDirect_toLiff: req.body.line_reDirect_toLiff, //fix ค่า

      line_reDirect_toLiff: req.body.line_reDirect_toLiff, //fix ค่า
      line_liff_login_id: req.body.line_liff_login_id, //fix ค่า

      line_msg_api_token: req.body.line_msg_api_token, //fix ค่า
      line_msg_api_channel_secret: req.body.line_msg_api_channel_secret,

      Measurement_id: req.body.Measurement_id, //fix ค่า

      addFriend_name: req.body.addFriend_name, //fix ค่า
      addFriend_secret: req.body.addFriend_secret, //fix ค่า

      interest_name: req.body.interest_name, //fix ค่า
      interest_secret: req.body.interest_secret, //fix ค่า

      purchaseA_name: req.body.purchaseA_name, //fix ค่า
      purchaseA_secret: req.body.purchaseA_secret, //fix ค่า

      fb_pixel: req.body.fb_pixel, //fix ค่า
      fb_token: req.body.fb_token, //fix ค่า
      fb_testCode: req.body.fb_testCode,
      fb_eventA: req.body.fb_eventA, //fix ค่า
      fb_eventB: req.body.fb_eventB, //fix ค่า

      tt_pixel: req.body.tt_pixel, //fix ค่า
      tt_token: req.body.tt_token, //fix ค่า
      tt_testCode: req.body.tt_testCode,
      tt_eventA: req.body.tt_eventA, //fix ค่า
      tt_eventB: req.body.tt_eventB, //fix ค่า
    });

    console.log("customer Create---> ", customer);

    // Save Tutorial in the database
    await customer
      .save(customer)
      .then((data) => {
        // res.send(data);
        res.send({ message: "save customer data", data: data });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial.",
        });
      });
  } catch (err) {
    console.log("err ", err);
  }
};
exports.searchCusData = (req, res) => {
  console.log("req.body.cus_id ", req.body.cus_id);
  try {
    Customer.findOne({ customer_id: req.body.cus_id })
      .then((cusData) => {
        if (!cusData)
          res.status(404).send({
            message: "Not found findCusId with id " + req.body.cus_id,
          });
        else res.send(cusData);
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error retrieving findCusId with id=" + _line_user_id,
        });
      });
  } catch (err) {
    console.log("err ", err);
  }
};

exports.searchCusId = (req, res) => {
  const _cus_id = req.body.cus_id;
  console.log("find _line_user_id data ", _cus_id);
  try {
    DataGTM.findOne({ customerID: _cus_id })
      .then((data) => {
        if (!data)
          res
            .status(404)
            .send({ message: "Not found findCusId with id " + _cus_id });
        else
          res.send({
            message: "send customer data",
            data: data,
          });
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error retrieving findCusId with id=" + _cus_id,
        });
      });
  } catch (err) {
    console.log("err ", err);
  }
  // res.send("search data");
};

exports.findAndUpdateLine = async (req, res) => {
  const filter = { customer_id: req.body.customer_id };
  const update = {
    line_bot_destination: req.body.line_bot_destination,
    // line_user_id: req.body.line_user_id,
    // line_bot_id: req.body.line_bot_id,
  };
  console.log("find customer data ", filter);
  try {
    const updateLineData = await Customer.findOneAndUpdate(filter, update, {
      new: true,
    });
    if (updateLineData) {
      res.send({ message: "update data " });
    } else {
      res.send({ message: "connot update data " });
    }
  } catch (err) {
    console.log("err ", err);
  }
};

exports.lineAddFriend = (req, res) => {
  const cusId = req.body.customerID;

  Customer.findOne({ customerID: cusId })
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: "Not found findCusId with id " + cusId });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving findCusId with id=" + cusId });
    });
  // res.send("search data");
};
