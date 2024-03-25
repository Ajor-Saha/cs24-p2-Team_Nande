import mongoose, { Schema } from "mongoose";

const permissionSchema = new Schema({
    name: {
      type: String,
      require: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Permission = mongoose.model("Permission", permissionSchema);
