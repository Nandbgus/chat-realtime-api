// controllers/chat.controller.js
import mongoose from 'mongoose';
import Chat from '../models/chat.model.js';
import User from '../models/user.model.js';

export const createChat = async (req, res) => {
    try {
        const { members } = req.body;

        // Validasi: harus 2 anggota
        if (!members || !Array.isArray(members) || members.length !== 2) {
            return res.status(400).json({ message: "Members harus array dengan 2 userId." });
        }

        // Cek apakah sudah ada chat antara 2 user tersebut
        const existingChat = await Chat.findOne({
            members: { $all: members, $size: 2 }
        });

        if (existingChat) {
            return res.status(200).json(existingChat);
        }

        // Buat chat baru
        const newChat = new Chat({ members });
        const savedChat = await newChat.save();

        res.status(201).json(savedChat);
    } catch (err) {
        console.error("Error createChat:", err);
        res.status(500).json({ message: "Server error." });
    }
};



export const getUserChats = async (req, res) => {
    try {
        const userId = req.user._id;

        const chats = await Chat.find({
            members: { $in: [new mongoose.Types.ObjectId(userId)] }
        });

        res.status(200).json(chats);
    } catch (err) {
        console.error("Error getUserChats:", err);
        res.status(500).json({ message: "Server error." });
    }
};
