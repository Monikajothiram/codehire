const axios = require('axios');

exports.runCode = async (req, res) => {
  const { source_code, language_id } = req.body;

  try {
    const submitRes = await axios.post(
      'https://ce.judge0.com/submissions?base64_encoded=false&wait=true',
      { source_code, language_id },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': 'your_judge0_token'
        },
        timeout: 10000
      }
    );

    const { stdout, stderr, compile_output, status } = submitRes.data;
    const output = stdout || compile_output || stderr || status?.description || 'No output';
    res.json({ output });
  } catch (err) {
    try {
      const submitRes = await axios.post(
        'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
        { source_code, language_id },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': '8e8d2e0f8emsh3f6b8a8c8d8e8f8p1a2b3cjsn4d5e6f7a8b',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          },
          timeout: 10000
        }
      );
      const { stdout, stderr, compile_output, status } = submitRes.data;
      const output = stdout || compile_output || stderr || status?.description || 'No output';
      res.json({ output });
    } catch (err2) {
      res.status(500).json({ output: 'Error connecting to code execution engine. Please try again.' });
    }
  }
};