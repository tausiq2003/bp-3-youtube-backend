import { isValidObjectId, type ObjectId } from "mongoose";
import { Playlist } from "../models/playlist.models";
import ApiError from "../utils/api-error";
import ApiResponse from "../utils/api-response";
import asyncHandler from "../utils/async-handler";
import { playlistCreateValidator } from "../validators/playlist.validators";
import validatePayload from "../utils/validation";
import { Video } from "../models/video.models";

const createPlaylist = asyncHandler(async (req, res) => {
    //TODO: create playlist

    const validationData = await validatePayload(
        playlistCreateValidator,
        req.body,
    );
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
    const userPlaylists = await Playlist.find({ owner: userId });
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
    const playlist = await Playlist.findById(playlistId).populate("videos");
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
    const video = await Video.findOne({ _id: videoId });
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    const existingVideo = playlist.videos.find((vId) => vId.equals(videoId));
    if (existingVideo) {
        throw new ApiError(400, "You have the video already in the playlist");
    }
    playlist.videos.push(videoId as unknown as ObjectId);
    await playlist.save();
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                playlist,
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
        .status(200)
        .json(
            new ApiResponse(
                200,
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
        .json(
            new ApiResponse(200, deletedRes, "Playlist deleted successfully"),
        );
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    //TODO: update playlist
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "playlist id is not valid");
    }
    const userId = req.user?._id;
    if (!isValidObjectId(userId)) {
        throw new ApiError(401, "Unauthorized");
    }
    const validationData = await validatePayload(
        playlistCreateValidator,
        req.body,
    );
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
