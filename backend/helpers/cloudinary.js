import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: "dgx91scco",
  api_key: "457398727356339",
  api_secret: "j9I8fuZXjQLDJL41qr-nR1d1eJs",
});

const storage = multer.memoryStorage();

async function imageUploadUtil(file) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });

  return result;
}

const upload = multer({ storage });

// Export using ES module syntax
export { upload, imageUploadUtil };
