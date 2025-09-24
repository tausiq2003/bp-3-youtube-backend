import { isValidObjectId, type ObjectId } from "mongoose";
import { Playlist } from "../models/playlist.models";
import ApiError from "../utils/api-error";
import ApiResponse from "../utils/api-response";
import asyncHandler from "../utils/async-handler";
import { playlistCreateValidator } from "../validators/playlist.validators";

const createPlaylist = asyncHandler(async (req, res) => {
    //TODO: create playlist

    const validationResult = await playlistCreateValidator.safeParseAsync(
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
    const { name, description } = validationData;
    const playlist = await Playlist.create({
        name: name,
        description: description,
        videos: [],
        owner: req.user?._id,
    });
    if (!playlist) {
        throw new ApiError(500, "Playlist creation failed");
    }
    return res
        .status(201)
        .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    //TODO: get user playlists
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "user id is not valid");
    }
    const userPlaylists = await Playlist.find({ owner: req.user?._id });
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                userPlaylists,
                "User playlists fetched successfully",
            ),
        );
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    //TODO: get playlist by id.
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "playlist id is not valid");
    }
    const playlist = await Playlist.find({ _id: playlistId });
    if (!playlist) {
        throw new ApiError(404, "No playlist found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Playlist Id is not valid");
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video Id is not valid");
    }

    const playlist = await Playlist.findOne({ _id: playlistId });
    const video = await Playlist.findOne({ _id: videoId });
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    const existingVideo = playlist.videos.find((vId) => vId.equals(videoId));
    if (existingVideo === videoId) {
        throw new ApiError(400, "You have the video already in the playlist");
    }
    playlist.videos.push(videoId as unknown as ObjectId);
    await playlist.save();
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                {},
                `Video saved to playlist ${playlist.name}`,
            ),
        );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    // TODO: remove video from playlist
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Playlist Id is not valid");
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video Id is not valid");
    }

    const playlist = await Playlist.findOne({ _id: playlistId });
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    const existingVideo = playlist.videos.find((vId) => vId.equals(videoId));
    if (!existingVideo) {
        throw new ApiError(404, "Video not found in playlist");
    }
    playlist.videos.pull(videoId);
    await playlist.save();
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                {},
                `Video removed from playlist ${playlist.name}`,
            ),
        );
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    // TODO: delete playlist
    const userId = req.user?._id;
    if (!isValidObjectId(userId)) {
        throw new ApiError(401, "Unauthorized");
    }
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "playlist id is not valid");
    }
    const deletedRes = await Playlist.deleteOne({
        owner: userId,
        _id: playlistId,
    });
    if (deletedRes.deletedCount === 0) {
        throw new ApiError(
            404,
            "Playlist not found or already deleted earlier or you are not authorized to delete it",
        );
    }
    return res
        .status(200)
        .json(new ApiResponse(200, deletedRes, "Tweet deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    //TODO: update playlist
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "playlist id is not valid");
    }
    const validationResult = await playlistCreateValidator.safeParseAsync(
        req.body,
    );
    const userId = req.user?._id;
    if (!isValidObjectId(userId)) {
        throw new ApiError(401, "Unauthorized");
    }
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
    const { name, description } = validationData;
    const updateRes = await Playlist.findOneAndUpdate(
        { owner: userId, _id: playlistId },
        { $set: { name: name, description: description } },
        { new: true },
    );
    if (!updateRes) {
        throw new ApiError(500, "updation failed");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, updateRes, "Playlist updated successfully"));
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
};
