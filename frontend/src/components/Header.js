import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import React, { useContext, useEffect } from 'react';
import AvatarSVG from '../assets/48px.svg';
import LogoSVG from '../assets/akisyah_logo/white.svg';
import NotificationSVG from '../assets/Bell + Notification.svg';
import GridSVG from '../assets/Grid.svg';
import MenuSVG from '../assets/Menu.svg';
import SettingSVG from '../assets/Settings.svg';
import { sessionContext } from '../features/Session';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  // justifyContent: "flex-end",
  // padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

function Header() {
  const isDesktop = useMediaQuery('(min-width:768px)');
  const [open, setOpen] = React.useState(
    window.localStorage.getItem('drawer') === 'true'
  );
  const { logout } = useContext(sessionContext);
  const theme = useTheme();
  useEffect(() => {
    if (!isDesktop) {
      setOpen(false);
    }
  }, [isDesktop]);

  useEffect(() => {
    window.localStorage.setItem('drawer', open);
  }, [open]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <AppBar
        sx={{
          background: theme.palette.background.default,
          boxShadow: 'none',
          border: 'none',
        }}
        position="fixed"
        open={open}
      >
        <Toolbar>
          <IconButton
            color="darkGray"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              justifyContent: open ? 'space-between' : 'flex-end',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <IconButton
              onClick={handleDrawerClose}
              sx={{
                display: !open ? 'none' : 'block',
                height: 40,
                width: 40,
                mx: 2,
              }}
            >
              <img src={MenuSVG} alt="Menu" />
            </IconButton>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifySelf: 'flex-end',
              }}
            >
              <Box
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: theme.palette.text.secondary,
                  hover: {
                    color: theme.palette.text.primary,
                  },
                }}
                onClick={() => logout()}
              >
                Logout
              </Box>
              <IconButton
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: 'center',
                }}
              >
                <img src={SettingSVG} alt="Grid" />
              </IconButton>
              <IconButton
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: 'center',
                }}
              >
                <img src={NotificationSVG} alt="Grid" />
              </IconButton>
              <IconButton
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: 'center',
                }}
              >
                <img src={AvatarSVG} alt="Grid" width={40} height={40} />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader
          sx={{
            background: theme.palette.background.default,
            border: 'none',
            px: 6,
            py: 3,
          }}
        >
          <img
            style={{ objectFit: 'contain', width: '100%' }}
            src={LogoSVG}
            alt="Logo"
          />
        </DrawerHeader>
        <List
          sx={{
            background: theme.palette.background.default,
            border: 'none',
            height: '100%',
          }}
        >
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <img src={GridSVG} alt="Grid" />
              </ListItemIcon>
              <ListItemText
                primary={'Dashboard'}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}

export default Header;
