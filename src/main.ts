import dotenv from 'dotenv';
import express from 'express';
import { AccessToken } from 'livekit-server-sdk';
import { v4 as uuidv4 } from 'uuid';

type TokenRequest = {
  userId: string;
  name: string;
};

// Load environment variables from .env.local file
dotenv.config({ path: '.env.local' });

// Define your variables here
const instructions = "Some instructions"; 
const voice = "male"; // Or any other valid voice
const temperature = 0.7;
const turnDetection = "silence"; // Or any other valid turn detection type

// This route handler creates a token for a given room and participant
async function createToken({ roomName, participantName }: TokenRequest) {
  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: participantName,
    ttl: '10m' // Moved ttl here
  });

  at.metadata = JSON.stringify({
    instructions: instructions,
    modalities: ["text", "audio"], // Changed to array
    voice: voice || "fallback", // Using fallback value
    cards: "The user has no cards",
    context: "Refer to the user as Seeker",
    temperature: temperature,
    max_output_tokens: 10000,
    openai_api_key: process.env.OPENAI_API_KEY,
    turn_detection: JSON.stringify({
      type: turnDetection,
      threshold: 0.5,
      silence_duration_ms: 200,
      prefix_padding_ms: 300,
    }),
  });

  // Token permissions can be added here based on the
  // desired capabilities of the participant
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canUpdateOwnMetadata: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  });

  return at.toJwt();
}

const app = express();
const port = 8080;

app.use(express.json()); // Add this to parse JSON request body

app.post('/token', async (req, res) => {
  const userId = req.body.userId; // Changed to req.body.userId
  const uuid = uuidv4();
  const roomName = userId + uuid.substring(0, 7);

  // Call createToken function
  const accessToken = await createToken({ roomName, participantName: userId }); 

  res.json({ // Changed to res.json
    accessToken: accessToken, 
    room: roomName,
    url: process.env.LIVEKIT_URL
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
