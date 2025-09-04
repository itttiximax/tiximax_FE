import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  LinearProgress,
} from "@mui/material";
import uploadImageService from "../Services/uploadImageService";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";

const MAX_FILE_SIZE_MB = 1; // max file size 1MB

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Cleanup preview URL để tránh memory leaks
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Check file type
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh");
      return;
    }

    // Check file size
    if (selectedFile.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
      toast.error(`File quá lớn. Vui lòng chọn ảnh dưới ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    // Cleanup previous preview
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setUploadedUrl("");
    setProgress(0);
  };

  const handleCancel = () => {
    // Cleanup preview URL
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(null);
    setPreview(null);
    setUploadedUrl("");
    setProgress(0);
    toast("Đã hủy chọn ảnh", { icon: "🗑️" });
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Chưa chọn ảnh");
    setLoading(true);

    try {
      // Nén ảnh
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1080,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      // Upload ảnh với progress tracking
      const response = await uploadImageService.upload(compressedFile, {
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        },
      });

      setUploadedUrl(response.url);
      toast.success("Upload thành công!");
      console.log("Upload thành công:", response);
    } catch (err) {
      console.error("Lỗi upload:", err);
      toast.error(
        "Upload thất bại: " + (err.response?.data?.error || err.message)
      );
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 400,
        margin: "20px auto",
        padding: 2,
        textAlign: "center",
        boxShadow: 3,
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upload Hình Ảnh
        </Typography>

        <Button
          variant="contained"
          component="label"
          sx={{ mb: 2, mr: 1 }}
          disabled={loading}
        >
          Chọn ảnh
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept="image/*"
          />
        </Button>

        {file && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleCancel}
            sx={{ mb: 2 }}
            disabled={loading}
          >
            Hủy
          </Button>
        )}

        {preview && (
          <Box sx={{ mb: 2 }}>
            <img
              src={preview}
              alt="preview"
              style={{
                width: "100%",
                maxHeight: 200,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          </Box>
        )}

        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <CircularProgress size={24} />
            <Typography variant="body2">Đang upload... {progress}%</Typography>
          </Box>
        ) : (
          <Button
            onClick={handleUpload}
            variant="contained"
            color="success"
            fullWidth
            disabled={!file}
          >
            Upload
          </Button>
        )}

        {progress > 0 && loading && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mt: 2 }}
          />
        )}

        {uploadedUrl && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Ảnh đã upload:
            </Typography>
            <img
              src={uploadedUrl}
              alt="uploaded"
              style={{
                width: "100%",
                maxHeight: 200,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          </Box>
        )}

        <Typography
          variant="caption"
          display="block"
          sx={{ mt: 2, color: "gray" }}
        >
          Max size: {MAX_FILE_SIZE_MB}MB. Chỉ hỗ trợ file ảnh. Ảnh sẽ được nén
          trước khi upload.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UploadImage;
