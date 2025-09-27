import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const response = await axios.post(
      "https://api.elevenlabs.io/v1/text-to-speech/OYTbf65OHHFELVut7v2H", // default voice
      { text },
      {
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    res.set("Content-Type", "audio/mpeg");
    res.send(response.data);
  } catch (err) {
    console.error("TTS Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate speech" });
  }
});

export default router;
