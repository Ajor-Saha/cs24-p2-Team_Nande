import mongoose, { Schema } from "mongoose";


const otpSchema = new Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300,
    }, // OTP expires after 10 minutes
  },
  
);

export const OTP = mongoose.model("OTP", otpSchema);