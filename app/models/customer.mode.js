module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      customer_id: {
        //
        type: String,
        default: "",
      },
      redirect_callback: {
        //
        type: String,
        default: "",
      },
      //-------
      // line_user_id: {
      //   //
      //   type: String,
      //   default: "",
      // },
      // line_bot_id: {
      //   //
      //   type: String,
      //   default: "",
      // },
      line_bot_destination: {
        //
        type: String,
        default: "",
      },
      //-------
      line_liff_login_id: {
        //
        type: String,
        default: "",
      },
      line_liff_url: {
        //
        type: String,
        default: "",
      },
      line_OA: {
        //
        type: String,
        default: "",
      },
      line_reDirect_toLiff: {
        //
        type: String,
        default: "",
      },
      //-------
      line_login_channel_id: {
        //
        type: String,
        default: "",
      },
      line_msg_api_token: {
        //
        type: String,
        default: "",
      },
      line_msg_api_channel_secret: {
        //
        type: String,
        default: "",
      },
      line_login_channel_secret: {
        //
        type: String,
        default: "",
      },
      //-------
      Measurement_id: {
        //
        type: String,
        default: "",
      },
      addFriend_name: {
        //
        type: String,
        default: "",
      },
      addFriend_secret: {
        //
        type: String,
        default: "",
      },
      interest_name: {
        //
        type: String,
        default: "",
      },
      interest_secret: {
        //
        type: String,
        default: "",
      },
      purchaseA_name: {
        //
        type: String,
        default: "",
      },
      purchaseA_secret: {
        //
        type: String,
        default: "",
      },
      //-------
      fb_pixel: {
        //
        type: String,
        default: "",
      },
      fb_token: {
        //
        type: String,
        default: "",
      },
      fb_testCode: {
        //
        type: String,
        default: "",
      },
      fb_eventA: {
        //
        type: String,
        default: "",
      },
      fb_eventB: {
        //
        type: String,
        default: "",
      },
      //-------
      tt_pixel: {
        //
        type: String,
        default: "",
      },
      tt_token: {
        //
        type: String,
        default: "",
      },
      tt_testCode: {
        //
        type: String,
        default: "",
      },
      tt_eventA: {
        //
        type: String,
        default: "",
      },
      tt_eventB: {
        //
        //
        type: String,
        default: "",
      },
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const customer = mongoose.model("customerData", schema);
  return customer;
};
