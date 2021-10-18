const mongoose = require("mongoose");
const { mongoPath } = require(ROOT_PATH + "/../config.json");

module.exports = async () => {
  await mongoose.connect(mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return mongoose;
};