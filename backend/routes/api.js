import { Router } from 'express';
import { generateSafetyAssessment } from '../services/riskEngine.js';
import { processEnvironmentalChat } from '../services/aiChatService.js';

const router = Router();

// Sample recommended queries for quick testing
const SAMPLE_QUERIES = [
  "Is it safe to hike around Mt. Fuji today?",
  "Are there any seismic warnings near San Francisco?",
  "Is driving to Lake Tahoe recommended during the snowstorm?",
  "Is outdoor running safe in Seattle right now?",
  "What is the safety assessment for Reykjavik, Iceland?"
];

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'AbhayaSetu (SafeRoute Bridge)',
    timestamp: new Date().toISOString()
  });
});

/**
 * Get sample queries
 */
router.get('/sample-queries', (req, res) => {
  res.json({ queries: SAMPLE_QUERIES });
});

/**
 * POST /api/assess
 * Main safety advisory assessment endpoint
 */
router.post('/assess', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ error: 'Safety query is required.' });
    }

    const assessment = await generateSafetyAssessment(query);
    res.json(assessment);
  } catch (err) {
    console.error('Error generating safety assessment:', err);
    res.status(500).json({ error: 'Failed to generate safety risk assessment.' });
  }
});

/**
 * POST /api/chat
 * Environmental AI Chatbot endpoint for general inquiries
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, history, apiKey } = req.body;
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const replyData = await processEnvironmentalChat(message, history || [], apiKey || '');
    res.json(replyData);
  } catch (err) {
    console.error('Error processing environmental chat:', err);
    res.status(500).json({ error: 'Failed to process environmental chat.' });
  }
});

export default router;
