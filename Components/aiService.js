/**
 * AI Service - Connects to Google Gemini API
 */
const API_KEY = "YOUR_GEMINI_API_KEY_HERE"; 
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

export const AIService = {
    async getStudyTips(taskTitle) {
        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: `Give me 3 short, actionable study steps for this task: "${taskTitle}". Keep it under 20 words.` }]
                    }]
                })
            });

            const data = await response.json();
            // Extract the text from the Gemini response structure
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("AI Error:", error);
            return "Focus on the core concepts and practice active recall.";
        }
    }
};