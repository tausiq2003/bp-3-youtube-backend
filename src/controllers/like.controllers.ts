import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model";
import ApiError from "../utils/api-error";
import ApiResponse from "../utils/api-response";
import asyncHandler from "../utils/async-handler";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: toggle like on video
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    //TODO: toggle like on comment
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    //TODO: toggle like on tweet
});

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
