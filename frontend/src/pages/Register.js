import styled from '@emotion/styled';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Snackbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import logo from '../assets/akisyah_logo/white.svg';
import axios from '../utils/axios-client';

const TextInputStyled = styled.input`
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  color: #333;
  background: ${(props) => props.theme.palette.gray.main};
  height: 2.2rem;
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
    confirmPassword: '',
  };

  const validationSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Password must match.'),
  });

  const handleRegister = useCallback(
    (values, actions) => {
      axios
        .post('/auth/signup', values)
        .then((res) => {
          if (res && res.status === 200) {
            navigate('/');
          }
        })
        .catch((err) => {
          const message =
            err?.response && err.response.status === 409
              ? err.response.data.error
              : err.message;
          setSnackbar({
            open: true,
            message: message,
            severity: 'error',
            title: 'Error',
          });
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
        color: theme.palette.text.primary,
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
          padding: isMobile ? '2rem 1rem' : '2rem 4rem',
          width: isMobile ? '100%' : 'unset',
          borderRadius: theme.shape.borderRadius - 2,
          background: theme.palette.background.paper,
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
          Create a new account
        </Typography>
        <Formik
          initialValues={initialValues}
          onSubmit={handleRegister}
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
                color={theme.palette.error.light}
                variant="subtitle2"
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
                color={theme.palette.error.light}
                variant="subtitle2"
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
                color={theme.palette.error.light}
                variant="subtitle2"
                sx={{
                  mt: 1,
                }}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '1.4rem',
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
                Signup
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
                component={Link}
                to="/"
                color={'primary'}
                sx={{
                  textAlign: 'center',
                  fontSize: '.9rem',
                  fontWeight: '400',
                  textDecoration: 'none',
                  mt: 2,
                  ml: 1,
                }}
              >
                Login
              </Typography>
            </Box>
          </Box>
        </Formik>
      </Box>
    </Box>
  );
}

export default Register;
