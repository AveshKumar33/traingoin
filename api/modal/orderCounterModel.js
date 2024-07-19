const mongoose = require("mongoose");

const orderCounterSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  orderNo: {
    type: Number,
  },
});

module.exports = mongoose.model("orderCounter", orderCounterSchema);
