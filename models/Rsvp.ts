import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const RsvpSchema = new Schema(
  {
    inviteCode: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    attendees: { type: Number, default: 1 },
    rsvpStatus: {
      type: String,
      enum: ["attending", "not_attending"],
      required: true,
    },
    note: { type: String },
  },
  { timestamps: true }
);

export type Rsvp = InferSchemaType<typeof RsvpSchema>;

export const RsvpModel =
  (mongoose.models.Rsvp as Model<Rsvp>) || mongoose.model<Rsvp>("Rsvp", RsvpSchema);

