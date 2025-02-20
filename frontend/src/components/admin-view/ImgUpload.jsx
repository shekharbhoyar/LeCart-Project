import { useEffect, useRef } from "react";
import {
  Button,
  TextField,
  CircularProgress,
  Typography,
  IconButton,
  Paper,
} from "@mui/material";
import { CloudUpload, InsertDriveFile, Close } from "@mui/icons-material";
import axios from "axios";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    const data = new FormData();
    data.append("my_file", imageFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-image",
        data
      );

      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Typography variant="h6" gutterBottom>
        Upload Image
      </Typography>
      <Paper
        elevation={3}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          border: "2px dashed #ccc",
          padding: "16px",
          textAlign: "center",
          opacity: isEditMode ? 0.6 : 1,
          position: "relative",
        }}
      >
        <input
          id="image-upload"
          type="file"
          hidden
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />

        {!imageFile ? (
          <label
            htmlFor="image-upload"
            style={{ cursor: isEditMode ? "not-allowed" : "pointer" }}
          >
            <CloudUpload style={{ fontSize: 48, color: "#888" }} />
            <Typography variant="body2">
              Drag & drop or click to upload image
            </Typography>
          </label>
        ) : imageLoadingState ? (
          <CircularProgress />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <InsertDriveFile style={{ fontSize: 40, color: "#007bff" }} />
            <Typography variant="body2">{imageFile.name}</Typography>
            <IconButton onClick={handleRemoveImage}>
              <Close />
            </IconButton>
          </div>
        )}
      </Paper>
    </div>
  );
}

export default ProductImageUpload;
