module.exports = (app) => {
  const lineBot = require("../controllers/lineChatBot.controller");
  // const db = require("../models");

  var router = require("express").Router();
  const axios = require("axios");
  const bodyParser = require("body-parser");
  app.use(bodyParser.urlencoded({ extended: true }));
  // const Customer = db.customer;
  // const Customer_code = "A002";

  app.post("/saveDataInfo", lineBot.saveDataInfo);
  app.post("/lineUser", lineBot.lineUser);
  app.post("/lineCheckDestination", lineBot.lineCheckDestination);
  app.post("/updateLineBotId", lineBot.updateLineBotId);

  //TODO ENV------------------************
  const clientId = process.env.clientId;
  const clientSecret = process.env.channelSecret;
  const redirectUri = process.env.redirectUri;

  app.get("/", async (req, res) => {
    console.log("--->", req.body);
    res.send("welcome api");
  });

  app.get("/callback", async (req, res) => {
    // console.log("req ", req);
    const requestUrl = req.originalUrl;
    console.log("Request URL:", requestUrl);
    const state = req.query.state;
    console.log("state>>>>> ", state);

    const authorizationCode = req.query.code;

    if (!authorizationCode) {
      return res.status(400).send("Authorization code is missing");
    }

    try {
      const response = await axios.post(
        "https://api.line.me/oauth2/v2.1/token",
        new URLSearchParams({
          grant_type: "authorization_code",
          code: authorizationCode,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const accessToken = response.data.access_token;

      if (accessToken) {
        res.redirect(`${state}?token=${accessToken}`);
      } else {
        // ถ้าเกิดข้อผิดพลาด redirect ไปหน้า Error
        res.redirect(state);
      }
    } catch (error) {
      console.error(
        "Error exchanging code for access token:",
        error.response ? error.response.data : error.message
      );
      // ส่งข้อผิดพลาดที่เจอไปยังผู้ใช้
      res
        .status(500)
        .send(
          `Error exchanging code for access token: ${
            error.response
              ? error.response.data.error_description
              : error.message
          }`
        );
    }
  });

  app.post("/findConvUidToUpdateLineUid", async (req, res) => {
    const db = require("../models");
    const DataGTM = db.userGtms;

    const convUid = req.body.convUserId;
    const lineUid = req.body.lineUid;

    console.log();

    const filter = { convUserId: convUid };
    const update = { lineUid: lineUid };

    DataGTM.findOneAndUpdate(filter, update, {
      new: true,
    })
      .then((data) => {
        if (!data) {
          const notFound = "Not found findconvUserIdAndUpdateLineUid with id ";
          // return notFound;
          res.send({ message: notFound });
        } else {
          // return data;
          res.send({ message: data });
          // res
          //   .status(500)
          //   .send({ message: "Error retrieving fingToken
        }
      })
      .catch((err) => {
        console.log("err ", err);
        // res
        //   .status(500)
        //   .send({ message: "Error retrieving fingTokenFormDestination with id=" + destination });
      });
  });

  app.use("/api/", router);
};
