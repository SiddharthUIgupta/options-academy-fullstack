const express = require('express');
const tutorialData = require('../utils/tutorialData');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Get all tutorial modules (for overview)
router.get('/modules', async (req, res) => {
  res.json(tutorialData.map(m => ({ id: m.id, title: m.title, lessonCount: m.lessons.length })));
});

// Get a specific lesson
router.get('/lessons/:lessonId', async (req, res) => {
  const { lessonId } = req.params;
  let lesson = null;
  tutorialData.forEach(m => {
    const found = m.lessons.find(l => l.id === lessonId);
    if (found) lesson = found;
  });

  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  res.json(lesson);
});

// Mark lesson as complete (requires userId, in future will use auth middleware)
router.post('/complete', async (req, res) => {
  const { userId, moduleId, lessonId } = req.body;
  
  try {
    const progress = await prisma.tutorialProgress.upsert({
      where: {
        userId_moduleId_lessonId: { userId, moduleId, lessonId }
      },
      update: { completedAt: new Date() },
      create: { userId, moduleId, lessonId }
    });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
