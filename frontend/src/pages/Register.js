import styled from "@emotion/styled";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import * as yup from "yup";
import logo from "../assets/akisyah_logo/black.svg";

const TextInputStyled = styled.input`
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  color: #333;
  background: ${(props) => props.theme.palette.gray.main};
  height: 1.6rem;
`;

const InputElement = ({ field, form, ...props }) => {
  return (
    <TextInputStyled
      {...field}
      {...props}
      theme={props.theme}
      placeholder={props.placeholder}
    />
  );
};

function Register() {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:500px)");
  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Password must match."),
  });

  const handleRegister = useCallback((values, actions) => {
    console.log(values);
    fetch("/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }).then((res) => {
      if (res.ok && res.redirected) {
        console.log("redirect");
        console.log(res.url);
        // window.location.replace(res.url);
        window.location.assign(res.url);
      }
    });
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "white",
          padding: isMobile ? "2rem 1rem" : "2rem 4rem",
          width: isMobile ? "100%" : "unset",
          borderRadius: theme.shape.borderRadius - 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "180px",
          }}
        >
          <img
            style={{
              height: "100%",
              width: "100%",
              objectFit: "contain",
            }}
            src={logo}
            alt="Akisyah's Logo"
          />
        </Box>
        <Typography
          variant="h5"
          component={"h1"}
          sx={{ margin: isMobile ? "2rem 0" : "2rem 3rem" }}
        >
          Create a new account
        </Typography>
        <Formik
          initialValues={initialValues}
          onSubmit={handleRegister}
          validationSchema={validationSchema}
        >
          <Box
            component={Form}
            sx={{ width: "100%" }}
            action="/api/login"
            method="post"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <Typography
                component={"label"}
                htmlFor="email"
                color={"GrayText"}
                sx={{ mb: 1 }}
              >
                Email
              </Typography>
              <Field
                type="email"
                component={InputElement}
                name="email"
                placeholder="cooper@example.com"
                theme={theme}
              />
              <ErrorMessage
                name="email"
                component={Typography}
                color="red"
                variant="caption"
                sx={{
                  mt: 1,
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <Typography
                component={"label"}
                htmlFor="password"
                color={"GrayText"}
                sx={{ mb: 1 }}
              >
                Password
              </Typography>
              <Field
                type="password"
                component={InputElement}
                name="password"
                theme={theme}
              />
              <ErrorMessage
                component={Typography}
                name="password"
                color="red"
                variant="caption"
                sx={{
                  mt: 1,
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <Typography
                component={"label"}
                htmlFor="password"
                color={"GrayText"}
                sx={{ mb: 1 }}
              >
                Confirm Password
              </Typography>
              <Field
                type="password"
                component={InputElement}
                name="confirmPassword"
                theme={theme}
              />
              <ErrorMessage
                component={Typography}
                name="confirmPassword"
                color="red"
                variant="caption"
                sx={{
                  mt: 1,
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                fullWidth={true}
                sx={{
                  borderBottom: "4px solid #3687D9",
                }}
              >
                Signup
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                component={"p"}
                sx={{
                  textAlign: "center",
                  fontSize: "0.8rem",
                  fontWeight: "300",
                  color: "GrayText",
                  mt: 2,
                }}
              >
                Don't have an account?
              </Typography>
              <Typography
                color={"primary"}
                sx={{
                  textAlign: "center",
                  fontSize: "0.8rem",
                  fontWeight: "400",
                  textDecoration: "none",
                  mt: 2,
                  ml: 1,
                }}
              >
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  to="/"
                >
                  Login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Formik>
      </Box>
    </Box>
  );
}

export default Register;
