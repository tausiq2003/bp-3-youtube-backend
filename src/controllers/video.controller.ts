import { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models";
import ApiError from "../utils/api-error";
import ApiResponse from "../utils/api-response";
import asyncHandler from "../utils/async-handler";
import {
    deleteFromCloudinary,
    uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { publishVideoValidator } from "../validators/videos.validators";
import validatePayload from "../utils/validation";

const getAllVideos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query = "",
        sortBy = "createdAt",
        sortType = "desc",
        userId,
    } = req.query;
    //TODO: get all videos based on query, sort, pagination
    interface MatchConditions {
        isPublished: boolean;
        $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
        owner?: string;
    }
    const matchConditions: MatchConditions = { isPublished: true };

    if (query && typeof query === "string") {
        matchConditions.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
        ];
    }

    if (userId && typeof userId === "string" && isValidObjectId(userId)) {
        matchConditions.owner = userId;
    }
    interface SortOptions {
        [key: string]: 1 | -1;
    }

    const sortOptions: SortOptions = {};
    if (typeof sortBy === "string") {
        sortOptions[sortBy] = sortType === "asc" ? 1 : -1;
    }

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;

    const videos = await Video.aggregate([
        { $match: matchConditions },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                owner: { $first: "$owner" },
            },
        },
        { $sort: sortOptions },
        { $skip: skip },
        { $limit: limitNum },
    ]);
    const totalVideos = await Video.countDocuments(matchConditions);
    const totalPages = Math.ceil(totalVideos / limitNum);
    const response = {
        videos,
        pagination: {
            currentPage: pageNum,
            totalPages,
            totalVideos,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1,
        },
    };
    return res
        .status(200)
        .json(new ApiResponse(200, response, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video

    const validationData = await validatePayload(
        publishVideoValidator,
        req.body,
    );
    if ("error" in validationData) {
        throw new ApiError(400, "Validation failed", validationData.error);
    }
    const { title, description } = validationData;
    console.log(title);

    if (!req.files || Array.isArray(req.files)) {
        throw new ApiError(400, "Files missing");
    }
    const files = req.files as { [field: string]: Express.Multer.File[] };
    if (!files.thumbnail?.[0]) {
        throw new ApiError(400, "Thumbnail is required");
    }
    if (!files.thumbnail?.[0].mimetype.startsWith("image/")) {
        throw new ApiError(400, "Uploaded file is not an image");
    }
    if (!files.videoFile?.[0]) {
        throw new ApiError(400, "Video is required");
    }
    if (!files.videoFile?.[0].mimetype.startsWith("video/")) {
        throw new ApiError(400, "Uploaded file is not a video");
    }
    console.log("hey");
    console.log(files.videoFile?.[0].path);
    console.log(files.thumbnail?.[0].path);

    const videoUrl = await uploadOnCloudinary(files.videoFile?.[0].path);
    const thumbnailUrl = await uploadOnCloudinary(files.thumbnail?.[0].path);
    if (!(videoUrl?.url && thumbnailUrl?.url)) {
        throw new ApiError(500, "video url or thumbnail url not found");
    }
    const video = await Video.create({
        title: title,
        description: description,
        videoFile: videoUrl.url,
        thumbnail: thumbnailUrl.url,
        duration: videoUrl?.duration || 0,
        owner: req.user?._id,
        isPublished: false,
    });
    const createdVideo = await Video.findById(video._id);
    if (!createdVideo) {
        throw new ApiError(500, "Something went wrong while publishing video");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, createdVideo, "Video published successfully"),
        );
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: get video by id

    if (!isValidObjectId(videoId)) {
        throw new ApiError(404, "video not found");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "video not found");
    }
    await Video.findByIdAndUpdate(videoId, {
        $inc: { views: 1 },
    });
    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: update video details like title, description, thumbnail

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "video id is not valid");
    }
    const validationData = await validatePayload(
        publishVideoValidator,
        req.body,
    );
    if ("error" in validationData) {
        throw new ApiError(400, "Validation failed", validationData.error);
    }
    const { title, description } = validationData;

    const videoRes = await Video.findById(videoId);
    if (!videoRes) {
        throw new ApiError(404, "Video not found");
    }
    const urlPath = videoRes.thumbnail;

    let thumbnailUrl;
    if (req.file) {
        if (!req.file.mimetype.startsWith("image/")) {
            throw new ApiError(400, "Uploaded file is not an image");
        }
        const uploadResult = await uploadOnCloudinary(req.file.path);
        if (!uploadResult?.url) {
            throw new ApiError(500, "Error uploading thumbnail");
        }
        thumbnailUrl = uploadResult.url;
    }
    interface UpdateData {
        title: string;
        description: string;
        thumbnail?: string;
    }
    const updateData: UpdateData = { title, description };
    if (thumbnailUrl) {
        updateData.thumbnail = thumbnailUrl;
    }
    const updatedVideo = await Video.findOneAndUpdate(
        { _id: videoId, owner: req.user?._id },
        {
            $set: updateData,
        },
        { new: true },
    );
    if (!updatedVideo) {
        throw new ApiError(
            404,
            "Video not found or you don't have permission to update it",
        );
    }
    const result = await deleteFromCloudinary(urlPath, "image");
    console.log(result);

    return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: delete video
    const userId = req.user?._id;
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "user id is not valid");
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "video id is not valid");
    }
    const videoRes = await Video.findById(videoId);
    if (!videoRes) {
        throw new ApiError(404, "video not found");
    }
    const videoUrl = videoRes.videoFile;
    const thumbnailUrl = videoRes.thumbnail;
    const deleteRes = await Video.deleteOne({ _id: videoId, owner: userId });
    //should i delete from playlist
    if (deleteRes.deletedCount === 0) {
        throw new ApiError(
            404,
            "Video not found or already deleted earlier or you are not authorized to delete it",
        );
    }
    const result = await deleteFromCloudinary(thumbnailUrl, "image");
    const resultV = await deleteFromCloudinary(videoUrl, "video");
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { deleteRes, result, resultV },
                "Video deleted successfully",
            ),
        );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?._id;
    if (!isValidObjectId(userId)) {
        throw new ApiError(404, "user id is not valid");
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(404, "video id is not valid");
    }
    const currentVideo = await Video.findOne({
        _id: videoId,
        owner: req.user?._id,
    });

    if (!currentVideo) {
        throw new ApiError(404, "Video not found or you don't have permission");
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: !currentVideo.isPublished,
            },
        },
        { new: true },
    );
    if (!video) {
        throw new ApiError(500, "Failed to update video status");
    }
    const statusV = video.isPublished ? "published" : "unpublished";
    return res
        .status(200)
        .json(new ApiResponse(200, video, `Video ${statusV} successfully.`));
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
};
