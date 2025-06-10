import React from 'react';
import { Box, Typography, Link, Container, Grid, IconButton } from '@mui/material';
import { 
  MusicNote as MusicNoteIcon,
  GitHub as GitHubIcon,
  Favorite as FavoriteIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{
        mt: 'auto',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
        borderTop: '1px solid rgba(29, 185, 84, 0.3)',
        py: 6,
        px: 2
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <MusicNoteIcon sx={{ fontSize: 32, color: '#1DB954', mr: 1 }} />
              <Typography variant="h6" fontWeight="700" color="white">
                Spotify Migration
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
              Strumento sicuro e affidabile per migrare i tuoi dati tra account Spotify diversi.
            </Typography>
          </Grid>

          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom color="white" fontWeight="600">
              Caratteristiche
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <SecurityIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle', color: '#1DB954' }} />
                OAuth2 Sicuro
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <MusicNoteIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle', color: '#1DB954' }} />
                API Ufficiale Spotify
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <FavoriteIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle', color: '#1DB954' }} />
                Migrazione Completa
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
            <Typography variant="h6" gutterBottom color="white" fontWeight="600">
              Informazioni
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Versione 1.0.0
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              🔒 I tuoi dati sono sempre al sicuro<br/>
              🚫 Non memorizziamo informazioni personali<br/>
              ✅ Compatibile con tutti gli account Spotify
            </Typography>
          </Grid>
        </Grid>

        <Box 
          sx={{ 
            mt: 4, 
            pt: 4, 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Realizzato con{' '}
            <FavoriteIcon sx={{ fontSize: 16, mx: 0.5, verticalAlign: 'middle', color: '#1DB954' }} />
            per la community Spotify
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} Spotify Migration Tool - Strumento non ufficiale per uso personale
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;