import axios from "axios";
import env from "dotenv";
env.config();
// Called after successful OAuth login
export const youtubeAuthCallback = (req, res) => {
  // At this point req.user has YouTube tokens/profile
  console.log("YouTube user:", req.user);

  // If user was logged in before, tokens added to existing account
  // Otherwise, req.user is a new user created via YouTube login

  res.redirect(`${process.env.FRONTEND_URL}/dashboard`); // Frontend URL
};

// Example API call to fetch YouTube data
export const getYoutubeData = async (req, res) => {
  try {
    if (!req.user || !req.user.youtubeAccessToken) {
      return res.status(401).json({ message: "Not authenticated with YouTube" });
    }

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
      {
        headers: {
          Authorization: `Bearer ${req.user.youtubeAccessToken}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching YouTube data:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Failed to fetch YouTube data" });
  }
};
