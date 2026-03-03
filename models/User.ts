import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["guest", "admin"],
      default: "guest",
    },
    rsvpStatus: {
      type: String,
      enum: ["attending", "not_attending", "unknown"],
      default: "unknown",
    },
    guestCount: { type: Number, default: 0 },
    mealPreference: { type: String, default: "" },
    inviteVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof UserSchema>;

export const UserModel =
  (mongoose.models.User as Model<User>) ||
  mongoose.model<User>("User", UserSchema);

