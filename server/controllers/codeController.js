const axios = require('axios');

exports.runCode = async (req, res) => {
  const { source_code, language_id } = req.body;

  try {
    const submitRes = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
      { source_code, language_id },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
      }
    );

    const { stdout, stderr, compile_output, status } = submitRes.data;
    const output = stdout || compile_output || stderr || status?.description || 'No output';
    res.json({ output });
  } catch (err) {
    // Fallback to public Judge0
    try {
      const submitRes = await axios.post(
        'https://ce.judge0.com/submissions?base64_encoded=false&wait=true',
        { source_code, language_id },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const { stdout, stderr, compile_output, status } = submitRes.data;
      const output = stdout || compile_output || stderr || status?.description || 'No output';
      res.json({ output });
    } catch (err2) {
      res.status(500).json({ output: 'Error connecting to code execution engine.' });
    }
  }
};