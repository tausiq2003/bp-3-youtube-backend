import mongoose, { Schema } from "mongoose";

interface TweetDocument extends Document {
    _id: Schema.Types.ObjectId;
    content: string;
    owner: Schema.Types.ObjectId;
}

const tweetSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true },
);

export const Tweet = mongoose.model<TweetDocument>("Tweet", tweetSchema);
