import mongoose, { Document, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

interface CommentDocument extends Document {
    _id: Schema.Types.ObjectId;
    content: string;
    video: Schema.Types.ObjectId;
    owner: Schema.Types.ObjectId;
}
const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
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

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model<CommentDocument>(
    "Comment",
    commentSchema,
);
