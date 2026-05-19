import dotenv from 'dotenv';
dotenv.config();
const key = process.env.GOOGLE_AI_KEY;
async function listModels() {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Models:", JSON.stringify(data, null, 2));
    }
    catch (error) {
        console.error("Error:", error);
    }
}
listModels();
//# sourceMappingURL=list_available.js.map