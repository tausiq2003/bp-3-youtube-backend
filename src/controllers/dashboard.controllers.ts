import mongoose from "mongoose";
import { Video } from "../models/video.model";
import { Subscription } from "../models/subscription.model";
import { Like } from "../models/like.model";
import ApiError from "../utils/api-error";
import ApiResponse from "../utils/api-response";
import asyncHandler from "../utils/async-handler";

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
});

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
});

export { getChannelStats, getChannelVideos };
