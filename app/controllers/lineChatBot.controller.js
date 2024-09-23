const db = require("../models");
const https = require("https");

const LineBot = db.getMessage;
const DataGTM = db.userGtms;
const Customer = db.customer;
require("dotenv").config();
const liff = require("@line/liff");
const axios = require("axios");

// API CHAT BOT
const line = require("@line/bot-sdk");
//TODO ENV------------------************
const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

// function confirmSaveDb(req, res, channelAccessToken, uri) {
function confirmSaveDb(req, res, uri) {
  console.log("req.body.destination ", req.body.destination);

  try {
    const botUid = req.body.events[0].source.userId;
    if (req.body.events[0].message.type === "text") {
      // not stricker

      const dataString = JSON.stringify({
        replyToken: req.body.events[0].replyToken,
        //   messages: samplePayload(),

        messages: setRegister(botUid, req.body.destination, uri),

        //   ],
      });

      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + channelAccessToken,
      };

      const webhookOptions = {
        hostname: "api.line.me",
        path: "/v2/bot/message/reply",
        method: "POST",
        headers: headers,
        body: dataString,
      };

      const request = https.request(webhookOptions, (res) => {
        res.on("data", (d) => {
          process.stdout.write(d);
        });
      });

      request.on("error", (err) => {
        console.error(err);
      });

      request.write(dataString);
      request.end();

      //=====> end
    } else {
      console.log("message type = !text");
      res.status(200).send({
        message: "message type = !text",
      });
    }
  } catch (err) {
    console.log(err);
  }
}

function setRegister(botUid, getLineDestination, uri) {
  const testParam = botUid;

  var urlLiff = process.env.liffChat;
  console.log("urlLiff -> ", testParam);
  return [
    {
      type: "template",
      altText: "this is a confirm template",
      template: {
        type: "confirm",
        text: "ต้องการที่จะติดต่อพนักงานหรือไม่?",
        actions: [
          {
            // type: "message",
            // label: "YES",
            // text: lineUserId,
            //
            type: "uri",
            label: "YES",
            // uri: `${urlLiff}/?botUserId=${lineUserId}`,
            uri: uri,
            // uri: `${urlLiff}/?botUserId=${botUid}&lineDestination=${getLineDestination}`,
          },
          {
            type: "uri",
            label: "NO",
            uri: `${urlLiff}/?lineUserId=${botUid}`,
          },
          // {
          //   type: "message",
          //   label: "NO",
          //   text: "NO",
          // },
        ],
      },
    },
  ];
}

exports.saveDataInfo = async (req, res) => {
  // get data from website ผ่าน gtm แล้ว save to mongo
  const gtmData = new DataGTM({
    customerID: req.body.customerID,
    convUserId: req.body.convUserId,
    userAgent: req.body.userAgent,
    ipAddess: req.body.ipAddess,
    clientID: req.body.clientID,
    // line_access_token: req.body.line_access_token,
    utm_campaign: req.body.utm_campaign,
    utm_source: req.body.utm_source,
    utm_medium: req.body.utm_medium,
    utm_term: req.body.utm_term,
    gg_keyword: req.body.gg_keyword,
    session_id: req.body.session_id,
  });

  // console.log("-------------IPADDRESS----------------", req.body.ipAddess);
  // console.log("gtmData --------", gtmData);
  if (gtmData.utm_source && gtmData.utm_medium) {
    // console.log("Save db --------");
    // console.log("utm_source ", gtmData.utm_source);
    // console.log("utm_medium ", gtmData.utm_medium);
    DataGTM.findOne(
      { convUserId: req.body.convUserId },
      // { ipAddess: req.body.ipAddess },
      function (err, _dataGTM) {
        console.log("-------------_dataGTM-------------------------", _dataGTM);

        if (_dataGTM) {
          console.log("พบข้อมูล _dataGTM >>>>> ", _dataGTM);
        } else {
          console.log("ไม่พบข้อมูล _dataGTM  & SAVE >>>>> ", _dataGTM);
          gtmData.save().then((dataSave) => {
            // console.log("dataSave ", dataSave);
            // res.send({ message: "save data ok", sendData: dataSave });
            res
              .status(200)
              .send({ message: "save data ok", sendData: dataSave });
          });
        }
      }
    );
  } else {
    console.log("---------------------------------------------");
    console.log("Don't Save db ขาดข้อมูล UTM --------");
    // console.log("utm_source ", gtmData.utm_source);
    // console.log("utm_medium ", gtmData.utm_medium);
  }
};
//

exports.lineCheckDestination = async (req, res) => {
  // console.log("req.body.events ", req.body.events[0]);
  // console.log("req.body.destination ", req.body.destination);
  res.send({ message: "testLine" });
};

exports.updateLineBotId = async (req, res) => {
  console.log("req.body.lineUid ", req.body.lineUid);
  console.log("req.body.lineBotUid ", req.body.lineBotUid);
  try {
    if (req.body.lineUid && req.body.lineBotUid) {
      const filter = { lineUid: req.body.lineUid };
      const update = {
        lineBotUid: req.body.lineBotUid,
      };
      // Use the options to return the updated document
      const addLineBotUid = await DataGTM.findOneAndUpdate(filter, update, {
        new: true,
      });
      console.log("addLineBotUid ", addLineBotUid);
      res.send({ message: "updateLineBotId" });
    } else {
      res.send({ message: "no data request" });
    }
  } catch (err) {
    console.log("err ", err);
  }
};

const lineSend = async function (req, lineUserData) {
  console.log("lineSend lineUserData ", lineUserData);
  const config = {
    channelAccessToken: lineUserData._channel_access_token,
    channelSecret: lineUserData._line_msg_api_channel_secret,
  };
  const client_line = new line.Client(config);

  // const lineUid = req.body.events[0].source.userId;

  const userId = req.body.events[0].source.userId;
  const profile = await client_line.getProfile(userId);

  //ADD FRIEND
  const addNewFriend = {
    measurement_id: lineUserData._ga4_id,
    secret_value: lineUserData._addNewFriend_secret,
    event: lineUserData._addNewFriend_event,
  };

  const purchase = {
    measurement_id: lineUserData._ga4_id,
    secret_value: lineUserData._purchaseA_secret,
    event: lineUserData._purchaseA_event,
  };

  const interest = {
    measurement_id: lineUserData._ga4_id,
    secret_value: lineUserData._interest_secret,
    event: lineUserData._interest_event,
  };

  console.log("req.body.events[0] ", req.body.events[0]);

  try {
    if (
      req.body.events[0].type == "message" ||
      req.body.events[0].type == "text"
    ) {
      console.log(
        "TYPE Message============> ",
        req.body.events[0].message.text
      );
      const getText = req.body.events[0].message.text;
      let messageBack = ""; // Use let instead of const to allow reassignment

      const checkTextA = "สนใจ";
      const checkTextB = "สั่งซื้อ";
      const isInterest = getText.includes(checkTextA);
      const isPurchase = getText.includes(checkTextB);

      console.log("isPurchase ", isPurchase);
      console.log("isInterest ", isInterest);

      const START = "START";
      // console.log("isInterest ", isInterest);

      if (isInterest) {
        // console.log("interest case");
        messageBack = `${checkTextA} = interest case`;
        console.log("interest ", interest);
        await fnAddConv(userId, interest);
        // ส่งข้อความตอบกลับผู้ใช้
        return client_line.replyMessage(req.body.events[0].replyToken, {
          type: "text",
          text: `SEND CASE ${messageBack}! `,
        });
      } else if (isPurchase) {
        // console.log("purchase case");
        messageBack = `${checkTextB} = purchase case`;
        await fnAddConv(userId, purchase);
        // ส่งข้อความตอบกลับผู้ใช้
        return client_line.replyMessage(req.body.events[0].replyToken, {
          type: "text",
          text: `SEND CASE ${messageBack}! `,
        });
      } else {
        // รับ TEXT จาก LIFF WEB
        //Todo
        // update bot User ID
        messageBack = ` = update userid case`;
        console.log("normal text>>>>");
      }
    } else if (req.body.events[0].type == "follow") {
      console.log("TYPE FOLLOW============> ");

      await fnAddConv(userId, addNewFriend);

      // ส่งข้อความตอบกลับผู้ใช้
      return client_line.replyMessage(req.body.events[0].replyToken, {
        type: "text",
        text: `Hello ${profile.displayName}! Your user ID is ${profile.userId}.`,
      });
    }
  } catch (err) {
    console.error("Error getting profile:", err);
  }
};

exports.lineUser = async (req, res) => {
  // const open = (await import("open")).default;
  console.log("req.body ", req.body);
  let lineUserData = {};
  var urlLiff = process.env.liffChat;
  const _lineUserId = req.body.events[0].source.userId;
  const _getLineDestination = req.body.destination;
  const uri = `${urlLiff}/?botUserId=${_lineUserId}&lineDestination=${_getLineDestination}`;
  // console.log("req.body>>>>>>>>>>>>>>> ", req.body);
  console.log("req.source>>>>>>>>>>>>>>> ", req.body.events[0].source);
  // const getLineDestination = req.body.destination;
  console.log("getLineDestination>>>>>>>>>>>>>>> ", req.body.destination);
  console.log("userId>>>>>>>>>>>>>>> ", req.body.events[0].source.userId);
  // const dataFromDes = await getCusDataFromDestination(getLineDestination);
  // console.log("dataFromDes >>>>>>>>>>>>>>> ", dataFromDes);

  //TODO ให้เช็ค Bot Id ใน CUSTOMER ก่อน ถ้ามีกึง Init data
  // init line user data
  try {
    DataGTM.findOne(
      { lineBotUid: req.body.events[0].source.userId },
      async function (err, _userId) {
        // console.log(" DataGTM.findOne_userId => ", _userId);
        if (_userId === null) {
          console.log("_userId-->null ");
          //Todo send message confirm save
          // confirmSaveDb(req, res, config_line.channelAccessToken, uri);
          confirmSaveDb(req, res, uri);
          // กด yes บน reply จะส่ง botUid ไปกับ param และ find lineUid -> update botUid
          // open(uri);
        } else {
          console.log("req.body.events[0].--> ", req.body.events[0]);

          const dataFromDes = await getCusDataFromDestination(
            _getLineDestination
          );
          // console.log("dataFromDes-> ", dataFromDes);

          if (dataFromDes) {
            //TODO
            // 1. ใช้
            lineUserData = {
              msg: "Hello Bot",
              _customer_id: dataFromDes.customer_id,
              _channel_access_token: dataFromDes.line_msg_api_token,
              _line_msg_api_channel_secret:
                dataFromDes.line_msg_api_channel_secret,
              _line_bot_destination: dataFromDes.line_bot_destination,
              _line_login_channel_id: dataFromDes.line_login_channel_id,
              _line_login_channel_secret: dataFromDes.line_login_channel_secret,
              _line_reDirect_toLiff: dataFromDes.line_reDirect_toLiff,
              _line_liff_login_id: dataFromDes.line_liff_login_id,
              _line_liff_url: dataFromDes.line_liff_url,

              _ga4_id: dataFromDes.Measurement_id,
              _addNewFriend_secret: dataFromDes.addFriend_secret,
              _addNewFriend_event: dataFromDes.addFriend_name,
              _purchaseA_secret: dataFromDes.purchaseA_secret,
              _purchaseA_event: dataFromDes.purchaseA_name,
              _interest_secret: dataFromDes.interest_secret,
              _interest_event: dataFromDes.interest_name,

              fb_pixel: dataFromDes.fb_pixel,
              fb_token: dataFromDes.fb_token,
              fb_testCode: dataFromDes.fb_testCode,
              fb_eventA: dataFromDes.fb_eventA,
              fb_eventB: dataFromDes.fb_eventB,

              tt_pixel: dataFromDes.tt_pixel,
              tt_token: dataFromDes.tt_token,
              tt_testCode: dataFromDes.tt_testCode,
              tt_eventA: dataFromDes.tt_eventA,
              tt_eventB: dataFromDes.tt_eventB,
            };
            // console.log("lineUserData >>>>>>>>>>>>>>> ", lineUserData);

            lineSend(req, lineUserData);
          }
        }
      }
    );
  } catch (err) {
    console.log("err ", err);
  }
};

// };

const getCusDataFromDestination = async function (_destination) {
  console.log("getCusDataFromDestination _destination ", _destination);
  try {
    const data = await Customer.find({ line_bot_destination: _destination });
    // console.log("data >>>>> : ", data);
    if (data && data.length > 0) {
      // console.log("lineCusData[0] : ", data[0]);
      return data[0];
    } else {
      console.log("No data found");
      return null; // or return something appropriate if no data
    }
  } catch (err) {
    console.log("Error: ", err);
    return null; // return error handling value if needed
  }
};

const fnAddConv = async function (userId, getEnv) {
  console.log("getEnv ", getEnv);
  console.log("getEnv secret_value ", getEnv.secret_value);
  console.log("getEnv event ", getEnv.event);

  try {
    let update = "";
    if (getEnv.event === "addFriend") {
      update = { addFriend: true };
    } else if (getEnv.event === "interest") {
      update = { eventA: true };
    } else if (getEnv.event === "PurchaseA") {
      update = { eventB: true };
    } else {
      update = { eventC: "na" };
    }

    const filter = { lineBotUid: userId };
    console.log("ADD CONVERSION TO DB filter==>> ", filter);
    console.log("ADD CONVERSION TO DB update==>> ", update);
    // Use the options to return the updated document
    const addConv = await DataGTM.findOneAndUpdate(filter, update, {
      new: true,
    });
    await sendToGa4(userId, getEnv);
    console.log("addConv ", addConv);
    // goto GA4 API Conversion
  } catch (error) {
    console.error("Error updating addFriend: ", error);
  }
};

const sendToGa4 = async function (userId, getEnv) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const api_secret = getEnv.secret_value; // Corrected 'api_secre' to 'api_secret'
  const measurement_id = getEnv.measurement_id;

  try {
    const query = await DataGTM.findOne({ lineBotUid: userId });
    console.log("findOne query>>>>>>>>>>>", query); // จะแสดงค่าที่ค้นหาเจอ

    if (query) {
      const raw = {
        client_id: query.clientID,
        user_properties: { ipAddress: { value: query.ipAddess } },
        events: [
          {
            name: getEnv.event,
            params: {
              convUserId: query.convUserId,
              campaign: query.utm_campaign,
              source: query.utm_source,
              medium: query.utm_medium,
              term: query.utm_term,
              content: query.gg_keyword,
              session_id: query.session_id,
              // engagement_time_msec: "100",
            },
          },
        ],
      };

      console.log("raw>>>>>>> ", JSON.stringify(raw));

      const response = await axios.post(
        `https://www.google-analytics.com/mp/collect?measurement_id=${measurement_id}&api_secret=${api_secret}`,
        raw,
        {
          headers: myHeaders,
        }
      );

      // console.log("response status>>>>>>> ", response.status);
      // console.log("response headers>>>>>>> ", response.headers);
      // console.log("response data>>>>>>> ", response.data);
    }
  } catch (error) {
    console.error("Error with axios: ", error);
  }
};
