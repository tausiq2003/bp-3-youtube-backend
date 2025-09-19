import ApiError from "../utils/api-error";
import ApiResponse from "../utils/api-response";
import asyncHandler from "../utils/async-handler";

const healthcheck = asyncHandler(async (req, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message
});

export { healthcheck };
