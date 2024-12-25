import dotenv from 'dotenv';
import express from 'express';
import { AccessToken } from 'livekit-server-sdk';

type TokenRequest = {
  userId: string;
  name: string;
};

// Load environment variables from .env.local file
dotenv.config({ path: '.env.local' });

// This route handler creates a token for a given room and participant
async function createToken({ roomName, participantName }: TokenRequest) {
  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: participantName,
    metadata: JSON.stringify({
      instructions: instructions,
      modalities: "text", "audio",
      voice: voice, "fallback",
      cards: "The user has no cards",
      context: "Refer to the user as Seeker".
      temperature: temperature,
      max_output_tokens: 10000,
      openai_api_key: process.env.OPENAI_API_KEY,
      turn_detection: JSON.stringify({
        type: turnDetection,
        threshold: 0.5,
        silence_duration_ms: 200,
        prefix_padding_ms: 300,
    // Token to expire after 10 minutes
    ttl: '10m',
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
    canUpdateOwnMetadata: true,
  });
  return at.toJwt();
}

const app = express();
const port = 8080;

app.post('/token', async (req, res) => {
  const { v4: uuidv4 } = require('uuid');
  const userId = request.userId;
  const uuid = uuidv4();
  const roomName = userId + uuid.substring(0, 7);
  return Response.json({
    accessToken: await at.toJwt(),
    room: roomName,
    url: process.env.LIVEKIT_URL
  });

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
