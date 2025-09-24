import mongoose, { Document, Schema } from "mongoose";

interface subscriptionDocument extends Document {
    _id: Schema.Types.ObjectId;
    subscriber: Schema.Types.ObjectId;
    channel: Schema.Types.ObjectId;
}
const subscriptionSchema = new Schema(
    {
        subscriber: {
            type: Schema.Types.ObjectId, // one who is subscribing
            ref: "User",
        },
        channel: {
            type: Schema.Types.ObjectId, // one to whom 'subscriber' is subscribing
            ref: "User",
        },
    },
    { timestamps: true },
);

export const Subscription = mongoose.model<subscriptionDocument>(
    "Subscription",
    subscriptionSchema,
);
