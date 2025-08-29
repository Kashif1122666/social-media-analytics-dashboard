import env from "dotenv";
env.config();

export const redditAuthFailure = (req, res) => {
  const errorMessage = req.session.messages?.[0] || "Reddit authentication failed";
  req.session.messages = [];
  res.redirect(
    `${process.env.FRONTEND_URL}/reddit_failed`
  );
};

export const logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    });
  });
};

export const getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};
