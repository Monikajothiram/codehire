const axios = require('axios');

const LANGUAGE_MAP = {
  71: 'python',
  63: 'javascript',
  54: 'cpp',
  62: 'java',
  50: 'c',
};

exports.runCode = async (req, res) => {
  const { source_code, language_id } = req.body;
  const language = LANGUAGE_MAP[language_id];

  if (!language) {
    return res.status(400).json({ output: 'Language not supported' });
  }

  try {
    const response = await axios.post(
      `https://glot.io/api/run/${language}/latest`,
      {
        files: [{ name: 'main', content: source_code }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token anonymous'
        },
        timeout: 15000
      }
    );

    const output = response.data.stdout || response.data.stderr || 'No output';
    res.json({ output });
  } catch (err) {
    console.error('Glot error:', err.message);
    res.status(500).json({ output: 'Error running code. Try again.' });
  }
};