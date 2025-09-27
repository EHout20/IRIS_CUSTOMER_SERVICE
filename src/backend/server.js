import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Inline TTS endpoint (mirrors src/backend/routes/tts.js) to avoid import/export issues
app.post("/api/tts", async (req, res) => {
	const { text } = req.body;
	if (!text) return res.status(400).json({ error: "Text is required" });

	try {
		const response = await axios.post(
			"https://api.elevenlabs.io/v1/text-to-speech/OYTbf65OHHFELVut7v2H",
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

// Root - show simple info so browser doesn't get 'Cannot GET /'
app.get("/", (req, res) => {
	res.json({
		status: "ok",
		message: "TTS backend is running",
		routes: ["/api/tts (POST)", "/health (GET)"],
	});
});

// Health check for quick diagnostics
app.get("/health", (req, res) => {
	res.json({ status: "ok", env_loaded: !!process.env.ELEVENLABS_API_KEY, port: process.env.PORT || 5000 });
});

// Global error handlers to surface startup/runtime errors in the terminal
process.on("uncaughtException", (err) => {
	console.error("Uncaught exception:", err);
});
process.on("unhandledRejection", (reason) => {
	console.error("Unhandled rejection:", reason);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
