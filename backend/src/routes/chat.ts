import express from 'express';
import { createChat, updateChat, retrieveChat, streamChat, retrieveChats} from '../controllers/chat';

const router = express.Router();
router.post('/create', createChat);
router.post('/update', updateChat);
router.get('/retrieve/:conversationId', retrieveChat);
router.get('/conversations', retrieveChats);
router.get('/stream/:conversationId', streamChat);

export default router;