import mongoose, { Document, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

interface VideoDocument extends Document {
    _id: Schema.Types.ObjectId;
    videoFile: string;
    thumbnail: string;
    title: string;
    duration: number;
    views: number;
    isPublished: boolean;
    owner: Schema.Types.ObjectId;
}
const videoSchema = new Schema(
    {
        videoFile: {
            type: String, //cloudinary url
            required: true,
        },
        thumbnail: {
            type: String, //cloudinary url
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    },
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model<VideoDocument>("Video", videoSchema);
