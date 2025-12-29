const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Load words once into memory
const words = require('./words.json');

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Serve static files
app.use(express.static('public'));

app.get('/question', (req, res) => {
  if (!Array.isArray(words) || words.length < 2) {
    return res.status(500).json({ error: 'Invalid word list' });
  }

  const correct = getRandomElement(words);

  let wrong;
  do {
    wrong = getRandomElement(words);
  } while (wrong.en === correct.en);

  const options = [correct.en, wrong.en].sort(() => Math.random() - 0.5);

  res.json({
    bgWord: correct.bg,
    options,
    correctIndex: options.indexOf(correct.en)
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});