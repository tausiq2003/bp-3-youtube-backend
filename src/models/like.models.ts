import mongoose, { Document, Schema } from "mongoose";

interface LikeDocument extends Document {
    _id: Schema.Types.ObjectId;
    video?: Schema.Types.ObjectId;
    comment?: Schema.Types.ObjectId;
    tweet?: Schema.Types.ObjectId;
    likedBy: Schema.Types.ObjectId;
}
const likeSchema = new Schema(
    {
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet",
        },
        likedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true },
);

export const Like = mongoose.model<LikeDocument>("Like", likeSchema);
