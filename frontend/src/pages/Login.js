import styled from '@emotion/styled';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Typography,
  useMediaQuery
} from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import logo from '../assets/akisyah_logo/black.svg';
import axios from '../utils/axios-client';

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

const CheckboxElement = ({ field, form, ...props }) => {
  return <Checkbox {...field} {...props} theme={props.theme} />;
};

function Login() {
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:500px)');
  const navigate = useNavigate();
  const INITIAL_SNACKBAR = {
    open: false,
    message: '',
    severity: 'success',
    title: 'Success',
  };
  const [snackbar, setSnackbar] = useState(INITIAL_SNACKBAR);
  const initialValues = {
    email: '',
    password: '',
    rememberMe: false,
  };

  const validationSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    rememberMe: yup.boolean(),
  });

  const handleLogin = useCallback(
    (values, actions) => {
      axios
        .post('/auth/login', values)
        .then((res) => {
          if (res.data && !res.data.error) {
            actions.setSubmitting(false);
            navigate('/dashboard');
          }
        })
        .catch((err) => {
          console.log('🚀 ~ file: Login.js:81 ~ Login ~ err:', err);
          const message =
            err?.response && err.response.status === 401
              ? err.response.data
              : err.message;
          setSnackbar({
            open: true,
            message: message,
            severity: 'error',
            title: 'Error',
          });
          console.log(err);
        });
    },
    [navigate]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        direction="up"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={() => {
          setSnackbar(INITIAL_SNACKBAR);
        }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          onClose={() => {
            setSnackbar(INITIAL_SNACKBAR);
          }}
        >
          <AlertTitle>{snackbar.title}</AlertTitle>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'white',
          padding: isMobile ? '2rem 1rem' : '2rem 4rem',
          width: isMobile ? '100%' : 'unset',
          borderRadius: theme.shape.borderRadius - 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '180px',
          }}
        >
          <img
            style={{
              height: '100%',
              width: '100%',
              objectFit: 'contain',
            }}
            src={logo}
            alt="Akisyah's Logo"
          />
        </Box>
        <Typography
          variant="h5"
          component={'h1'}
          sx={{ margin: isMobile ? '2rem 0' : '2rem 3rem' }}
        >
          Login To Your Account
        </Typography>
        <Formik
          initialValues={initialValues}
          onSubmit={handleLogin}
          validationSchema={validationSchema}
        >
          <Box
            component={Form}
            sx={{ width: '100%' }}
            action="/api/login"
            method="post"
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <Typography
                component={'label'}
                htmlFor="email"
                color={'GrayText'}
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
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <Typography
                component={'label'}
                htmlFor="password"
                color={'GrayText'}
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
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <FormControlLabel
                control={
                  <Field name="rememberMe" component={CheckboxElement} />
                }
                label="Remember Me"
                labelPlacement="end"
                sx={{
                  fontWeight: '300',
                  color: theme.palette.darkGray.main,
                }}
              />
              <Typography sx={{ ml: 2 }} color={'GrayText'}>
                <Link
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  to="/forget-password"
                >
                  Forgot Password?
                </Link>
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '1rem',
              }}
            >
              <Button
                type="submit"
                variant="contained"
                fullWidth={true}
                sx={{
                  borderBottom: '4px solid #3687D9',
                }}
              >
                Login
              </Button>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                component={'p'}
                sx={{
                  textAlign: 'center',
                  fontSize: '.9rem',
                  fontWeight: '300',
                  color: 'GrayText',
                  mt: 2,
                }}
              >
                Don't have an account?
              </Typography>
              <Typography
                color={'primary'}
                component={Link}
                to="/register"
                sx={{
                  textAlign: 'center',
                  fontSize: '.9rem',
                  fontWeight: '400',
                  textDecoration: 'none',
                  mt: 2,
                  ml: 1,
                }}
              >
                Sign Up
              </Typography>
            </Box>
          </Box>
        </Formik>
      </Box>
    </Box>
  );
}

export default Login;
