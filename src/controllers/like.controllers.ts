import { isValidObjectId } from "mongoose";
import { Like } from "../models/like.models";
import ApiError from "../utils/api-error";
import ApiResponse from "../utils/api-response";
import asyncHandler from "../utils/async-handler";
import { Video } from "../models/video.models";
import { Comment } from "../models/comments.models";
import { Tweet } from "../models/tweet.models";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: toggle like on video
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "VideoId is not valid");
    }
    const exists = await Video.findOne({ _id: videoId });
    if (!exists) {
        throw new ApiError(404, "Video not found");
    }
    const result = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id,
    });
    if (!result) {
        const likeRes = await Like.create({
            video: videoId,
            likedBy: req.user?._id,
        });
        if (!likeRes) {
            throw new ApiError(500, "Like not registered");
        }
        return res
            .status(201)
            .json(new ApiResponse(201, likeRes, "Liked successfully"));
    }
    const likeRes = await Like.deleteOne({
        video: videoId,
        likedBy: req.user?._id,
    });
    if (likeRes.deletedCount === 0) {
        throw new ApiError(500, "Like not deleted");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, likeRes, "Disliked successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    //TODO: toggle like on comment
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "CommentId is not valid");
    }
    const exists = Comment.findOne({ _id: commentId });
    if (!exists) {
        throw new ApiError(404, "Comment not found");
    }
    const result = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id,
    });
    if (!result) {
        const likeRes = await Like.create({
            comment: commentId,
            likedBy: req.user?._id,
        });
        if (!likeRes) {
            throw new ApiError(500, "Like not registered");
        }
        return res
            .status(201)
            .json(new ApiResponse(201, likeRes, "Liked successfully"));
    }
    const likeRes = await Like.deleteOne({
        comment: commentId,
        likedBy: req.user?._id,
    });
    if (likeRes.deletedCount === 0) {
        throw new ApiError(500, "Like not deleted");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, likeRes, "Disliked successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    //TODO: toggle like on tweet
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "TweetId is not valid");
    }

    const exists = Tweet.findOne({ _id: tweetId });
    if (!exists) {
        throw new ApiError(404, "tweet not found");
    }

    const result = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id,
    });
    if (!result) {
        const likeRes = await Like.create({
            tweet: tweetId,
            likedBy: req.user?._id,
        });
        if (!likeRes) {
            throw new ApiError(500, "Like not registered");
        }
        return res
            .status(201)
            .json(new ApiResponse(201, likeRes, "Liked successfully"));
    }
    const likeRes = await Like.deleteOne({
        tweet: tweetId,
        likedBy: req.user?._id,
    });
    if (likeRes.deletedCount === 0) {
        throw new ApiError(500, "Like not deleted");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, likeRes, "Disliked successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(401, "Unauthorized request");
    }
    const likes = await Like.find({
        likedBy: userId,
        video: { $exists: true },
    });
    console.log(userId);
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likes,
                likes.length === 0
                    ? "No liked videos found"
                    : `You liked ${likes.length} videos`,
            ),
        );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
