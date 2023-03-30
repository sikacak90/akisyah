import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import { yellow } from '@mui/material/colors';
import useTheme from '@mui/material/styles/useTheme';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ListItem from '../components/ListItem';
import { sessionContext } from '../features/Session';
import { socket } from '../socket.io/socket';
import { EVENT_TYPES } from '../utils/constants';
import { getCurrentTime } from '../utils/utils';

function copyListItems(array) {
  const formattedText = array
    .map((item) => {
      return `${item.username}`;
    })
    .join('\n');

  navigator.clipboard
    .writeText(formattedText)
    .then(() => {
      console.log('Copied to clipboard:', formattedText);
    })
    .catch((err) => {
      console.error('Failed to copy to clipboard:', err);
    });
}

function List() {
  const theme = useTheme();
  const { session } = useContext(sessionContext);
  const isMobile = useMediaQuery('(max-width:500px)');
  const isTablet = useMediaQuery('(max-width:1000px)');
  const navigate = useNavigate();
  const { eventType, webhookID } = useParams();
  const location = useLocation();
  const name = location.state?.name;
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!session.isLoggedIn) {
      navigate('/');
    }
  }, [session.isLoggedIn, navigate]);

  useEffect(() => {
    if (!EVENT_TYPES.includes(eventType)) {
      navigate('/dashboard');
    }
  }, [eventType, navigate]);

  useEffect(() => {
    function handleEvent(data) {
      console.log('data', data);
      setEvents((prev) => {
        data.time = getCurrentTime();
        return [data, ...prev];
      });
    }
    socket.on(webhookID, handleEvent);
    return () => {
      socket.off(webhookID, handleEvent);
    };
  }, [webhookID]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        pb: 5,
        color: theme.palette.text.primary,
      }}
    >
      <Typography
        variant="h6"
        component={'h1'}
        fontWeight="400"
        sx={{ margin: '2rem 0' }}
      >
        Akisyah Live Interaction
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: theme.palette.background.default,
          padding: isMobile || isTablet ? '2rem 1rem' : '2rem',
          width: isMobile || isTablet ? '100%' : theme.breakpoints.values.md,
          borderRadius: theme.shape.borderRadius - 2,
        }}
      >
        <Box
          sx={{
            margin: isMobile ? '2rem 0' : '0 0 1rem 0',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" component={'h1'}>
            {name}
          </Typography>
          <Typography variant="body1" component={'p'} color={yellow['A200']}>
            Total Users : {events.length}
          </Typography>
        </Box>
        <Box width={'100%'}>
          <Box
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'space-around'}
            width={'100%'}
          >
            <Typography
              variant="caption"
              component={'h1'}
              fontWeight="400"
              color={theme.palette.text.secondary}
            >
              Username
            </Typography>
            <Typography
              variant="caption"
              component={'h1'}
              fontWeight="400"
              color={theme.palette.text.secondary}
            >
              Time
            </Typography>
          </Box>
          <Box
            display={'flex'}
            sx={{
              flexDirection: 'column',
              height: '46vh',
              overflow: 'scroll',
              '::-webkit-scrollbar': {
                display: 'none',
              },
              '::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,0)',
              },
              my: 2,
            }}
            width="100%"
          >
            {events.map((event, index) => {
              return (
                <React.Fragment key={index}>
                  <ListItem
                    imgUrl={event['avatar_url']}
                    name={event['value1']}
                    time={event['time']}
                  />
                </React.Fragment>
              );
            })}
          </Box>
          <Box
            display={'flex'}
            sx={{ width: '100%', my: 1 }}
            justifyContent="space-between"
          >
            <Button
              variant="contained"
              fullWidth={true}
              color={'buttonGray'}
              sx={{
                borderBottom: '4px solid #B9BCBE',
              }}
              onClick={() => setEvents([])}
            >
              Clear List
            </Button>
            <Box sx={{ width: '10px' }}></Box>
            <Button
              variant="contained"
              fullWidth={true}
              sx={{
                borderBottom: '4px solid #3687D9',
              }}
              onClick={() => copyListItems(events)}
            >
              Copy List
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
                fontSize: '0.9rem',
                fontWeight: '300',
                color: theme.palette.text.secondary,
                mt: 2,
              }}
            >
              Back to Dashboard?
            </Typography>
            <Typography
              component={Link}
              color={'primary'}
              to={'/dashboard'}
              sx={{
                textAlign: 'center',
                fontSize: '0.9rem',
                fontWeight: '400',
                textDecoration: 'none',
                cursor: 'pointer',
                mt: 2,
                ml: 1,
              }}
            >
              click here
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default List;
