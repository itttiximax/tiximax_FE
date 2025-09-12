import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  LinearProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import uploadImageService from "../Services/uploadImageService";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";

const MAX_FILE_SIZE_MB = 1; // max file size 1MB

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploadedImageId, setUploadedImageId] = useState(null); // Store image ID for deletion
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
    setUploadedImageId(null);
    setProgress(0);
  };

  const handleCancel = () => {
    // Cleanup preview URL
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(null);
    setPreview(null);
    setProgress(0);

    // Không xóa uploadedUrl và uploadedImageId nếu đã có ảnh upload
    if (!uploadedUrl) {
      setUploadedUrl("");
      setUploadedImageId(null);
    }

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
      setUploadedImageId(response.id || response._id); // Store image ID

      // Clear file selection after successful upload
      setFile(null);
      setPreview(null);

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

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialogOpen(false);
    setDeleting(true);

    try {
      // Xóa ảnh theo ID nếu có
      if (uploadedImageId) {
        await uploadImageService.delete(uploadedImageId);
      }
      // Hoặc xóa theo URL nếu không có ID
      else if (uploadedUrl) {
        await uploadImageService.deleteByUrl(uploadedUrl);
      }

      // Reset state sau khi xóa thành công
      setUploadedUrl("");
      setUploadedImageId(null);
      toast.success("Xóa ảnh thành công!");
    } catch (err) {
      console.error("Lỗi xóa ảnh:", err);
      toast.error(
        "Xóa ảnh thất bại: " + (err.response?.data?.error || err.message)
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <>
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

          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}
          >
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              disabled={loading || deleting}
            >
              Chọn ảnh
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept="image/*"
              />
            </Button>

            {file && !uploadedUrl && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                disabled={loading}
              >
                Hủy
              </Button>
            )}
          </Box>

          {/* Preview ảnh chưa upload */}
          {preview && !uploadedUrl && (
            <Box sx={{ mb: 2, position: "relative" }}>
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

          {/* Loading và Progress */}
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
              <Typography variant="body2">
                Đang upload... {progress}%
              </Typography>
            </Box>
          ) : (
            file &&
            !uploadedUrl && (
              <Button
                onClick={handleUpload}
                variant="contained"
                color="success"
                fullWidth
                disabled={!file}
                startIcon={<CloudUploadIcon />}
              >
                Upload
              </Button>
            )
          )}

          {progress > 0 && loading && (
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ mt: 2 }}
            />
          )}

          {/* Hiển thị ảnh đã upload với nút xóa */}
          {uploadedUrl && (
            <Box sx={{ mt: 2, position: "relative" }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Ảnh đã upload:
              </Typography>

              <Box sx={{ position: "relative", display: "inline-block" }}>
                <img
                  src={uploadedUrl}
                  alt="uploaded"
                  style={{
                    width: "100%",
                    maxHeight: 200,
                    objectFit: "cover",
                    borderRadius: 8,
                    opacity: deleting ? 0.5 : 1,
                  }}
                />

                {/* Overlay khi đang xóa */}
                {deleting && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}

                {/* Nút xóa */}
                {!deleting && (
                  <Tooltip title="Xóa ảnh">
                    <IconButton
                      onClick={handleDeleteClick}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 1)",
                          color: "error.main",
                        },
                      }}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

              {/* Hiển thị URL và ID */}
              <Box sx={{ mt: 1, textAlign: "left" }}>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ wordBreak: "break-all" }}
                >
                  URL: {uploadedUrl}
                </Typography>
                {uploadedImageId && (
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ color: "text.secondary" }}
                  >
                    ID: {uploadedImageId}
                  </Typography>
                )}
              </Box>
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

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Xác nhận xóa ảnh</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Bạn có chắc chắn muốn xóa ảnh này không? Hành động này không thể
            hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Hủy
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UploadImage;
