import { model, Schema } from "mongoose";

const dataScheme = new Schema({
  imei: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: true
  },
  data_name: {
    type: String,
  },
  distance: {
    type: String,
    required: true
  },
  volume: {
    type: String,
    required: true
  },
  correction: {
    type: String,
    required: true
  }
}, {
  collection: 'data'
})

export default model('data', dataScheme)