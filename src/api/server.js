require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const app = express();

// Add this to verify the API key is loaded
console.log('API Key available:', !!process.env.ANTHROPIC_API_KEY);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

app.use(express.json());

app.post('/api/summarize', async (req, res) => {
  console.log('Received request:', req.body);
  
  const { thought, timestamp } = req.body;
  
  if (!thought) {
    return res.status(400).json({ error: 'Thought is required' });
  }
  
  try {
    console.log('Calling Claude API...');
    const completion = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `Analyze this thought and provide a response in exactly this format:

Title: <create an appropriate title>

Key issues:
- Item 1
- Item 2

Action items:
- Item 1
- Item 2

<One line of motivation>

Use exactly this format with the title, sections, dashes and line breaks as shown. Be concise and clear.

Thought: ${thought}
Timestamp: ${timestamp}`
      }],
    });

    console.log('Claude response received');
    const summary = completion.content[0].text;
    
    // Convert the plain text to HTML-friendly format
    const formattedSummary = summary
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
    
    res.json({
      summary: formattedSummary,
      timestamp
    });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ 
      error: 'Error processing your thought',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 