import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Chip, Menu, MenuItem, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  MusicNote as MusicNoteIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { logout, logoutSource, logoutDestination } from '../services/authService';
import { toast } from 'react-toastify';

const Header = ({ authStatus }) => {
  const navigate = useNavigate();
  const { sourceAuthenticated, destAuthenticated, sourceUser, destUser } = authStatus;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutSource = async () => {
    try {
      await logoutSource();
      window.location.href = '/';
    } catch (error) {
      toast.error('Error logging out source account');
      console.error('Source logout error:', error);
    }
    handleMenuClose();
  };

  const handleLogoutDestination = async () => {
    try {
      await logoutDestination();
      window.location.href = '/';
    } catch (error) {
      toast.error('Error logging out target account');
      console.error('Destination logout error:', error);
    }
    handleMenuClose();
  };

  const handleLogoutBoth = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      toast.error('Error while logging out');
      console.error('Logout error:', error);
    }
    handleMenuClose();
  };

  return (
    <AppBar 
      position="static"
      sx={{
        background: 'linear-gradient(135deg, #1DB954 0%, #1aa34a 100%)',
        boxShadow: '0 4px 20px rgba(29, 185, 84, 0.3)',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          <MusicNoteIcon sx={{ fontSize: 28 }} />
        </IconButton>
        
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            color: 'black'
          }} 
          onClick={() => navigate('/')}
        >
          Spotify Migration
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {sourceAuthenticated && sourceUser && (
            <Chip
              avatar={
                <Avatar 
                  src={sourceUser.images?.[0]?.url} 
                  sx={{ width: 28, height: 28 }}
                >
                  {!sourceUser.images?.[0]?.url && <AccountCircleIcon />}
                </Avatar>
              }
              label={`Sorgente: ${sourceUser.display_name}`}
              variant="outlined"
              size="medium"
              sx={{ 
                bgcolor: 'rgba(0,0,0,0.2)',
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                fontWeight: 500,
                '& .MuiChip-avatar': {
                  color: 'white'
                }
              }}
            />
          )}
          
          {destAuthenticated && destUser && (
            <Chip
              avatar={
                <Avatar 
                  src={destUser.images?.[0]?.url}
                  sx={{ width: 28, height: 28 }}
                >
                  {!destUser.images?.[0]?.url && <AccountCircleIcon />}
                </Avatar>
              }
              label={`Destinazione: ${destUser.display_name}`}
              variant="outlined"
              size="medium"
              sx={{ 
                bgcolor: 'rgba(0,0,0,0.2)',
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                fontWeight: 500,
                '& .MuiChip-avatar': {
                  color: 'white'
                }
              }}
            />
          )}
          
          <IconButton
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ 
              color: 'black',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.1)'
              }
            }}
          >
            <HomeIcon />
          </IconButton>
          
          {(sourceAuthenticated || destAuthenticated) && (
            <>
              <Button 
                color="inherit" 
                onClick={handleMenuClick}
                startIcon={<LogoutIcon />}
                aria-controls={open ? 'logout-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{
                  color: 'black',
                  fontWeight: 600,
                  borderRadius: 3,
                  px: 2,
                  py: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.1)'
                  }
                }}
              >
                Logout
              </Button>
              <Menu
                id="logout-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'logout-button',
                }}
                PaperProps={{
                  sx: {
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                    mt: 1
                  }
                }}
              >
                {sourceAuthenticated && (
                  <MenuItem 
                    onClick={handleLogoutSource}
                    sx={{ 
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: 'rgba(29, 185, 84, 0.1)'
                      }
                    }}
                  >
                    <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    Logout Source Account
                  </MenuItem>
                )}
                {destAuthenticated && (
                  <MenuItem 
                    onClick={handleLogoutDestination}
                    sx={{ 
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: 'rgba(29, 185, 84, 0.1)'
                      }
                    }}
                  >
                    <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    Logout Target Account 
                  </MenuItem>
                )}
                {sourceAuthenticated && destAuthenticated && (
                  <MenuItem 
                    onClick={handleLogoutBoth}
                    sx={{ 
                      py: 1.5,
                      borderTop: '1px solid rgba(255,255,255,0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(29, 185, 84, 0.1)'
                      }
                    }}
                  >
                    <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    Logout Both
                  </MenuItem>
                )}
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
