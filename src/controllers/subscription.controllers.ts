import { isValidObjectId } from "mongoose";
import { User } from "../models/users.models";
import { Subscription } from "../models/subscription.models";
import ApiError from "../utils/api-error";
import ApiResponse from "../utils/api-response";
import asyncHandler from "../utils/async-handler";

interface PopulatedUser {
    _id: string;
    username: string;
    firstname: string;
}

interface SubscriptionWithSubscriber {
    _id: string;
    subscriber: PopulatedUser;
    channel: string;
}

interface SubscriptionWithChannel {
    _id: string;
    subscriber: string;
    channel: PopulatedUser;
}

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    // TODO: toggle subscription
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Channel id is not valid");
    }
    if (channelId === req.user?._id.toString()) {
        throw new ApiError(400, "User cannot subscribe it own channel");
    }
    //subscriber is me, channel is them
    //first check whether the channel is existing or not
    const result = await User.findOne({ _id: channelId });
    if (!result?._id) {
        throw new ApiError(404, "Channel not found");
    }
    const isSubscribed = await Subscription.findOne({
        subscriber: req.user?._id,
        channel: channelId,
    });
    if (!isSubscribed) {
        const subRes = await Subscription.create({
            subscriber: req.user?._id,
            channel: channelId,
        });
        if (!subRes) {
            throw new ApiError(
                500,
                "Subscribe couldn't proceed due to internal error",
            );
        }
        return res
            .status(201)
            .json(new ApiResponse(201, subRes, "Subscribed successfully"));
    }
    const deleteSub = await Subscription.deleteOne({
        subscriber: req.user?._id,
        channel: channelId,
    });
    if (deleteSub.deletedCount === 0) {
        throw new ApiError(
            404,
            "Cannot delete sub or it was already deleted or unauthorized request",
        );
    }
    return res
        .status(200)
        .json(new ApiResponse(200, deleteSub, "Unsubscribed successfully"));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    // get a channel and get its subscribers
    // we don't have to check the existence of channelId as while creating its checked and if not it will return 0, don't overthink
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "channel Id is not valid");
    }
    //this will get all the documents with channelId
    const result = await Subscription.find({ channel: channelId })
        .populate("subscriber", "username firstname")
        .lean();
    //{_id, _subscriber: username, firstname, channel}
    const resultSub = (result as unknown as SubscriptionWithSubscriber[]).map(
        (sub) => ({
            id: sub.subscriber._id,
            username: sub.subscriber.username,
            firstName: sub.subscriber.firstname,
        }),
    );
    const response = {
        channelId,
        totalSubs: resultSub.length,
        subscribers: resultSub,
    };
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                response,
                resultSub.length === 0
                    ? "No subscribers found"
                    : `Found ${resultSub.length} subscribers`,
            ),
        );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    //here we have get whom user has subscribed,
    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "subscriber id is not valid");
    }
    const result = await Subscription.find({
        subscriber: subscriberId,
    })
        .populate("channel", "username firstname")
        .lean();

    const resultSub = (result as unknown as SubscriptionWithChannel[]).map(
        (sub) => ({
            id: sub.channel._id,
            username: sub.channel.username,
            firstName: sub.channel.firstname,
        }),
    );
    const response = {
        subscriberId,
        totalSubs: resultSub.length,
        channels: resultSub,
    };
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                response,
                resultSub.length === 0
                    ? "No channels found"
                    : `Found ${resultSub.length} subscriptions`,
            ),
        );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
