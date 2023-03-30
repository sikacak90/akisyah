import {
  Alert,
  AlertTitle,
  MenuItem,
  Modal,
  Snackbar,
  TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useGridApiRef } from '@mui/x-data-grid';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import WebhooksDataGrid from '../components/WebhooksDataGrid';
import { sessionContext } from '../features/Session';
import { socket } from '../socket.io/socket';
import axios from '../utils/axios-client';

export default function Dashboard() {
  const { session, fetchUserAuth, updateWebhooks } = useContext(sessionContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const [newWebhookModelOpen, setNewWebhookModelOpen] = useState(false);
  const INITIAL_SNACKBAR = {
    open: false,
    message: '',
    severity: 'success',
    title: 'Success',
  };
  const [snackbar, setSnackbar] = useState(INITIAL_SNACKBAR);
  const apiRef = useGridApiRef();
  const nameInputRef = useRef(null);
  const typeInputRef = useRef(null);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function tryReconnect() {
      setTimeout(() => {
        if (session.isLoggedIn) {
          console.log('trying to reconnect...');
          socket.open((err) => {
            if (err) {
              tryReconnect();
            }
          });
        }
      }, 2000);
    }

    if (!isConnected) {
      tryReconnect();
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [isConnected, session.isLoggedIn]);

  useEffect(() => {
    if (!session.isLoggedIn) {
      fetchUserAuth().then((data) => {
        if (!data) navigate('/');
      });
    }
  }, [session.isLoggedIn, navigate, fetchUserAuth]);

  const handleCreateURL = (e) => {
    const webhookName = nameInputRef.current.value;
    const webhookType = typeInputRef.current.value;
    if (!webhookName || !webhookType) return alert('All fields are required.');
    axios
      .post('/api/createURL', { name: webhookName, EventType: webhookType })
      .then((res) => {
        if (res.status === 200) {
          // update in SessionContext
          updateWebhooks(res.data, 'add');
          setNewWebhookModelOpen(false);
          setSnackbar({
            open: true,
            message: 'Webhook created successfully.',
            severity: 'success',
            title: 'Success',
          });
        }
      })
      .catch((err) => {
        console.log(
          '🚀 ~ file: Dashboard.js:103 ~ handleCreateURL ~ err:',
          err
        );
        setSnackbar({
          open: true,
          message: 'Oops! Something went wrong',
          severity: 'error',
          title: 'Error',
        });
      });
  };

  const handleDeleteSelected = () => {
    const selectedRows = apiRef.current.getSelectedRows();
    for (const [, value] of selectedRows) {
      axios
        .post('/api/deleteURL', { webhookID: value.id })
        .then((res) => {
          if (res.status === 200) {
            apiRef.current.updateRows([{ id: value.id, _action: 'delete' }]);
            // update in SessionContext
            updateWebhooks({ _id: value.id }, 'delete');
            setSnackbar({
              open: true,
              message: 'Webhook deleted successfully.',
              severity: 'success',
              title: 'Success',
            });
          }
        })
        .catch((err) => {
          console.log(
            '🚀 ~ file: Dashboard.js:166 ~ handleDeleteSelected ~ err:',
            err
          );
          setSnackbar({
            open: true,
            message: 'Oops! Something went wrong',
            severity: 'error',
            title: 'Error',
          });
        });
    }
  };

  return (
    <Box sx={{ display: 'flex', m: 4, color: theme.palette.text.primary }}>
      <CssBaseline />
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '3rem',
          borderRadius: '8px',
          background: theme.palette.background.default,
          height: '100%',
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5" component="h2">
            My Webhooks {isConnected ? 'Connected' : 'Disconnected'}
          </Typography>
          <Box display={'flex'}>
            <Box
              sx={{
                background: theme.palette.error.main,
                color: theme.palette.error.contrastText,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: theme.shape.borderRadius - 2,
                mr: 2,
                px: 2,
                fontSize: '0.7rem',
              }}
              onClick={() => handleDeleteSelected()}
            >
              Delete Selected
            </Box>
            <Box
              sx={{
                background: theme.palette.primary.main,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                width: 48,
                height: 40,
                borderRadius: theme.shape.borderRadius - 2,
              }}
              onClick={() => setNewWebhookModelOpen(true)}
            >
              +
            </Box>
          </Box>
        </Box>
        <WebhooksDataGrid apiRef={apiRef} setSnackbar={setSnackbar} />
        <Modal
          open={newWebhookModelOpen}
          onClose={() => setNewWebhookModelOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 2,
              pt: 2,
              px: 4,
              pb: 3,
            }}
          >
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              align="center"
            >
              New Webhook Link
            </Typography>
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <TextField
                autoFocus={true}
                inputRef={nameInputRef}
                id="name-basic"
                label="name"
                variant="outlined"
              />
              <TextField
                inputRef={typeInputRef}
                id="outlined-select-currency"
                select
                label="Event Type"
                defaultValue="JOIN"
                helperText="Please select the event type."
              >
                <MenuItem value="JOIN">JOIN</MenuItem>
                <MenuItem value="GIFT">GIFT</MenuItem>
                <MenuItem value="LIKE">LIKE</MenuItem>
                <MenuItem value="SHARE">SHARE</MenuItem>
                <MenuItem value="FOLLOW">FOLLOW</MenuItem>
                <MenuItem value="SUBSCRIBE">SUBSCRIBE</MenuItem>
                <MenuItem value="COMMENT">COMMENT</MenuItem>
              </TextField>
              <Button variant="contained" onClick={handleCreateURL}>
                Create URL
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}
