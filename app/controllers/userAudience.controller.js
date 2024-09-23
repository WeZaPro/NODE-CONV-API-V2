const db = require("../models");
const userAudience = db.userAudience;
const axios = require("axios");
require("dotenv").config();

// user audience =====> start
exports.createUserAudience = (req, res) => {
  try {
    if (!req.body.ipAddress) {
      res.status(400).send({ message: "ipAddress can not be empty!" });
      return;
    }
    const date = new Date();
    const _userAudience = new userAudience({
      userId: req.body.userId,
      botUserId: req.body.botUserId,
      client_id: req.body.client_id,
      lineUid: req.body.lineUid,
      userAgent: req.body.userAgent,
      ipAddress: req.body.ipAddress,
      uniqueEventId: req.body.uniqueEventId,
      sessionId: req.body.sessionId,
      utm_source: req.body.utm_source,
      utm_medium: req.body.utm_medium,
      utm_term: req.body.utm_term,
      timeStamp: date,
    });

    // check cookiesUid in db
    //console.log("userId ==> ", req.body.userId);
    userAudience.findOne(
      // Todo Filter from audience เปลี่ยนจาก IP เป็น userId (cookies) เพราะใช้ ip มันเปลี่ยนไปมา น่าจะมาจาก router wifi
      // { ipAddress: req.body.ipAddress },
      { ipAddress: req.body.ipAddress }, // from gtm api

      // { userId: "1704613370490" },
      function (err, _ipAddress) {
        //console.log("FIND DATA*********==>", _ipAddress);
        //console.log("ipAddressWebStart*********==>", req.body.ipAddressWebStart);
        if (!_ipAddress) {
          console.log("Not Found botUserId ==>SAVE DATA ");
          _userAudience
            .save()
            .then((data) => {
              console.log("save-> ", data);
              res.send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while creating the Tutorial.",
              });
            });

          //saveDataUserAudience(_userAudience, res);
        } else {
          console.log("Found botUserId ==>IGNORE ");
          res.send("FOUND DATA IN DB");
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
  // console.log("Path createUserAudience req.body---> ", req.body);
  // console.log(
  //   "Path createUserAudience req.body.utm_source---> ",
  //   req.body.utm_source
  // );
  // console.log(
  //   "Path createUserAudience req.body.utm_medium---> ",
  //   req.body.utm_medium
  // );
  // console.log(
  //   "Path createUserAudience req.body.utm_term---> ",
  //   req.body.utm_term
  // );

  // console.log(
  //   "Path createUserAudience req.body.ipAddress---> ",
  //   req.body.ipAddress
  // );
  // Validate request
};

// const saveDataUserAudience = (setData, res) => {
//   console.log("saveDataUserAudience-> ", setData);
//   userAudience
//     .save(setData)
//     .then((data) => {
//       console.log("save-> ", data);
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the Tutorial.",
//       });
//     });
// };

// Find a single  ip address in audence
exports.findOneAudience = async (req, res) => {
  try {
    const id = req.params.id;

    var queryData = {
      ipAddress: id,
    };

    userAudience.findOne(queryData, function (err, data) {
      if (!data) {
        console.log("NO DATA AUDIENE IN NODE API-->SAVE DATA ");
        // res.status(404).send({ message: "Not found lineUid " + id });

        res.send({ message: "NO FOUND DATA", sendData: queryData });
      } else {
        console.log("FOUND AUDIECCE DATA --> ", data);
        // res.send(data);
        res.send({ message: "FOUND DATA", sendData: data });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

// user audience =====>

// update line user id from liff web ******
exports.findIpAndUpdate = async (req, res) => {
  try {
    const ip = req.body.ipAddress;
    console.log("ip data--> ", ip);
    const _lineUid = req.body.lineUid;
    const filter = { ipAddress: ip };
    const update = { lineUid: _lineUid };

    await userAudience
      .findOneAndUpdate(filter, update, {
        new: true,
      })
      .then((data) => {
        if (data) {
          res.send(data);
          console.log("***** data--> ", data);
        } else {
          res.send("******not found data");
          console.log("******not found data--> ", data);
        }
      });
  } catch (err) {
    console.log(err);
  }
};

// find line user id from liff app and send data to GA4******
exports.findLineUidSendToGA = async (req, res) => {
  try {
    const _lineUid = req.body.lineUid;
    const _botUserId = req.body.botUserId;

    const filter = { lineUid: _lineUid };
    const update = { botUserId: _botUserId };

    await userAudience
      .findOneAndUpdate(filter, update, {
        new: true,
      })
      .then((sendData) => {
        if (sendData) {
          sendDataGA(sendData, res);
        } else {
          res.send("NODATA AUDIENCE");
        }
      });
  } catch (err) {
    console.log(err);
  }

  // await userAudience
  //   .findOne({ lineUid: _lineUid })
  //   .then((sendData) => {
  //     if (sendData) {
  //       sendDataGA(sendData, res);
  //     } else {
  //       res.send("NODATA AUDIENCE");
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

function sendDataGA(getData, res) {
  try {
    const date = new Date();
    // const _measurement_id = "G-75KFFSMBKP";
    // const _api_secret = "nk_Kg0X7R5W8hERJRekynQ";
    const _measurement_id = process.env.measurement_id;
    const _api_secret = process.env.api_secret;
    let data = JSON.stringify({
      client_id: getData.client_id,
      user_properties: {
        ipAddress: {
          value: getData.ipAddress,
        },
      },
      events: [
        {
          name: process.env.event_tag,
          params: {
            // campaign_id: "google_1234",
            // campaign: "Summer_fun",
            source: getData.utm_source,
            medium: getData.utm_medium,
            term: getData.utm_term,
            // content: "logolink",
            session_id: getData.sessionId,
            //engagement_time_msec: "100",
            ipAddress: getData.ipAddress,
            lineUid: getData.lineUid,
            client_id: getData.client_id,
            uniqueEventId: getData.uniqueEventId,
            sessionId: getData.sessionId,
            userId: getData.userId,
            botUserId: getData.botUserId,
            userAgent: getData.userAgent,
            timeStamp: date,
          },
        },
      ],
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://www.google-analytics.com/mp/collect?measurement_id=${_measurement_id}&api_secret=${_api_secret}`,
      // url: "https://www.google-analytics.com/mp/collect?measurement_id=G-75KFFSMBKP&api_secret=nk_Kg0X7R5W8hERJRekynQ",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log("send event from liffApp to GA4");
        console.log(JSON.stringify(response.data));
        res.send("send event -LineChatRoom- GA4 OK");
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (err) {
    console.log(err);
  }
}
