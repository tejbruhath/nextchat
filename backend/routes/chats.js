import express from 'express';
import { getDatabase } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all chats for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    const userId = req.user.id;

    const chats = await db.all(`
      SELECT 
        c.id,
        c.name,
        c.is_group,
        c.created_at,
        (
          SELECT u.username 
          FROM chat_members cm2 
          JOIN users u ON cm2.user_id = u.id 
          WHERE cm2.chat_id = c.id AND cm2.user_id != ? 
          LIMIT 1
        ) as other_username,
        (
          SELECT cm2.user_id 
          FROM chat_members cm2 
          WHERE cm2.chat_id = c.id AND cm2.user_id != ? 
          LIMIT 1
        ) as other_user_id,
        (
          SELECT m.text 
          FROM messages m 
          WHERE m.chat_id = c.id 
          ORDER BY m.created_at DESC 
          LIMIT 1
        ) as last_message,
        (
          SELECT m.created_at 
          FROM messages m 
          WHERE m.chat_id = c.id 
          ORDER BY m.created_at DESC 
          LIMIT 1
        ) as last_message_time
      FROM chats c
      JOIN chat_members cm ON c.id = cm.chat_id
      WHERE cm.user_id = ?
      ORDER BY last_message_time DESC
    `, [userId, userId, userId]);

    res.json({ chats });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: 'Failed to get chats' });
  }
});

// Create new chat (direct or group)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    const { name, isGroup, memberIds } = req.body;
    const userId = req.user.id;

    // For direct chats, check if chat already exists
    if (!isGroup && memberIds && memberIds.length === 1) {
      const existingChat = await db.get(`
        SELECT c.id 
        FROM chats c
        JOIN chat_members cm1 ON c.id = cm1.chat_id
        JOIN chat_members cm2 ON c.id = cm2.chat_id
        WHERE c.is_group = 0
        AND cm1.user_id = ?
        AND cm2.user_id = ?
      `, [userId, memberIds[0]]);

      if (existingChat) {
        return res.json({ chatId: existingChat.id, message: 'Chat already exists' });
      }
    }

    // Create new chat
    const result = await db.run(
      'INSERT INTO chats (name, is_group) VALUES (?, ?)',
      [name || null, isGroup ? 1 : 0]
    );

    const chatId = result.lastID;

    // Add current user to chat
    await db.run(
      'INSERT INTO chat_members (chat_id, user_id) VALUES (?, ?)',
      [chatId, userId]
    );

    // Add other members
    if (memberIds && memberIds.length > 0) {
      for (const memberId of memberIds) {
        await db.run(
          'INSERT INTO chat_members (chat_id, user_id) VALUES (?, ?)',
          [chatId, memberId]
        );
      }
    }

    res.status(201).json({ chatId, message: 'Chat created successfully' });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

// Get chat messages
router.get('/:chatId/messages', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    const { chatId } = req.params;
    const userId = req.user.id;

    // Verify user is member of chat
    const membership = await db.get(
      'SELECT id FROM chat_members WHERE chat_id = ? AND user_id = ?',
      [chatId, userId]
    );

    if (!membership) {
      return res.status(403).json({ error: 'Not a member of this chat' });
    }

    const messages = await db.all(`
      SELECT 
        m.id,
        m.chat_id,
        m.sender_id,
        m.text,
        m.media_url,
        m.media_type,
        m.is_read,
        m.created_at,
        u.username as sender_username
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.chat_id = ?
      ORDER BY m.created_at ASC
    `, [chatId]);

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Search users
router.get('/users/search', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    const { query } = req.query;
    const userId = req.user.id;

    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const users = await db.all(
      'SELECT id, username, avatar FROM users WHERE username LIKE ? AND id != ? LIMIT 10',
      [`%${query}%`, userId]
    );

    res.json({ users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

export default router;
