import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  location: {
    type: String,
  },
});

const Hospital = mongoose.model("hospital", hospitalSchema);

export default Hospital;
