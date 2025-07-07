import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Paper, Accordion, AccordionSummary, AccordionDetails, Alert, Link, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import BugReportIcon from '@mui/icons-material/BugReport';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Error = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [errorMessage, setErrorMessage] = useState(queryParams.get('message') || 'An unexpected error occurred');
  const [detailedError, setDetailedError] = useState(null);
  const [serverLogs, setServerLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const isDebugMode = queryParams.get('debug') === 'true';
  
  useEffect(() => {
    // Try to extract a JSON from the error if present
    try {
      // Look for possible JSON in the error
      const jsonMatch = errorMessage.match(/\{.*\}/s);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const jsonObj = JSON.parse(jsonStr);
        setDetailedError(jsonObj);
      }
    } catch (e) {
      console.log('Failed to extract JSON from error:', e);
    }
    
    // If we are in debug mode, it automatically loads the logs
    if (isDebugMode) {
      fetchServerLogs();
    }
  }, [errorMessage, isDebugMode]);
  
  // Function to retrieve logs from server
  const fetchServerLogs = async () => {
    try {
      setLoadingLogs(true);
      // Calling the API endpoint to retrieve debug logs
      const response = await axios.get('/api/debug/logs');
      if (response.data && response.data.logs) {
        setServerLogs(response.data.logs);
      } else {
        // Fallback on empty response
        setServerLogs([
          { timestamp: new Date(), message: 'Authentication attempt failed', type: 'error' },
          { timestamp: new Date(), message: 'Verify credentials in .env file', type: 'info' },
          { timestamp: new Date(), message: 'Controlla che i redirect URI siano configurati correttamente nel Spotify Developer Dashboard', type: 'info' }
        ]);
      }
    } catch (error) {
      console.error('Error retrieving logs:', error);
      toast.error('Unable to retrieve logs from server');
      // Fallback on error
      setServerLogs([
        { timestamp: new Date(), message: 'Error retrieving logs from server', type: 'error' },
        { timestamp: new Date(), message: error.message || 'Unknown error', type: 'error' },
        { timestamp: new Date(), message: 'Tip: Make sure the server is running', type: 'info' }
      ]);
    } finally {
      setLoadingLogs(false);
    }
  };

  // Check if the error is related to Spotify permissions
  const isAuthScopeError = errorMessage.toLowerCase().includes('scope') || 
                           errorMessage.toLowerCase().includes('permission') || 
                           errorMessage.toLowerCase().includes('autorizzazioni');
  
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="error">
          Error
        </Typography>
        
        <Box sx={{ my: 4, p: 3, bgcolor: 'error.main', color: 'white', borderRadius: 1 }}>
          <Typography variant="body1">{errorMessage}</Typography>
        </Box>
        
        {isAuthScopeError && (
          <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Tip:</strong> This error could be caused by insufficient permissions in your Spotify apps.
            </Typography>
            <Typography variant="body2">
              Verify that both apps in the Spotify Developer Dashboard have all the necessary scopes and that the Redirect URIs are configured correctly.
              See the <Link href="/" onClick={(e) => {e.preventDefault(); navigate('/');}} color="primary">README</Link> for more information.
            </Typography>
          </Alert>
        )}
        
        <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            <strong>Tips to solve the problem:</strong>
          </Typography>
          <Typography variant="body2" component="div">
            <ol>
              <li>Verify that the credentials in the .env file are correct</li>
              <li>Check that the Redirect URIs in the Spotify Developer Dashboard match exactly those in the .env file</li>
              <li>Make sure your Spotify app has all the necessary scopes</li>
              <li>Try clearing your browser cookies and restarting the application</li>
              <li>Verify that the server is running on the correct port (5000)</li>
            </ol>
          </Typography>
        </Alert>
        
        {detailedError && (
          <Accordion sx={{ mt: 2, mb: 4 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Technical details of the error</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, overflow: 'auto' }}>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {JSON.stringify(detailedError, null, 2)}
                </pre>
              </Box>
            </AccordionDetails>
          </Accordion>
        )}
        
        {/* Debug Logs Section */}
        {isDebugMode && (
          <Box sx={{ mt: 3 }}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BugReportIcon sx={{ mr: 1, color: 'warning.main' }} />
                  <Typography>Debug Information</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  {loadingLogs ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      <CircularProgress size={30} />
                    </Box>
                  ) : serverLogs.length > 0 ? (
                    <Box sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                      {serverLogs.map((log, index) => (
                        <Typography key={index} variant="body2" color={log.type === 'error' ? 'error' : 'textPrimary'} sx={{ mb: 1 }}>
                          [{new Date(log.timestamp).toLocaleTimeString()}] {log.message}
                        </Typography>
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center' }}>
                      <Button 
                        variant="outlined" 
                        color="info" 
                        startIcon={<InfoIcon />}
                        onClick={fetchServerLogs}
                      >
                        Load Debug Logs
                      </Button>
                    </Box>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
        
        <Box sx={{ mt: 4, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
          
          {!isDebugMode && (
            <Button 
              variant="outlined" 
              color="info" 
              size="large"
              onClick={() => navigate(`/error?message=${encodeURIComponent(errorMessage)}&debug=true`)}
            >
              Show Debug Info
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Error;
