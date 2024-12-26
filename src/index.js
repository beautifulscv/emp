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
  ],
  avatars: [
    [
      {
        "price": 10000,
        "name": "Avatar #1",
        "image": "/images/avatar_0088.jpg"
      },
      {
        "price": 10000,
        "name": "Avatar #2",
        "image": "/images/avatar_0335.jpg"
      },
      {
        "price": 10000,
        "name": "Avatar #3",
        "image": "/images/avatar_0445.jpg"
      },
      {
        "price": 10000,
        "name": "Avatar #4",
        "image": "/images/avatar_1622.jpg"
      },
      {
        "price": 10000,
        "name": "Avatar #5",
        "image": "/images/avatar_1865.jpg"
      },
      {
        "price": 10000,
        "name": "Avatar #6",
        "image": "/images/avatar_2498.jpg"
      },
      {
        "price": 10000,
        "name": "Avatar #7",
        "image": "/images/avatar_3063.jpg"
      },
      {
        "price": 10000,
        "name": "Avatar #8",
        "image": "/images/avatar_3164.jpg"
      },
      {
        "price": 10000,
        "name": "Avatar #9",
        "image": "/images/avatar_3204.jpg"
      },
      {
        "price": 10000,
        "name": "Avatar #10",
        "image": "/images/avatar_3212.jpg"
      },
      {
        "price": 10000,
        "name": "Avatar #11",
        "image": "/images/avatar_3397.jpg"
      },
      {
        "price": 10000,
        "name": "Avatar #12",
        "image": "/images/avatar_4126.jpg"
      },
      {
        "price": 10000,
        "name": "Avatar #13",
        "image": "/images/avatar_5998.jpg"
      },
      {
        "price": 10000,
        "name": "Avatar #14",
        "image": "/images/avatar_6685.jpg"
      },
      {
        "price": 10000,
        "name": "Avatar #15",
        "image": "/images/avatar_7043.jpg"
      },
      {
        "price": 10000,
        "name": "Avatar #16",
        "image": "/images/avatar_7384.jpg"
      },
      {
        "price": 10000,
        "name": "Avatar #17",
        "image": "/images/avatar_7622.jpg"
      },
      {
        "price": 10000,
        "name": "Avatar #18",
        "image": "/images/avatar_7627.jpg"
      },
      {
        "price": 10000,
        "name": "Avatar #19",
        "image": "/images/avatar_7873.jpg"
      }
    ]
  ]

};

// Routes
app.get('/', async (req, res) => {
  let avatars = mockGames.avatars;
  try {
    avatars = await executeQuery("select price, title as name, image as image from avatar;", []);
    console.log(JSON.stringify(avatars, null, 2));
  } catch (e) {
  }
  res.render('index', { title: '아바타 상점' , avatars});
});

app.get('/avatar-shop', async (req, res) => {
  let avatars = mockGames.avatars;
  try {
    avatars = await executeQuery("select price, title as name, image as image from avatar;", []);
    console.log(JSON.stringify(avatars, null, 2));
  } catch (e) {
  }
  res.render('avatar-shop', { title: '아바타 상점' , avatars});
});

app.get('/holdem', async (req, res) => {
  let channels = mockGames.channel;
  try {
    channels = await executeQuery("select channelName as name, description as requirement, minimum from pokerChannel;", []);
    console.log(JSON.stringify(channels, null, 2));
  } catch (e) {
  }
  res.render('holdem', { title: '홀덤', channels });
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

app.get('/membership', async (req, res) => {
  let memberships = mockGames.memberships;
  try {
    memberships = await executeQuery("select id, earnedExp, bonusMoney, monthlyFee, imageUrl, membershipName from membership;", []);
    console.log(JSON.stringify(memberships, null, 2));
  } catch (e) {
  }
  res.render('membership', { title: '멤버십', memberships });
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
