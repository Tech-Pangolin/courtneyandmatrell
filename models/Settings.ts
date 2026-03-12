import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const SettingsSchema = new Schema(
  {
    _id: { type: String, default: "global" },
    venmoHandle: { type: String, default: "CoCoLLC" },
  },
  { timestamps: true }
);

export type Settings = InferSchemaType<typeof SettingsSchema>;

export const SettingsModel =
  (mongoose.models.Settings as Model<Settings>) ||
  mongoose.model<Settings>("Settings", SettingsSchema);

