import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { addViewHelpers } from './middleware/viewHelpers.js';
import { checkAuthState } from './middleware/authMiddleware.js';
import {executeQuery} from "./database.js";
import {mockGames} from "./mock.js";
import axios from "axios";
import session from 'express-session';
// import {MOCK_USER} from "./public/js/config/constants";


// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize express app
const app = express();
const port = 3000;

// Set up EJS as view engine
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// Add session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Serve static files
app.use(express.static(join(__dirname, 'public')));

app.use(express.json());

// Add middleware
app.use(addViewHelpers);
app.use(checkAuthState);

const setLocals = (req, res, next) => {
  // Make session data available to all views
  res.locals.isLoggedIn = !!req.session.user;
  res.locals.user = req.session.user || {};
  res.locals.path = req.path;
  next();
};

// app.js or index.js
app.use(setLocals);

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
  let channels = mockGames.channels;
  try {
    channels = await executeQuery("select id as channelId, channelName as name, description as requirement, minimum, baseBlindAmount from pokerChannel;", []);
    // console.log(JSON.stringify(channels, null, 2));
  } catch (e) {
  }
  res.render('holdem', { title: '홀덤', channels });
});

app.get('/slot', async (req, res) => {
  let rows = mockGames.popular;
  try {
    rows = await executeQuery("select gameName as title, thumbnailUrl as image, gameCode as code from gameInfo where gameCategoryId = 0", []);
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

app.post('/login', async (req, res) => {
  const { userId, password } = req.body;

  // Basic check: if either field is missing, return an error
  if (!userId || !password) {
    return res.status(400).json({ message: 'Missing credentials' });
  }

  try {
    // Query the DB to find a matching user
    const rows = await executeQuery(
        'SELECT u.*, a.image avatarImage FROM user u JOIN avatar a ON a.id = u.avatarId WHERE username = ? AND passwordHash = ? LIMIT 1;',
        [userId, password]
    );
    console.log('rows:', rows)

    if (rows.length > 0) {
      // Found user
      const user = rows[0];
      console.log('User logged in:', user.username);
      // In production, you'd probably store a session or JWT here
      // For example, set a cookie: req.session.user = { ... }
      req.session.user = user;

/*
      authState.setSession({
        id: user.id,//MOCK_USER.id,
        username: user.username, //MOCK_USER.username,
        avatarUrl: MOCK_USER.avatarUrl,
        // add additional user data here (including cash if needed)
        cash: 5000000
      });
*/

      return res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          avatarUrl: user.avatarUrl || '/images/avatar_placeholder.png',
          // any other user fields you want to expose
        },
      });
    } else {
      // No user found
      return res
          .status(401)
          .json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/game/init', async (req, res) => {
  try {
    const userData = req.session.user;
    const {id : userId} = userData;
    const {gameCode, roomId} = req.query;

    console.log('roomId:', roomId)

    console.log('userData', userData);

    if(!userData) {
      res.json({
        result: false,
        msg: 'Please login to play games.'
      });
      return;
    }

    const url = `${process.env.API_URL}/integrator/games/init`;
    console.log('url:', url);
    console.log('gameCode:', gameCode);
    const response = await axios.post(url, { gameCode, userId, roomId });

    const { data } = response.data;
    const { gameUrl } = data;
    console.log('gameUrl:', gameUrl);

    if (gameUrl) {
      res.json({
        result: true,
        message: 'ok',
        url: gameUrl
      });
    } else {
      res.json({
        result: false,
        message: 'Invalid game code'
      });
    }
  } catch (error) {
    console.log(`error: ${error}`);
    console.error('Error fetching game data:', error.response?.status, error.response?.message);
    res.json({
      result: false,
      message: 'Login!'
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
