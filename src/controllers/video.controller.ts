import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models";
import ApiError from "../utils/api-error";
import ApiResponse from "../utils/api-response";
import asyncHandler from "../utils/async-handler";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { publishVideoValidator } from "../validators/videos.validators";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    const validationResult = await publishVideoValidator.safeParseAsync(
        req.body,
    );

    if (!validationResult.success) {
        const prettyErrors = validationResult.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
            code: issue.code,
        }));
        const errorMessages = prettyErrors.map(
            (error) => `${error.field}: ${error.message} (Code: ${error.code})`,
        );
        throw new ApiError(400, "Validation failed", errorMessages);
    }
    const validationData = validationResult.data;
    const { title, description } = validationData;

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
    if (!files.video?.[0]) {
        throw new ApiError(400, "Video is required");
    }
    if (!files.video?.[0].mimetype.startsWith("video/")) {
        throw new ApiError(400, "Uploaded file is not a video");
    }

    const videoUrl = await uploadOnCloudinary(files.video?.[0].path);
    const thumbnailUrl = await uploadOnCloudinary(files.thumbnail?.[0].path);
    if (!(videoUrl?.url && thumbnailUrl?.url)) {
        throw new ApiError(500, "video url or thumbnail url not found");
    }
    const video = await Video.create({
        title: title,
        description: description,
        video: videoUrl.url,
        thumbnailUrl: thumbnailUrl.url,
        duration: videoUrl?.duration,
        owner: req.user?._id,
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

    if (!videoId) {
        throw new ApiError(404, "video not found");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "video not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        throw new ApiError(404, "video not found");
    }
    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: true,
            },
        },
        { new: true },
    );
    if (!video) {
        throw new ApiError(404, "Video not found");
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
