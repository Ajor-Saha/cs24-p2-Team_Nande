import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema({
    name: {
      type: String,
      require: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
  },
  { timestamps: true }
);

export const Role = mongoose.model("Role", roleSchema);
