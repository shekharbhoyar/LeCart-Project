// import React from "react";
// import { useForm, Controller } from "react-hook-form";
// import { TextField, Button, Container, Typography } from "@mui/material";
// import { Link } from "react-router-dom";
// import { loginUser } from "../../store/auth-slice/index";
// import { useDispatch } from "react-redux";

// const AuthLogin = () => {
//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm();

//   const dispatch = useDispatch();

//   const onSubmit = (data) => {
//     console.log("Submitted Data:", data); // Check form values

//     dispatch(loginUser(data)).then((response) => {
//       console.log("Login Response:", response); // Debug API response

//       if (response?.payload?.success) {
//         console.log("Login successful! Navigating to Home...");
//       } else {
//         console.log(" Login failed! Not navigating.");
//       }
//     });
//   };

//   return (
//     <Container maxWidth="sm">
//       <Typography component="div" align="center">
//         <Typography variant="h4" component="h1" fontSize={50} gutterBottom>
//           Log In here
//         </Typography>
//         <Typography variant="body1" fontSize={16} gutterBottom>
//           Dont have an account{" "}
//           <Link
//             className="font-medium ml-2 text-blue-500 hover:underline hover:text-blue-800"
//             to="/auth/signup"
//           >
//             SignUp
//           </Link>
//         </Typography>
//       </Typography>
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
//       >
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
//           Login
//         </Button>
//       </form>
//     </Container>
//   );
// };

// export default AuthLogin;

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
import { Link } from "react-router-dom";
import { loginUser } from "../../store/auth-slice/index";
import { useDispatch } from "react-redux";

const AuthLogin = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const onSubmit = (data) => {
    dispatch(loginUser(data)).then((response) => {
      if (response?.payload?.success) {
        setSnackbar({
          open: true,
          message: "Login successful!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Login failed! Please check your credentials.",
          severity: "error",
        });
      }
    });
  };

  return (
    <Container maxWidth="sm">
      <Typography component="div" align="center">
        <Typography variant="h4" component="h1" fontSize={50} gutterBottom>
          Log In here
        </Typography>
        <Typography variant="body1" fontSize={16} gutterBottom>
          Don't have an account?{" "}
          <Link
            className="font-medium ml-2 text-blue-500 hover:underline hover:text-blue-800"
            to="/auth/signup"
          >
            Sign Up
          </Link>
        </Typography>
      </Typography>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
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
          Login
        </Button>
      </form>

      {/* Snackbar for Login Messages */}
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

export default AuthLogin;
