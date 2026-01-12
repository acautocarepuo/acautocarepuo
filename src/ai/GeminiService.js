import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
    constructor() {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        this.isConfigured = !!apiKey;

        if (this.isConfigured) {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
        } else {
            console.warn("Gemini API Key missing in .env");
        }
    }

    async askQuestion(query) {
        if (!this.isConfigured) return "⚠️ API Key missing. Please configure .env file.";

        const prompt = `
        You are an expert automotive mechanic specializing in Proton X50 and car engines.
        Answer the following question for a non-technical car owner.
        Keep it concise, professional, and helpful. 
        Safety first.
        
        User Question: "${query}"
        `;

        try {
            const result = await this.model.generateContent(prompt);
            return result.response.text();
        } catch (e) {
            console.error("Gemini Error:", e);
            return "Sorry, I'm having trouble connecting to the engine database right now.";
        }
    }

    async diagnosePart(partName, commonIssues) {
        if (!this.isConfigured) return "⚠️ API Key missing. Please configure .env file.";

        const prompt = `
        Act as a Virtual Mechanic.
        The user is looking at the "${partName}".
        Known common issues: ${commonIssues}.
        
        Provide a brief breakdown:
        1. What this part does.
        2. Symptoms of failure (based on the known issues).
        3. Prevention tips.
        
        Format as clear bullet points.
        `;

        try {
            const result = await this.model.generateContent(prompt);
            return result.response.text();
        } catch (e) {
            return "Diagnosis unavailable.";
        }
    }
}
