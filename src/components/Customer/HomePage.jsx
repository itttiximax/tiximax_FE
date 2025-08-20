import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Nội dung chính */}
          <Grid item xs={12} md={6}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Welcome to <span style={{ color: "#3b82f6" }}>TixiMax</span>
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              A modern platform to manage users, doctors, and schedules with
              ease. Explore the admin panel or login to start managing your
              data.
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                sx={{ mr: 2, borderRadius: "8px", px: 4 }}
                onClick={() => navigate("/signin")}
              >
                Sign In
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{ borderRadius: "8px", px: 4 }}
                onClick={() => navigate("/admin/dashboard")}
              >
                Go to Admin
              </Button>
            </Box>
          </Grid>

          {/* Card giới thiệu */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: "16px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Why Choose Us?
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  ✅ Easy to use dashboard ✅ Manage doctors and patients ✅
                  Secure authentication ✅ Real-time scheduling
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
