import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME! as string,
    api_key: process.env.CLOUDINARY_API_KEY! as string,
    api_secret: process.env.CLOUDINARY_API_SECRET! as string,
});

const uploadOnCloudinary = async (localFilePath: string | undefined) => {
    try {
        if (!localFilePath) return null;
        //upload the file on cloudinary
        if (!fs.existsSync(localFilePath)) {
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        try {
            fs.unlinkSync(localFilePath);
        } catch (error) {
            console.error("couldn't delete local file", localFilePath);
            console.error((error as Error)?.message);
        }
        return response;
    } catch (error) {
        console.error("Cloudinary upload failed", (error as Error)?.message);
        try {
            if (localFilePath && fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
        } catch (err) {
            console.error(
                "Warning!! couldn't cleanup local file after upload failure",
                (err as Error)?.message,
            );
        }
        return null;
    }
};
// const deletedFromCloudinary = async function () {
// //TODO
// };

export { uploadOnCloudinary };
