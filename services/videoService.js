const axios = require("axios");
const { apiKey } = require("../config/youtube");

class VideoService {
  async search(query, maxResults = 8) {
    if (!apiKey) {
      return { items: [], error: "YouTube API key not configured." };
    }

    try {
      const res = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            key: apiKey,
            q: query,
            part: "snippet",
            type: "video",
            maxResults,
          },
        },
      );

      // normalize items
      const items = res.data.items.map((it) => ({
        videoId: it.id.videoId,
        title: it.snippet.title,
        description: it.snippet.description,
        thumbnail: it.snippet.thumbnails?.default?.url || null,
      }));

      return { items };
    } catch (err) {
      // Log for server-side visibility
      console.error(
        "YouTube API error:",
        err.response ? err.response.data : err.message,
      );

      let message = "YouTube API error";
      if (err.response) {
        const status = err.response.status;
        const apiMessage =
          err.response.data &&
          err.response.data.error &&
          err.response.data.error.message
            ? err.response.data.error.message
            : JSON.stringify(err.response.data);
        message = `Request failed with status ${status}: ${apiMessage}`;
        if (status === 403) {
          message +=
            " (403 Forbidden: check that your API key is valid, that YouTube Data API v3 is enabled for the key, and that any key restrictions allow requests from this server.)";
        }
      } else if (err.message) {
        message = err.message;
      }

      return { items: [], error: message };
    }
  }
}

module.exports = new VideoService();
