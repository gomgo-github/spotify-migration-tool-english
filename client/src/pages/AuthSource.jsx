import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, CircularProgress, Paper, Card, CardContent, Alert, Stepper, Step, StepLabel, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  MusicNote as MusicNoteIcon,
  AccountCircle as AccountCircleIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import axios from 'axios';

const AuthSource = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if we're returning from Spotify auth
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    if (error) {
      setError('Autenticazione fallita: ' + error);
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
          
          if (response.data.sourceAuthenticated) {
            if (response.data.destAuthenticated) {
              navigate('/preview');
            } else {
              // Reindirizzamento alla pagina dell'account destinatario con un messaggio chiaro
              navigate('/auth/destination');
            }
          } else {
            setError('Autenticazione fallita. Riprova.');
          }
        })
        .catch(err => {
          console.error('Error checking auth status:', err);
          setLoading(false);
          setError('Errore durante il controllo dello stato di autenticazione');
        });
    }
  }, [navigate]);

  const handleAuth = () => {
    setLoading(true);
    // Redirect to backend auth route
    window.location.href = '/api/auth/source/login';
  };

  const steps = ['Connetti Sorgente', 'Connetti Destinazione', 'Migrazione'];

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
            <MusicNoteIcon sx={{ fontSize: 60, color: '#1DB954', mb: 2 }} />
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
            Autenticazione in corso...
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ti stiamo reindirizzando a Spotify per autorizzare l'accesso
          </Typography>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Progress Stepper */}
      <Box sx={{ mb: 6 }}>
        <Stepper activeStep={0} alternativeLabel>
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
              <AccountCircleIcon 
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
                Connetti Account Sorgente
              </Typography>
            </Box>
            
            <Typography 
              variant="h6" 
              paragraph 
              color="text.secondary"
              sx={{ mb: 4, lineHeight: 1.6 }}
            >
              Prima di tutto, connetti il tuo account Spotify <strong>sorgente</strong> - quello da cui vuoi trasferire i dati.
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
                Utilizziamo l'autenticazione OAuth2 di Spotify per garantire la massima sicurezza
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <CheckCircleIcon sx={{ verticalAlign: 'middle', mr: 1, color: '#1DB954' }} />
                I tuoi dati rimangono sempre sicuri e non vengono mai memorizzati sui nostri server
              </Typography>
            </Box>
            
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleAuth}
              startIcon={<MusicNoteIcon />}
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
              🚀 Connetti a Spotify
            </Button>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
                Verrai reindirizzato a Spotify per autorizzare l'accesso in modo sicuro
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuthSource;