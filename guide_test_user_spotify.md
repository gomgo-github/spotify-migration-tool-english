# Guide: How to Add a Test User in the Spotify Developer Dashboard

This document explains how to resolve the 403 Forbidden error that occurs during authentication with the Spotify APIs when the app is in development mode.

## The Problem

When a Spotify app is in development mode (the default setting for new apps), only users explicitly added as "test users" are allowed to use it. If you try to authenticate using an account that hasn’t been added as a test user, you will receive a 403 Forbidden error.

## Solution: Add Your Account as a Test User

Follow these steps to add your Spotify account as a test user:

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)

2. Select the app you're working with (you need to do this for both the source and destination apps)

3. Click on "Settings" (⚙️) in the top right corner

4. Scroll down to the "User Management" section

5. Click on "Add New User"

6. Enter the email address associated with the Spotify account you're using for authentication

7. Click "Save"

8. Repeat these steps for both the source and destination apps

## Important Notes

* You must add as a test user the exact Spotify account you're using to access the application

* If you're testing both the source and destination accounts, both must be added as test users in their respective apps

* After adding a test user, you may need to wait a few minutes for the changes to take effect

* If you continue to receive the 403 Forbidden error, try clearing your browser cookies and restarting the application

## Alternative: Request Extended Mode

If you plan to distribute and set-up the app to a wider audience, you can request that the app be moved from development mode to extended mode:

1. In the Developer Dashboard, select the app

2. Click on "Settings" (⚙️)

3. Scroll down to the "Extended Quota Mode" section

4. Click on "Request Extended Quota"

5. Fill out the form with the required information

However, for personal use or simple testing, adding your account as a test user is the fastest and easiest solution.
