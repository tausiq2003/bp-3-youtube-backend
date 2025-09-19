import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model";
import { User } from "../models/user.model";
import ApiError from "../utils/api-error";
import ApiResponse from "../utils/api-response";
import asyncHandler from "../utils/async-handler";

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
});

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
});

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
});

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
