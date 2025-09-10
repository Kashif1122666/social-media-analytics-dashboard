// // routes/linkedin.js
// import express from "express";
// import passport from "passport";
// import jwt from "jsonwebtoken";
// import { authMiddleware } from "../middleware/auth.js";
// import User from "../models/User.js";

// const router = express.Router();

// // start LinkedIn OAuth (frontend provides state in URL)
// router.get(
//   "/auth/linkedin",
//   passport.authenticate("linkedin", { session: false })
// );

// // callback (handled by passport + strategy)
// router.get(
//   "/auth/linkedin/callback",
//   passport.authenticate("linkedin", { session: false, failureRedirect: "/login" }),
//   (req, res) => {
//     res.redirect(`${process.env.FRONTEND_URL}/linkedin-analysis?success=true`);
//   }
// );

// // =====================
// // @desc Fetch LinkedIn stats for logged-in user
// // =====================
// router.get("/linkedin/stats", authMiddleware, async (req, res) => {
//   try {
//     if (!req.user.linkedin || !req.user.linkedin.accessToken) {
//       return res.status(400).json({ msg: "LinkedIn not connected" });
//     }

//     // Example: get basic profile
//     const response = await fetch("https://api.linkedin.com/v2/me", {
//       headers: {
//         Authorization: `Bearer ${req.user.linkedin.accessToken}`,
//       },
//     });

//     const profile = await response.json();

//     res.json({
//       name: profile.localizedFirstName + " " + profile.localizedLastName,
//       id: profile.id,
//       connected: true,
//     });
//   } catch (err) {
//     console.error("LinkedIn stats error:", err);
//     res.status(500).json({ msg: "Failed to fetch LinkedIn stats" });
//   }
// });

// export default router;
