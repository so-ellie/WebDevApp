YouTube API key

This app supports searching YouTube using the Data API v3. To enable search functionality, set the environment variable `YOUTUBE_API_KEY` to a valid API key.

- Export on Windows (PowerShell):
  $env:YOUTUBE_API_KEY = "YOUR_KEY"

- Or run when starting the app:
  YOUTUBE_API_KEY=YOUR_KEY npm run dev

If the key is not set, the search will show an error message on the page and you can still view and manage favorites manually.

Tip: You can store the key in a `.env` file at the project root:

```
YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY_HERE
```

The app uses `dotenv` to load `.env` automatically on startup.

Troubleshooting 403 errors

- A 403 usually means the API key is invalid, the **YouTube Data API v3** is not enabled for the key, or the key has restrictions (HTTP referrers, IP addresses) that block requests from your server.
- Steps to resolve:
  1. Confirm the key in `.env` is correct (no extra quotes/spaces).
  2. In the Google Cloud Console, ensure **YouTube Data API v3** is enabled for the project that owns the key.
  3. Check the key's restrictions (Application restrictions). If you're testing locally, avoid restricting by HTTP referrer; use IP or leave unrestricted for quick testing.
  4. If changes are made in the console, restart the server.

If problems persist, inspect server logs for detailed API error messages.
