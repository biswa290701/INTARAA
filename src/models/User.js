import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  resetToken: {
    type: String,
    default: null
  },

  resetTokenExpiry: {
    type: Date,
    default: null
  },

  dateCreated: {
    type: Date,
    default: Date.now
  }
});

export default model("User", userSchema);