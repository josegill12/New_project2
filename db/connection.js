const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://josegill1988:Popoff12@cluster0.vhrerpo.mongodb.net"
);

mongoose.connection.on("connected", () => {
  console.log("mongoose is connected");
});
mongoose.connection.on("error", (err) => {
  console.log(err, "mongoose failed to connect");
});

module.exports = mongoose;
