import React, { useState } from "react";
import {
  Container,
  Paper,
  Grid,
  TextField,
  Typography,
  Button,
  MenuItem,
  Box,
  Alert,
  Divider,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

// Asset Imports
import qrA from "./assets/IMG_20220531_092753.jpg";
import qrB from "./assets/Strong and confident in blue.png";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function RegistrationForm() {
  const [formData, setForm] = useState({
    name: "",
    mobile: "",
    age: "",
    aadhar: "",
    address: "",
    category: "A",
    style: "Batter",
    hand: "RHS",
    photo: null,
    screenshot: null,
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", msg: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: "", msg: "" });

    const data = new FormData();
    // Append fields: files should be appended as File objects
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) data.append(key, value);
      else data.append(key, value);
    });

    // Debug: ensure files are present before sending
    console.log("Sending files:", formData.photo, formData.screenshot);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/mpl/registration`,
        data
      );

      const newRegID = response.data.regNumber;
      setFeedback({
        type: "success",
        msg: `Registration Done! Your ID is: #${newRegID}`,
      });

      setForm({
        name: "",
        mobile: "",
        age: "",
        aadhar: "",
        address: "",
        category: "A",
        style: "Batter",
        hand: "RHS",
        photo: null,
        screenshot: null,
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong";
      setFeedback({ type: "error", msg: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    // Updated Container: Added disableGutters and better centering
    <Container
      maxWidth="sm"
      sx={{ py: 4, display: "flex", justifyContent: "center" }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2.5, sm: 4 },
          borderRadius: 4,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight="800"
          color="primary"
          sx={{ mb: 1, fontSize: { xs: "1.8rem", sm: "2.125rem" } }}
        >
          MPL SEASON 5
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Registration Form
        </Typography>

        {feedback.msg && (
          <Alert severity={feedback.type} sx={{ mb: 4, borderRadius: 2 }}>
            {feedback.msg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          {/* justifyContent="center" ensures inputs stay centered */}
          <Grid container spacing={2.5} justifyContent="center">
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Aadhaar Number"
                name="aadhar"
                value={formData.aadhar}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Address"
                name="address"
                multiline
                rows={2}
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <MenuItem value="A">Category A (₹400)</MenuItem>
                <MenuItem value="B">Category B (₹200)</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Playing Style"
                name="style"
                value={formData.style}
                onChange={handleChange}
              >
                <MenuItem value="Batter">Batter</MenuItem>
                <MenuItem value="Bowler">Bowler</MenuItem>
                <MenuItem value="All-Rounder">All-Rounder</MenuItem>
                <MenuItem value="Keeper">Keeper</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Hand"
                name="hand"
                value={formData.hand}
                onChange={handleChange}
              >
                <MenuItem value="RHS">Right Hand</MenuItem>
                <MenuItem value="LHS">Left Hand</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{
                  height: "55px",
                  borderRadius: 3,
                  textTransform: "none",
                  fontSize: "1rem",
                  borderWidth: 2,
                  "&:hover": { borderWidth: 2 },
                }}
              >
                {formData.photo ? "Photo Attached ✅" : "Upload Profile Photo"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  name="photo"
                  onChange={handleFileChange}
                  required
                />
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2.5,
                  textAlign: "center",
                  bgcolor: "#fcfcfc",
                  borderRadius: 4,
                  border: "1px solid #eee",
                  mt: 1,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 2 }}
                >
                  Scan to Pay: ₹{formData.category === "A" ? "400" : "200"}
                </Typography>

                <Box
                  component="img"
                  src={formData.category === "A" ? qrA : qrB}
                  alt="QR Code"
                  sx={{
                    width: 180,
                    height: 180,
                    mx: "auto",
                    mb: 2,
                    borderRadius: 2,
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  }}
                />

                <Button
                  variant="contained"
                  color="secondary"
                  component="label"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    height: "50px",
                    borderRadius: 3,
                    textTransform: "none",
                  }}
                >
                  {formData.screenshot
                    ? "Screenshot Uploaded ✅"
                    : "Upload Screenshot"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    name="screenshot"
                    onChange={handleFileChange}
                    required
                  />
                </Button>
              </Box>
            </Grid>

            {/* Centered Submit Button */}
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  width: { xs: "100%", sm: "80%" }, // Responsive width
                  py: 2,
                  mt: 2,
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  borderRadius: 4,
                  boxShadow: "0px 8px 15px rgba(25, 118, 210, 0.3)",
                }}
              >
                {loading ? "Registering..." : "REGISTER NOW"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
