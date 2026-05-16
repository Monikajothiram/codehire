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
          'X-RapidAPI-Key': 'f92ac9751bmsh3686a16d7c1d70cp17d7bbjsn8b0cfdfb7b03',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
        timeout: 15000
      }
    );

    const { stdout, stderr, compile_output, status } = submitRes.data;
    const output = stdout || compile_output || stderr || status?.description || 'No output';
    res.json({ output });
  } catch (err) {
    console.error('Judge0 error:', err.message);
    res.status(500).json({ output: 'Error running code. Try again.' });
  }
};