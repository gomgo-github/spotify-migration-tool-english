import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Button, CircularProgress, List, ListItem, ListItemText, Alert, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Migration = ({ authStatus }) => {
  const navigate = useNavigate();
  const [migrationStarted, setMigrationStarted] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState('in_progress');
  const [migrationLog, setMigrationLog] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [migrationData, setMigrationData] = useState(null);

  useEffect(() => {
    try {
      // Retrieve selections from localStorage
      const selectedPlaylists = JSON.parse(localStorage.getItem('selectedPlaylists') || '[]');
      const selectedSavedTracks = JSON.parse(localStorage.getItem('selectedSavedTracks') || 'false');
      const selectedSavedTrackIds = JSON.parse(localStorage.getItem('selectedSavedTrackIds') || '[]');
      const selectedFollowedArtists = JSON.parse(localStorage.getItem('selectedFollowedArtists') || 'false');
      const selectedFollowedArtistIds = JSON.parse(localStorage.getItem('selectedFollowedArtistIds') || '[]');
      
      // Check if at least one of the selections contains elements
      const hasData = 
        selectedPlaylists.length > 0 || 
        (selectedSavedTracks && selectedSavedTrackIds.length > 0) || 
        (selectedFollowedArtists && selectedFollowedArtistIds.length > 0);
      
      if (!hasData) {
        navigate('/preview');
        return;
      }
      
      // Create migrationData object
      const migrationData = {
        playlists: selectedPlaylists,
        savedTracks: selectedSavedTracks,
        savedTrackIds: selectedSavedTrackIds,
        followedArtists: selectedFollowedArtists,
        followedArtistIds: selectedFollowedArtistIds
      };
      
      setMigrationData(migrationData);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing migration data:', error);
      toast.error('Error loading migration data');
      navigate('/preview');
    }
  }, [navigate]);

  const startMigration = async () => {
    try {
      setMigrationStarted(true);
      setLoading(true);
      
      // Submit migration request with default options
      const response = await axios.post('/api/migration/migrate', {
        ...migrationData,
        followNonUserPlaylists: true, // Default option
        transferImages: true // Default option
      });
      
      // Update status with results
      setMigrationStatus(response.data.success ? 'completed' : 'failed');
      setMigrationLog(response.data.log || []);
      setErrors(response.data.errors || []);
      
      // Clean up localStorage
      localStorage.removeItem('selectedPlaylists');
      localStorage.removeItem('selectedSavedTracks');
      localStorage.removeItem('selectedSavedTrackIds');
      localStorage.removeItem('selectedFollowedArtists');
      localStorage.removeItem('selectedFollowedArtistIds');
      
    } catch (error) {
      console.error('Error during migration:', error);
      setMigrationStatus('failed');
      setErrors([error.message]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {migrationStarted ? 'Migration in progress...' : 'Loading data...'}
        </Typography>
      </Container>
    );
  }

  // Summary page before migration
  if (!migrationStarted) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Migration Summary
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Items to migrate
          </Typography>
          
          <Typography variant="body1" paragraph>
            You are about to migrate the following items from {authStatus.sourceUser?.display_name} to {authStatus.destUser?.display_name}:
          </Typography>
          
          <List sx={{ width: '100%', maxWidth: 360, mx: 'auto', bgcolor: 'background.paper' }}>
            {migrationData?.playlists.length > 0 && (
              <ListItem>
                <ListItemText 
                  primary={`${migrationData.playlists.length} Playlists`} 
                />
              </ListItem>
            )}
            
            {migrationData?.savedTracks && migrationData.savedTrackIds.length > 0 && (
              <ListItem>
                <ListItemText primary={`${migrationData.savedTrackIds.length} Favorite Tracks`} />
              </ListItem>
            )}
            
            {migrationData?.followedArtists && migrationData.followedArtistIds.length > 0 && (
              <ListItem>
                <ListItemText primary={`${migrationData.followedArtistIds.length} Followed Artists`} />
              </ListItem>
            )}
          </List>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <Button 
              variant="contained" 
              color="primary"
              size="large"
              onClick={startMigration}
            >
              Start Migration
            </Button>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={() => navigate('/preview')}
            >
              Back to selection
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Migration results page
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {migrationStatus === 'completed' ? 'Migration Completed' : 'Migration Error'}
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Migration Log
        </Typography>
        <Paper sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
          {migrationLog.map((log, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 1 }}>
              {log}
            </Typography>
          ))}
        </Paper>
      </Box>
      
      {errors.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" color="error" gutterBottom>
            Error
          </Typography>
          <Paper sx={{ p: 2, maxHeight: 200, overflow: 'auto', bgcolor: 'error.light' }}>
            {errors.map((error, index) => (
              <Typography key={index} variant="body2" color="error.contrastText">
                {error}
              </Typography>
            ))}
          </Paper>
        </Box>
      )}
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/preview')}
        >
          Back to Preview
        </Button>
        <Button 
          variant="outlined" 
          color="primary"
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default Migration;
