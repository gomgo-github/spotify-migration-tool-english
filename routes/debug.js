const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

// Endpoint to retrieve debug logs
router.get('/logs', async (req, res) => {
  try {
    // Read log files
    const errorLogPath = path.join(__dirname, '..', 'error.log');
    const combinedLogPath = path.join(__dirname, '..', 'combined.log');
    
    // Read the last 50 logs
    const errorLogContent = await readFileAsync(errorLogPath, 'utf8');
    const combinedLogContent = await readFileAsync(combinedLogPath, 'utf8');
    
    // Convert logs to JSON format
    const errorLogs = errorLogContent
      .split('\n')
      .filter(line => line.trim())
      .slice(-50)
      .map(line => {
        try {
          const logObj = JSON.parse(line);
          return {
            timestamp: new Date(logObj.timestamp),
            message: logObj.message,
            type: 'error'
          };
        } catch (e) {
          return {
            timestamp: new Date(),
            message: line,
            type: 'error'
          };
        }
      });
    
    const combinedLogs = combinedLogContent
      .split('\n')
      .filter(line => line.trim())
      .slice(-50)
      .map(line => {
        try {
          const logObj = JSON.parse(line);
          return {
            timestamp: new Date(logObj.timestamp),
            message: logObj.message,
            type: logObj.level === 'error' ? 'error' : 'info'
          };
        } catch (e) {
          return {
            timestamp: new Date(),
            message: line,
            type: 'info'
          };
        }
      });
    
    // Combine logs and sort by timestamp (newest first)
    const allLogs = [...errorLogs, ...combinedLogs]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 50);
    
    res.json({ logs: allLogs });
  } catch (error) {
    console.error('Error retrieving logs:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve logs',
      logs: [
        { timestamp: new Date(), message: 'Error retrieving logs from server', type: 'error' },
        { timestamp: new Date(), message: error.message, type: 'error' }
      ]
    });
  }
});

// Endpoint to retrieve authentication debug information
router.get('/auth-info', (req, res) => {
  try {
    // Retrieve information about environment variables (without exposing secrets)
    const envInfo = {
      SOURCE_CLIENT_ID: process.env.SOURCE_CLIENT_ID ? `${process.env.SOURCE_CLIENT_ID.substring(0, 5)}...` : 'Not set',
      SOURCE_REDIRECT_URI: process.env.SOURCE_REDIRECT_URI || 'Not set',
      SOURCE_CLIENT_SECRET_SET: process.env.SOURCE_CLIENT_SECRET ? 'Yes' : 'No',
      DEST_CLIENT_ID: process.env.DEST_CLIENT_ID ? `${process.env.DEST_CLIENT_ID.substring(0, 5)}...` : 'Not set',
      DEST_REDIRECT_URI: process.env.DEST_REDIRECT_URI || 'Not set',
      DEST_CLIENT_SECRET_SET: process.env.DEST_CLIENT_SECRET ? 'Yes' : 'No',
      NODE_ENV: process.env.NODE_ENV || 'development',
      PORT: process.env.PORT || '5000'
    };
    
    // Retrieve session information (if available)
    const sessionInfo = req.session ? {
      sourceUserSet: !!req.session.sourceUser,
      destUserSet: !!req.session.destUser,
      sourceTokensSet: !!req.session.sourceTokens,
      destTokensSet: !!req.session.destTokens
    } : { error: 'Session not available' };
    
    res.json({
      env: envInfo,
      session: sessionInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error retrieving auth info:', error);
    res.status(500).json({ error: 'Failed to retrieve auth info' });
  }
});

// Export the router
module.exports = router;
