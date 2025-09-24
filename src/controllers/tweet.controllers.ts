import { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.models";
import ApiError from "../utils/api-error";
import ApiResponse from "../utils/api-response";
import asyncHandler from "../utils/async-handler";

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body;
    if (!content?.trim()) {
        throw new ApiError(400, "Content not found");
    }
    const result = await Tweet.create({
        content: content,
        owner: req.user?._id,
    });
    if (!result) {
        throw new ApiError(500, "Tweet failed");
    }
    return res
        .status(201)
        .json(new ApiResponse(201, result, "Tweet published successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "user id not valid");
    }
    const tweets = await Tweet.find({ owner: userId });
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tweets,
                tweets.length === 0
                    ? "No tweets found"
                    : `Found ${tweets.length} tweets`,
            ),
        );
});

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params;
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Tweet Id is not valid");
    }
    const { content } = req.body;
    if (!content) {
        throw new ApiError(400, "Content not found");
    }
    const userId = req.user?._id;
    if (!isValidObjectId(userId)) {
        throw new ApiError(401, "Unauthorized request");
    }
    const result = await Tweet.findOneAndUpdate(
        { _id: tweetId, owner: userId },
        { $set: { content: content } },
        { new: true },
    );
    if (!result) {
        throw new ApiError(404, "Either no tweets or operation failed");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, result, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params;
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Tweet Id is not valid");
    }
    const userId = req.user?._id;
    if (!isValidObjectId(userId)) {
        throw new ApiError(401, "Unauthorized request");
    }
    const tweet = await Tweet.deleteOne({ _id: tweetId, owner: userId });
    if (tweet.deletedCount === 0) {
        throw new ApiError(
            404,
            "Tweet not found or already deleted earlier or you are not authorized to delete it",
        );
    }
    return res
        .status(200)
        .json(new ApiResponse(200, tweet, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
