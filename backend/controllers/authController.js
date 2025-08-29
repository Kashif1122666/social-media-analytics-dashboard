import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import env from "dotenv";
env.config();

export const logoutUser = (req, res) => {
  req.logout(() => {   // if using passport
    req.session.destroy(() => {
      res.clearCookie('connect.sid'); 
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    });
  });
}