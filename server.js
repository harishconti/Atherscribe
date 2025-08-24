const express = require('express');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const port = process.env.PORT || 8080;

// IMPORTANT: Load the API key from environment variables.
// This key should NOT be hardcoded or exposed to the client.
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey });

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'dist' directory (Vite's build output)
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoint to proxy requests to the Gemini API
app.post('/api/generate', async (req, res) => {
  const { prompt, generationConfig, systemInstruction, modelName = 'gemini-2.5-flash' } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  if (!generationConfig || !systemInstruction) {
    return res.status(400).json({ error: 'Generation config and system instruction are required.' });
  }

  try {
    const model = ai.getModel({
        model: modelName,
        systemInstruction: systemInstruction,
    });

    const result = await model.generateContent(prompt, generationConfig);
    const response = result.response;
    const text = response.text();
    const tokenCount = response.usageMetadata?.totalTokenCount ?? 0;

    res.json({ text, tokenCount });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to generate content from Gemini API.' });
  }
});

// API endpoint for image generation
app.post('/api/generate-image', async (req, res) => {
    const { prompt, config } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required.' });
    }

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: config || {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        if (!response.generatedImages || response.generatedImages.length === 0) {
            throw new Error("Image generation failed, no images were returned.");
        }

        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        res.json({ imageBytes: base64ImageBytes });

    } catch (error) {
        console.error("Gemini Image API call failed:", error);
        res.status(500).json({ error: "Failed to generate image. Please try again later." });
    }
});


// Send index.html for any other requests that don't match an API route or a static file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`AetherScribe backend server listening on port ${port}`);
});
