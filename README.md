# Brain Dump

A React application that helps you organize your thoughts with AI-powered summaries and action items.

## Features

- **Thought Capture**: Quick and easy input for capturing your thoughts
- **AI Analysis**: Powered by Claude AI to provide:
  - Concise summary points
  - Actionable items
  - Motivational encouragement
- **History Management**: 
  - Automatic archiving of thoughts and their summaries
  - Persistent storage using localStorage
  - Chronological display (newest first)

## Technical Stack

- Frontend: React
- Backend: Express.js
- AI: Anthropic's Claude API
- Storage: Browser's localStorage

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your-api-key-here
   ```

4. Start the backend server:
   ```bash
   node src/api/server.js
   ```

5. In a new terminal, start the frontend:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Usage

1. Enter a single, focused thought in the input area
2. Click "Summarize" to get AI-powered analysis
3. Review the summary and action items
4. After 5 seconds, the entry moves to history
5. Previous entries are stored locally and persist across browser sessions

## Environment Variables

- `ANTHROPIC_API_KEY`: Your Claude API key from Anthropic
- `PORT`: (Optional) Port for the backend server (defaults to 3001)

## Project Structure 

brain-dump/
├── src/
│ ├── components/
│ │ └── ThoughtDumper.js
│ ├── styles/
│ │ └── ThoughtDumper.css
│ ├── api/
│ │ └── server.js
│ └── index.js
├── public/
│ └── index.html
├── .env
└── package.json