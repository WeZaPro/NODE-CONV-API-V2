module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      customerID: String,
      convUserId: String,
      userAgent: String,
      ipAddess: String,
      clientID: String,
      // line_access_token: {
      //   type: String,
      //   default: "",
      // },
      utm_source: {
        type: String,
        default: "",
      },
      utm_medium: {
        type: String,
        default: "",
      },
      utm_campaign: {
        type: String,
        default: "",
      },
      utm_term: {
        type: String,
        default: "",
      },
      gg_keyword: {
        type: String,
        default: "",
      },
      session_id: {
        type: String,
        default: "",
      },

      lineUid: {
        type: String,
        default: "",
      },
      lineBotUid: {
        type: String,
        default: "",
      },
      addFriend: {
        type: String,
        default: "",
      },
      eventA: {
        type: String,
        default: "",
      },
      eventB: {
        type: String,
        default: "",
      },
      eventC: {
        type: String,
        default: "",
      },
      eventD: {
        type: String,
        default: "",
      },
      fbEventA: {
        type: String,
        default: "",
      },
      fbEventB: {
        type: String,
        default: "",
      },
      ttEventA: {
        type: String,
        default: "",
      },
      ttEventB: {
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

  const userGTM = mongoose.model("userGTM", schema);
  return userGTM;
};
