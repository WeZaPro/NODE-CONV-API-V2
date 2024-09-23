module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      inputMessage: String,
      userId: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const getMessage = mongoose.model("getMessage", schema);
  return getMessage;
};
