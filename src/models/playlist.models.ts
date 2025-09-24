import type { Types } from "mongoose";
import mongoose, { Document, Schema } from "mongoose";

interface playlistDocument extends Document {
    _id: Schema.Types.ObjectId;
    name: string;
    description: string;
    videos: Types.Array<Types.ObjectId>;
    owner: Schema.Types.ObjectId;
}

const playlistSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        videos: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
            },
        ],
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true },
);

export const Playlist = mongoose.model<playlistDocument>(
    "Playlist",
    playlistSchema,
);
