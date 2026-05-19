import dotenv from 'dotenv';
dotenv.config();
const key = process.env.GOOGLE_AI_KEY;
async function testV1() {
    try {
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                        parts: [{ text: "Hello" }]
                    }]
            })
        });
        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Response:", JSON.stringify(data, null, 2));
    }
    catch (error) {
        console.error("Error:", error);
    }
}
testV1();
//# sourceMappingURL=test_v1.js.map