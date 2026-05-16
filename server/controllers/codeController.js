const axios = require('axios');

const LANGUAGE_MAP = {
  71: { language: 'python', version: '3.10.0' },
  63: { language: 'javascript', version: '18.15.0' },
  54: { language: 'c++', version: '10.2.0' },
  62: { language: 'java', version: '15.0.2' },
  50: { language: 'c', version: '10.2.0' },
};

exports.runCode = async (req, res) => {
  const { source_code, language_id } = req.body;

  const lang = LANGUAGE_MAP[language_id];
  if (!lang) {
    return res.status(400).json({ output: 'Language not supported' });
  }

  try {
    const response = await axios.post(
      'https://emkc.org/api/v2/piston/execute',
      {
        language: lang.language,
        version: lang.version,
        files: [{ content: source_code }],
      },
      { timeout: 15000 }
    );

    const { run } = response.data;
    const output = run.stdout || run.stderr || 'No output';
    res.json({ output });
  } catch (err) {
    console.error('Piston error:', err.message);
    res.status(500).json({ output: 'Error running code. Try again.' });
  }
};