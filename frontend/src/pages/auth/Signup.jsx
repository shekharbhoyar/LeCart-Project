// import React from "react";
// import { useForm, Controller } from "react-hook-form";
// import { TextField, Button, Container, Typography } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { registerUser } from "../../store/auth-slice/index";

// const AuthSignup = () => {
//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm();

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const onSubmit = (data) => {
//     console.log("Submitted Data:", data); // Check form values

//     dispatch(registerUser(data)).then((response) => {
//       console.log("Register Response:", response); // Debug API response

//       if (response?.payload?.success) {
//         console.log("Registration successful! Navigating to login...");
//         navigate("/auth/login");
//       } else {
//         console.log(" Registration failed! Not navigating.");
//       }
//     });
//   };

//   return (
//     <Container maxWidth="sm">
//       <Typography component="div" align="center">
//         <Typography variant="h4" component="h1" fontSize={50} gutterBottom>
//           Create new account
//         </Typography>
//         <Typography variant="body1" fontSize={16} gutterBottom>
//           Already have an account{" "}
//           <Link
//             className="font-medium ml-2 text-blue-500 hover:underline hover:text-blue-800"
//             to="/auth/login"
//           >
//             Login
//           </Link>
//         </Typography>
//       </Typography>

//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
//       >
//         {/* Name Field */}
//         <Controller
//           name="userName"
//           control={control}
//           defaultValue=""
//           rules={{ required: "userName is required" }}
//           render={({ field }) => (
//             <TextField
//               {...field}
//               label="userName"
//               variant="outlined"
//               fullWidth
//               error={!!errors.name}
//               helperText={errors.name?.message}
//             />
//           )}
//         />

//         {/* Email Field */}
//         <Controller
//           name="email"
//           control={control}
//           defaultValue=""
//           rules={{
//             required: "Email is required",
//             pattern: {
//               value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
//               message: "Invalid email format",
//             },
//           }}
//           render={({ field }) => (
//             <TextField
//               {...field}
//               label="Email"
//               variant="outlined"
//               fullWidth
//               error={!!errors.email}
//               helperText={errors.email?.message}
//             />
//           )}
//         />

//         {/* Password Field */}
//         <Controller
//           name="password"
//           control={control}
//           defaultValue=""
//           rules={{
//             required: "Password is required",
//             minLength: {
//               value: 6,
//               message: "Password must be at least 6 characters",
//             },
//           }}
//           render={({ field }) => (
//             <TextField
//               {...field}
//               label="Password"
//               type="password"
//               variant="outlined"
//               fullWidth
//               error={!!errors.password}
//               helperText={errors.password?.message}
//             />
//           )}
//         />

//         {/* Submit Button */}
//         <Button type="submit" variant="contained" color="primary" fullWidth>
//           Signup
//         </Button>
//       </form>
//     </Container>
//   );
// };

// export default AuthSignup;

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Container,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../store/auth-slice/index";

const AuthSignup = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State for Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Handle form submission
  const onSubmit = (data) => {
    dispatch(registerUser(data)).then((response) => {
      console.log("Register Response:", response); // Debug API response

      if (response?.payload?.success) {
        setSnackbar({
          open: true,
          message: response.payload.message || "Registration successful!",
          severity: "success",
        });

        setTimeout(() => navigate("/auth/login"), 2000); // Navigate after 2s
      } else {
        setSnackbar({
          open: true,
          message:
            response.payload?.message || "Registration failed! Try again.",
          severity: "error",
        });
      }
    });
  };

  return (
    <Container maxWidth="sm">
      <Typography component="div" align="center">
        <Typography variant="h4" component="h1" fontSize={50} gutterBottom>
          Create new account
        </Typography>
        <Typography variant="body1" fontSize={16} gutterBottom>
          Already have an account?{" "}
          <Link
            className="font-medium ml-2 text-blue-500 hover:underline hover:text-blue-800"
            to="/auth/login"
          >
            Login
          </Link>
        </Typography>
      </Typography>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {/* Name Field */}
        <Controller
          name="userName"
          control={control}
          defaultValue=""
          rules={{ required: "User Name is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="User Name"
              variant="outlined"
              fullWidth
              error={!!errors.userName}
              helperText={errors.userName?.message}
            />
          )}
        />

        {/* Email Field */}
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
              message: "Invalid email format",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              variant="outlined"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />

        {/* Password Field */}
        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
        />

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Signup
        </Button>
      </form>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AuthSignup;
