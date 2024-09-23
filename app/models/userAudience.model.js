module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      userId: String,
      client_id: String,
      userAgent: String,
      ipAddress: String,
      uniqueEventId: String,
      sessionId: String,
      timeStamp: String,
      utm_source: String,
      utm_medium: String,
      utm_term: String,
      lineUid: String,
      botUserId: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const userAudience = mongoose.model("userAudience", schema);
  return userAudience;
};
