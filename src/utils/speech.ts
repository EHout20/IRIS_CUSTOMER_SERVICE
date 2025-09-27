export async function speakWithBackend(text: string, onStart?: () => void, onEnd?: () => void) {
  try {
    if (onStart) onStart();

    const res = await fetch("http://localhost:5000/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) throw new Error("TTS request failed");

    const audioBlob = await res.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    audio.onended = () => {
      if (onEnd) onEnd();
    };

    audio.play();
  } catch (err) {
    console.error("Speech Error:", err);
    if (onEnd) onEnd();
  }
}
