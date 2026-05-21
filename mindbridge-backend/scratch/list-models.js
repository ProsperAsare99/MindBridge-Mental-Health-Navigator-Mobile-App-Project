import 'dotenv/config';

async function listModels() {
  const apiKey = process.env.GOOGLE_AI_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.models) {
      console.log("Available Models:");
      data.models.forEach(m => console.log(`- ${m.name} (${m.displayName})`));
    } else {
      console.log(data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

listModels();
