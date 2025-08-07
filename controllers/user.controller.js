import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { successResponse, errorResponse } from '../utils/response.js';
import { generateToken } from '../utils/generateToken.js';


export const register = async (req, res) => {
  try {
    const { email, username, password, name } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return errorResponse(res, 'Username already taken', 400);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, username, password: hashedPassword, name });

    return successResponse(res, {
      id: user._id,
      username: user.username,
      name: user.name,
    }, 'User registered', 201);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};


export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return errorResponse(res, 'User not found', 404);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return errorResponse(res, 'Invalid credentials', 401);

    const token = generateToken(user._id); // Pakai util

    return successResponse(res, {
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
      },
    }, 'Login successful');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};


export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('id username name');
    if (!user) return errorResponse(res, 'User not found', 404);

    return successResponse(res, user, 'User found');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};
