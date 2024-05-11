import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const workerSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    employeeId: {
      type: Number,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ['Worker', 'Citizen'],
      required: true
    },
    refreshToken: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    contractorCompany: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    dateOfHire: {
      type: Date,
    },
    jobTitle: {
      type: String,
    },
    paymentRatePerHour: {
      type: Number,
    },
    assignedCollectionRoute: {
        latitude: {
            type: Number,
        },
        longitude: {
            type: Number,
        }
    },
  },
  { timestamps: true }
);

workerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

workerSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

workerSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

workerSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const Worker = mongoose.model("Worker", workerSchema);
