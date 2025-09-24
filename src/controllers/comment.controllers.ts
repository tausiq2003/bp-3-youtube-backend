import { isValidObjectId } from "mongoose";
import { Comment } from "../models/comments.models";
import ApiError from "../utils/api-error";
import ApiResponse from "../utils/api-response";
import asyncHandler from "../utils/async-handler";

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video Id is not valid");
    }
    const comments = await Comment.find({ video: videoId })
        .limit(limitNumber)
        .skip((pageNumber - 1) * limitNumber)
        .sort({ createdAt: -1 });
    const count = await Comment.countDocuments({ video: videoId });
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                comments,
                totalPages: Math.ceil(count / limitNumber),
                currentPage: pageNumber,
            },
            comments.length === 0
                ? "No comments found"
                : "Comments fetched successfully",
        ),
    );
});

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params;
    const { content } = req.body;
    if (!content?.trim()) {
        throw new ApiError(400, "Content not found");
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video Id is not valid");
    }
    const result = await Comment.create({
        content: content,
        video: videoId,
        owner: req.user?._id,
    });
    if (!result) {
        throw new ApiError(500, "Comment creation failed");
    }
    return res
        .status(201)
        .json(new ApiResponse(201, result, "Comment published successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params;
    const { content } = req.body;
    if (!content?.trim()) {
        throw new ApiError(400, "Content not found");
    }
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Comment Id is not valid");
    }
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(401, "Unauthorized request");
    }
    const result = await Comment.findOneAndUpdate(
        { _id: commentId, owner: userId },
        { $set: { content: content } },
        { new: true },
    );
    if (!result) {
        throw new ApiError(404, "Either no comments or operation failed");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, result, "Comments updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Comment Id is not valid");
    }
    const userId = req.user?._id;
    if (!isValidObjectId(userId)) {
        throw new ApiError(401, "Unauthorized request");
    }
    const result = await Comment.deleteOne({ _id: commentId, owner: userId });
    if (result.deletedCount === 0) {
        throw new ApiError(
            404,
            "Comment not found or deleted earlier or Unauthorized request",
        );
    }
    return res
        .status(200)
        .json(new ApiResponse(200, result, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
