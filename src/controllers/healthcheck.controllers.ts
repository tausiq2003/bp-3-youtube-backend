import ApiResponse from "../utils/api-response";
import asyncHandler from "../utils/async-handler";

const healthcheck = asyncHandler(async (_, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message
    return res.status(200).json(new ApiResponse(200, {}, "Good health"));
});

export { healthcheck };
