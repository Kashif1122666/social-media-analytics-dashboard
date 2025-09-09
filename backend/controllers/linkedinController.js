// controllers/linkedinController.js
import axios from "axios";
import qs from "qs";
import User from "../models/User.js";
import env from "dotenv";
import jwt from "jsonwebtoken";
env.config();

// Step 1: Redirect to LinkedIn authorization
export const linkedinAuth = (req, res) => {
  const params = {
    response_type: "code",
    client_id: process.env.LINKEDIN_CLIENT_ID,
    redirect_uri: process.env.LINKEDIN_REDIRECT_URL,
    scope: "openid profile email w_member_social",
    state: "random_state_string"
  };

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${qs.stringify(params)}`;
  res.redirect(authUrl);
};

// Step 2: Handle callback and exchange code for tokens
export const linkedinCallback = async (req, res) => {
  try {
    const { code, error, error_description } = req.query;

    if (error) {
      console.error("LinkedIn OAuth error:", error, error_description);
      return res.redirect(`${process.env.FRONTEND_URL}/linkedin_failed`);
    }

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}/linkedin_failed`);
    }


    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      qs.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URL,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    const { access_token } = tokenResponse.data;

    // Fetch user profile
    const profileResponse = await axios.get("https://api.linkedin.com/v2/userinfo", {
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Connection": "Keep-Alive",
      }
    });

    const profileData = profileResponse.data;
    console.log("✅ LinkedIn Profile Data:", profileData);

    // Process user information
    const userInfo = {
      id: profileData.sub,
      name: profileData.name,
      email: profileData.email,
      given_name: profileData.given_name,
      family_name: profileData.family_name,
      picture: profileData.picture
    };

    console.log("✅ Processed User Info:", userInfo);

    // Find or create user
    let user = await User.findOne({ email: userInfo.email });

    if (!user) {
      user = new User({
        linkedinId: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        avatar: userInfo.picture,
        linkedinAccessToken: access_token,
        provider: "linkedin"
      });
      await user.save();
      console.log("✅ New user created:", user.email);
    } else {
      user.linkedinAccessToken = access_token;
      user.linkedinId = userInfo.id;
      if (!user.avatar && userInfo.picture) {
        user.avatar = userInfo.picture;
      }
      await user.save();
      console.log("✅ Existing user updated:", user.email);
    }

    // Log the user in manually
    req.login(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return res.redirect(`${process.env.FRONTEND_URL}/linkedin_failed`);
      }
      const token = jwt.sign(
                 { id: user._id },
                  process.env.JWT_SECRET,
                 { expiresIn: "7d" }
                            );
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
    });

  } catch (error) {
    console.error("❌ LinkedIn authentication error:", error.response?.data || error.message);
    
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    
    return res.redirect(`${process.env.FRONTEND_URL}/linkedin_failed`);
  }
};

// Test LinkedIn API access
export const testLinkedinProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.linkedinAccessToken) {
      return res.status(401).json({ error: "Not authenticated with LinkedIn" });
    }

    const response = await axios.get("https://api.linkedin.com/v2/userinfo", {
      headers: {
        "Authorization": `Bearer ${req.user.linkedinAccessToken}`,
        "Connection": "Keep-Alive",
      }
    });

    res.json({ success: true, profile: response.data });
  } catch (error) {
    console.error("Test profile error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch profile", details: error.response?.data });
  }
};