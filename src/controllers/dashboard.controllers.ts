import { Video } from "../models/video.models";
import { Subscription } from "../models/subscription.models";
import { Like } from "../models/like.models";
import ApiResponse from "../utils/api-response";
import asyncHandler from "../utils/async-handler";

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    //total video views of me, total subscribers of me, total videos of me, total likes of me, ok
    //total video views of me
    const totalViews = await Video.aggregate([
        {
            $match: {
                owner: req.user?._id,
            },
        },
        {
            $sum: "$views",
        },
    ]);

    // total subscribers of me
    const totalSubs = await Subscription.countDocuments({
        channel: req.user?._id,
    });
    //total videos of me
    const totalVideos = await Video.countDocuments({ owner: req.user?._id });
    // likes
    const totalLikes = await Like.countDocuments({ likedBy: req.user?._id });
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { totalViews, totalSubs, totalVideos, totalLikes },
                "Dashboard loaded successfully",
            ),
        );
});

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const result = await Video.find({ owner: req.user?._id });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                result,
                result.length === 0
                    ? "No videos found"
                    : `${result.length} videos found`,
            ),
        );
});

export { getChannelStats, getChannelVideos };
