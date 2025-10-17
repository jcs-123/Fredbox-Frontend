import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Username: ${formData.username}\nPassword: ${formData.password}`);
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #0a2a43, #1e3c60)",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #1976d2, #42a5f5)",
              color: "white",
              textAlign: "center",
              py: 3,
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Sign in to continue
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            <TextField
              label="Username"
              name="username"
              fullWidth
              margin="normal"
              variant="outlined"
              value={formData.username}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaUser color="#1976d2" />
                  </InputAdornment>
                ),
              }}
              required
            />

            <TextField
              label="Password"
              name="password"
              type={passwordVisible ? "text" : "password"}
              fullWidth
              margin="normal"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaLock color="#1976d2" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setPasswordVisible(!passwordVisible)}>
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              required
            />

            <Box textAlign="right" sx={{ mt: 1, mb: 2 }}>
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: "pointer", fontWeight: 500 }}
              >
                Forgot Password?
              </Typography>
            </Box>

            <Button
              type="submit"
              fullWidth
              sx={{
                background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                color: "white",
                fontWeight: "bold",
                py: 1.2,
                borderRadius: 2,
                "&:hover": {
                  background: "linear-gradient(135deg, #1565c0, #1e88e5)",
                },
              }}
            >
              Login
            </Button>
          </Box>
        </Paper>

        <Typography
          variant="body2"
          color="white"
          align="center"
          sx={{ mt: 2, opacity: 0.8 }}
        >
          © {new Date().getFullYear()} Jyothi Engineering College
        </Typography>
      </Container>
    </Box>
  );
}

export default Login;
