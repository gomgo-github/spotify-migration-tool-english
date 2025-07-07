import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, CircularProgress, Paper, Card, Alert, Stepper, Step, StepLabel, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  MusicNote as MusicNoteIcon,
  SwapHoriz as SwapHorizIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import axios from 'axios';

const AuthDestination = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if we're returning from Spotify auth
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    if (error) {
      setError('Authentication failed: ' + error);
      return;
    }
    
    if (code) {
      // We're returning from Spotify with an auth code
      setLoading(true);
      
      // The actual auth is handled by the backend
      // We just need to redirect to the right page after auth completes
      axios.get('/api/auth/status')
        .then(response => {
          setLoading(false);
          
          if (response.data.destAuthenticated) {
            navigate('/preview');
          } else {
            setError('Authentication failed. Please try again.');
          }
        })
        .catch(err => {
          console.error('Error checking auth status:', err);
          setLoading(false);
          setError('Error checking authentication status');
        });
    }
  }, [navigate]);

  const handleAuth = () => {
    setLoading(true);
    // Redirect to backend auth route
    window.location.href = '/api/auth/destination/login';
  };

  const steps = ['Connect Source', 'Connect Target', 'Migration'];

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card 
          elevation={0}
          sx={{ 
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(29, 185, 84, 0.1) 0%, rgba(26, 163, 74, 0.05) 100%)',
            border: '1px solid rgba(29, 185, 84, 0.2)',
            borderRadius: 4,
            p: 6
          }}
        >
          <Box sx={{ mb: 3 }}>
            <SwapHorizIcon sx={{ fontSize: 60, color: '#1DB954', mb: 2 }} />
            <CircularProgress 
              size={60} 
              thickness={4}
              sx={{ 
                color: '#1DB954',
                mb: 2,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }} 
            />
          </Box>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
           Authentication in progress...
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We are redirecting you to Spotify to authorize the target account
          </Typography>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Progress Stepper */}
      <Box sx={{ mb: 6 }}>
        <Stepper activeStep={1} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={({ active, completed }) => (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: active || completed ? '#1DB954' : 'rgba(255,255,255,0.1)',
                      color: active || completed ? 'black' : 'white',
                      fontWeight: 600,
                      fontSize: '0.875rem'
                    }}
                  >
                    {completed ? <CheckCircleIcon /> : index + 1}
                  </Box>
                )}
                sx={{
                  '& .MuiStepLabel-label': {
                    color: 'text.primary',
                    fontWeight: 500
                  }
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 6, 
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(29, 185, 84, 0.1) 0%, rgba(26, 163, 74, 0.05) 100%)',
              border: '1px solid rgba(29, 185, 84, 0.2)',
              textAlign: 'center'
            }}
          >
            <Box sx={{ mb: 4 }}>
              <SwapHorizIcon 
                sx={{ 
                  fontSize: 80, 
                  color: '#1DB954',
                  mb: 2
                }} 
              />
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                fontWeight="700"
                sx={{ 
                  background: 'linear-gradient(135deg, #1DB954 0%, #1ed760 50%, #1aa34a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Connect Target Account
              </Typography>
            </Box>
            
            <Typography 
              variant="h6" 
              paragraph 
              color="text.secondary"
              sx={{ mb: 4, lineHeight: 1.6 }}
            >
              Great! Now connect your Spotify <strong>target</strong> account - the one you want to transfer data to.
            </Typography>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 4, 
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    fontWeight: 500
                  }
                }}
              >
                {error}
              </Alert>
            )}
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="body1" color="text.secondary" paragraph>
                <SecurityIcon sx={{ verticalAlign: 'middle', mr: 1, color: '#1DB954' }} />
                This account will also use Spotify's secure OAuth2 authentication.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <CheckCircleIcon sx={{ verticalAlign: 'middle', mr: 1, color: '#1DB954' }} />
                Make sure you are using the correct Spotify account for the destination
              </Typography>
            </Box>
            
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleAuth}
              startIcon={<SwapHorizIcon />}
              sx={{ 
                px: 6, 
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 4,
                background: 'linear-gradient(90deg, #1DB954 0%, #1ed760 100%)',
                color: 'black',
                '&:hover': {
                  background: 'linear-gradient(90deg, #1aa34a 0%, #1DB954 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(29, 185, 84, 0.4)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              🎯 Connect Target Account
            </Button>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
                Once connected, you can select what to migrate between the two accounts.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuthDestination;
