// middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token tidak ditemukan atau format salah" });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token sudah kadaluarsa" });
      }
      return res.status(401).json({ message: "Token tidak valid" });
    }

    console.log("Token:", token);
    console.log("Decoded ID:", decoded.id); // harusnya sudah muncul sekarang

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Middleware Error:", err);
    res.status(500).json({ message: "Autentikasi gagal di server" });
  }
};
