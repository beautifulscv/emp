import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { addViewHelpers } from './middleware/viewHelpers.js';
import { checkAuthState } from './middleware/authMiddleware.js';
import {executeQuery} from "./database.js";

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize express app
const app = express();
const port = 3000;

// Set up EJS as view engine
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// Serve static files
app.use(express.static(join(__dirname, 'public')));

// Add middleware
app.use(addViewHelpers);
app.use(checkAuthState);

// Mock game data
const mockGames = {
  popular: [
    {
      "title": "Book",
      "image": "/images/TA001.png"
    },
    {
      "title": "King Arthur",
      "image": "/images/TA002.png"
    }
  ]
  ,
  all: [
    { id: 1, title: '아낙수나문', image: '/images/TA001.png' },
    { id: 2, title: '리틀킹', image: '/images/TA002.png' },
    { id: 3, title: '신전', image: '/images/TA001.png' },
    { id: 4, title: '슈퍼보난자', image: '/images/TA002.png' }
  ]
};

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: '아바타 상점' });
});

app.get('/avatar-shop', (req, res) => {
  res.render('avatar-shop', { title: '아바타 상점' });
});

app.get('/holdem', (req, res) => {
  res.render('holdem', { title: '홀덤' });
});

app.get('/slot', async (req, res) => {

  let rows = mockGames.popular;
  try {
    rows = await executeQuery("select gameName as title, thumbnailUrl as image from gameInfo where gameCategoryId = 0", []);
  } catch (error) {
    console.log(error);
  }
  console.log(JSON.stringify(rows, null, 2));

  res.render('slot', {
    title: '슬롯',
    popularGames: rows,
    allGames: rows
  });
});

app.get('/membership', (req, res) => {
  res.render('membership', { title: '멤버십' });
});

app.get('/support', (req, res) => {
  res.render('support', { title: '게임문의' });
});

app.get('/mypage', (req, res) => {
  res.render('mypage', { title: '마이페이지' });
});

// Add register route
app.get('/register', (req, res) => {
  res.render('register', { title: '회원가입' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
