import { google } from "googleapis";
import User from "../models/User.js";

export const refreshYoutubeToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user || !user.platforms.youtube.refreshToken) {
    throw new Error("No YouTube refresh token found");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    `${process.env.BACKEND_URL}/auth/youtube/callback`
  );

  oauth2Client.setCredentials({
    refresh_token: user.platforms.youtube.refreshToken,
  });

  const { credentials } = await oauth2Client.refreshAccessToken();
  user.platforms.youtube.accessToken = credentials.access_token;
  await user.save();

  return user.platforms.youtube.accessToken;
};
