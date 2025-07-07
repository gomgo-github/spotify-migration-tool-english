import React from 'react';
import { Container, Typography, Box, Button, Paper, Grid, Card, CardContent, CardActions, Chip, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  MusicNote as MusicNoteIcon, 
  SwapHoriz as SwapHorizIcon, 
  QueueMusic as QueueMusicIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  AutoAwesome as AutoAwesomeIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';

const Home = ({ authStatus }) => {
  const navigate = useNavigate();
  const { sourceAuthenticated, destAuthenticated } = authStatus;

  const getProgressValue = () => {
    if (sourceAuthenticated && destAuthenticated) return 100;
    if (sourceAuthenticated || destAuthenticated) return 50;
    return 0;
  };

  const steps = [
    {
      title: '1. Connect Source Account',
      description: 'Authorize the Spotify account you want to transfer data from',
      icon: <MusicNoteIcon sx={{ fontSize: 40, color: '#1DB954' }} />,
      completed: sourceAuthenticated,
      action: !sourceAuthenticated ? () => navigate('/auth/source') : null,
      buttonText: 'Connect Source'
    },
    {
      title: '2. Connect Target Account',
      description: 'Authorize the Spotify account you want to transfer data to',
      icon: <SwapHorizIcon sx={{ fontSize: 40, color: '#1DB954' }} />,
      completed: destAuthenticated,
      action: sourceAuthenticated && !destAuthenticated ? () => navigate('/auth/destination') : null,
      buttonText: 'Connect Target'
    },
    {
      title: '3. Start Migration',
      description: 'Select and transfer playlists, saved songs and followed artists',
      icon: <QueueMusicIcon sx={{ fontSize: 40, color: '#1DB954' }} />,
      completed: sourceAuthenticated && destAuthenticated,
      action: sourceAuthenticated && destAuthenticated ? () => navigate('/preview') : null,
      buttonText: 'Start Migration'
    }
  ];

  const features = [
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 48, color: '#1DB954' }} />,
      title: 'Complete Migration',
      description: 'Transfer playlists, saved songs, followed artists and more'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48, color: '#1DB954' }} />,
      title: 'Safe and Private',
      description: 'We use the official Spotify API. Your data is never stored.'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 48, color: '#1DB954' }} />,
      title: 'Fast and Reliable',
      description: 'Optimized migration process with intelligent error handling'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Box 
          sx={{ 
            background: 'linear-gradient(135deg, #1DB954 0%, #1ed760 50%, #1aa34a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 2
          }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            fontWeight="800"
            sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              letterSpacing: '-0.02em'
            }}
          >
            Spotify Migration Tool
          </Typography>
        </Box>
        <Typography 
          variant="h5" 
          color="text.secondary" 
          paragraph
          sx={{ 
            maxWidth: '800px',
            mx: 'auto',
            fontWeight: 300,
            lineHeight: 1.4
          }}
        >
          Easily transfer playlists, saved songs, and followed artists between different Spotify accounts
        </Typography>
        
        {/* Progress Bar */}
        <Box sx={{ mt: 4, mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Progresso configurazione: {Math.round(getProgressValue())}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={getProgressValue()} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #1DB954 0%, #1ed760 100%)',
                borderRadius: 4
              }
            }} 
          />
        </Box>
      </Box>

      {/* Steps Section */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {steps.map((step, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                background: step.completed 
                  ? 'linear-gradient(135deg, #1DB954 0%, #1aa34a 100%)' 
                  : 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
                borderRadius: 3,
                border: step.completed ? 'none' : '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
                transform: step.completed ? 'scale(1.02)' : 'scale(1)',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 25px rgba(29, 185, 84, 0.3)'
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2, position: 'relative' }}>
                  {step.icon}
                  {step.completed && (
                    <CheckCircleIcon 
                      sx={{ 
                        position: 'absolute', 
                        top: -5, 
                        right: -5, 
                        color: 'white', 
                        backgroundColor: '#1DB954', 
                        borderRadius: '50%',
                        fontSize: 20
                      }} 
                    />
                  )}
                </Box>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                {step.action ? (
                  <Button 
                    variant={step.completed ? "outlined" : "contained"}
                    onClick={step.action}
                    sx={{ 
                      borderRadius: 3,
                      px: 3,
                      color: step.completed ? 'white' : 'black',
                      backgroundColor: step.completed ? 'transparent' : '#1DB954',
                      borderColor: step.completed ? 'white' : 'transparent',
                      '&:hover': {
                        backgroundColor: step.completed ? 'rgba(255,255,255,0.1)' : '#1aa34a'
                      }
                    }}
                  >
                    {step.buttonText}
                  </Button>
                ) : (
                  <Chip 
                    icon={step.completed ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                    label={step.completed ? "Completed" : "Pending"}
                    color={step.completed ? "success" : "default"}
                    variant={step.completed ? "filled" : "outlined"}
                  />
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Features Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 6, 
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(29, 185, 84, 0.1) 0%, rgba(26, 163, 74, 0.05) 100%)',
          border: '1px solid rgba(29, 185, 84, 0.2)',
          mb: 6
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          textAlign="center" 
          fontWeight="700"
          sx={{ mb: 4 }}
        >
          Why choose our tool?
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* CTA Section */}
      <Box sx={{ textAlign: 'center' }}>
        {!sourceAuthenticated && !destAuthenticated ? (
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/auth/source')}
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
            🚀 Start Now
          </Button>
        ) : sourceAuthenticated && !destAuthenticated ? (
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/auth/destination')}
            sx={{ 
              px: 6, 
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 4,
              background: 'linear-gradient(90deg, #1DB954 0%, #1ed760 100%)',
              color: 'black'
            }}
          >
            Connect Target Account
          </Button>
        ) : sourceAuthenticated && destAuthenticated ? (
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/preview')}
            sx={{ 
              px: 6, 
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 4,
              background: 'linear-gradient(90deg, #1DB954 0%, #1ed760 100%)',
              color: 'black'
            }}
          >
            ✨ Continue to Migrate
          </Button>
        ) : null}
      </Box>
      
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7 }}>
          🔒 This tool uses the official Spotify API and transfers your data securely.<br/>
          We do not store any personal information or Spotify data.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;
