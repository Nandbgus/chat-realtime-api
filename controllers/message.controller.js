// controllers/message.controller.js
import Message from '../models/message.model.js';
import Chat from '../models/chat.model.js';
import { getSocketIO } from '../sockets/socket.instance.js';

export const sendMessage = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    // Buat pesan baru
    const newMessage = await Message.create({
      sender: req.user._id,
      chat: chatId,
      content,
    });

    // Ambil ulang pesan dan populate sender & chat
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'username')
      .populate('chat');

    if (!populatedMessage || !populatedMessage.sender) {
      return res.status(500).json({ success: false, message: 'Failed to populate message' });
    }

    // Kirim via socket
    const io = getSocketIO();
    io.to(chatId).emit('messageReceived', {
      _id: populatedMessage._id,
      content: populatedMessage.content,
      sender: {
        _id: populatedMessage.sender._id,
        username: populatedMessage.sender.username,
      },
      chat: populatedMessage.chat._id,
      createdAt: populatedMessage.createdAt,
    });

    res.status(201).json({
      success: true,
      data: populatedMessage,
    });
  } catch (err) {
    next(err);
  }
};


export const getMessagesByChatId = async (req, res) => {
  try {
    const { chatId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalMessages = await Message.countDocuments({ chat: chatId });

    const messages = await Message.find({ chat: chatId })
      .populate({
        path: 'sender',
        select: 'username _id',
      })
      .sort({ createdAt: -1 }) // ambil terbaru dulu
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: messages.reverse(), // agar urut dari lama ke baru di frontend
      pagination: {
        total: totalMessages,
        page,
        limit,
        totalPages: Math.ceil(totalMessages / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// controllers/message.controller.js
export const updateMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to edit this message' });
    }

    // ✅ Update isi dan status edited
    message.content = content;
    message.edited = true;
    await message.save();

    const updatedMessage = await Message.findById(messageId)
      .populate('sender', 'username')
      .populate('chat');

    const io = getSocketIO();
    io.to(message.chat.toString()).emit('messageUpdated', {
      _id: updatedMessage._id,
      content: updatedMessage.content,
      sender: {
        _id: updatedMessage.sender._id,
        username: updatedMessage.sender.username,
      },
      chat: updatedMessage.chat._id,
      updatedAt: updatedMessage.updatedAt,
      edited: updatedMessage.edited, // ✅ jangan lupa sertakan ini ke frontend
    });

    res.status(200).json({ success: true, data: updatedMessage });
  } catch (err) {
    next(err);
  }
};


export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this message' });
    }

    // Ganti remove() dengan findByIdAndDelete()
    await Message.findByIdAndDelete(messageId);

    const io = getSocketIO();
    io.to(message.chat.toString()).emit('messageDeleted', {
      _id: messageId,
    });

    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
