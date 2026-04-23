import { InferenceClient } from '@huggingface/inference';

const WEBSITE_KNOWLEDGE_BASE = `
Nama aplikasi: AC Auto Care
Fokus laman: bantuan AI untuk diagnosis aircond kereta, rujukan litar aircond, isu lazim, dan maklumat komponen.

Kandungan utama laman:
1. Aircond Circuit
- Rujukan imej litar: aircond_3.png
- Rujukan imej litar: aircond_4.png
- Video panduan: https://www.youtube.com/embed/nm0vXRiLTqs
- Video panduan: https://www.youtube.com/embed/_mIVKDBd8ts

2. Panduan Mengesan Masalah
- Unit pemampat tidak hidup
  Punca biasa:
  - Fius terbakar / putus
  - Gegelung magnet terbakar / putus
  - Bahan pendingin tidak mencukupi / tiada
  - Thermal amplifier rosak
- Unit pemampat hidup mati
  Punca biasa:
  - Pemeluwap terlalu panas
  - Suis tekanan bermasalah
  - Suis laras suhu bermasalah
- Kereta bergerak sejuk berhenti panas
  Punca biasa:
  - Kipas pemeluwap lemah / tidak berfungsi
- Angin dingin dalam kereta tidak kuat
  Punca biasa:
  - Penapis angin kabin kotor
  - Sirip penyejat tersumbat dengan habuk kotoran
  - Kipas penghembus lemah / berhabuk

3. Gaya jawapan yang dikehendaki
- Fokus pada sistem aircond kereta
- Jawapan ringkas, tepat, praktikal
- Sesuai untuk pengguna biasa dan juruteknik
- Utamakan langkah pemeriksaan dan keselamatan
`;

export class GeminiService {
    constructor() {
        const apiKey = import.meta.env.VITE_HF_TOKEN;
        this.modelName = import.meta.env.VITE_HF_MODEL || 'google/gemma-4-31B-it:novita';
        this.isConfigured = !!apiKey;
        this.websiteDataUrl = '/data/component-details.json';
        this.cachedKnowledge = null;
        this.knowledgePromise = null;

        if (this.isConfigured) {
            this.client = new InferenceClient(apiKey);
        } else {
            console.warn('Hugging Face token missing in .env');
        }
    }

    async loadWebsiteKnowledge() {
        if (this.cachedKnowledge) return this.cachedKnowledge;
        if (this.knowledgePromise) return this.knowledgePromise;

        this.knowledgePromise = fetch(this.websiteDataUrl)
            .then((response) => {
                if (!response.ok) throw new Error(`Knowledge fetch failed: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                const parts = data
                    .filter((item) => item['Part Name'])
                    .map((item) => {
                        const partName = item['Part Name'];
                        const issues = (item['Part Function'] || []).join(' / ') || item['Part Common Issue (Seperate by /)'] || 'Tiada isu dinyatakan';
                        const prevention = (item['Part Types'] || []).join(' / ') || item['Part Prevention Method (Seperate by /)'] || 'Tiada jenis dinyatakan';
                        const details = item['Part Details'] || 'Tiada maklumat tambahan';

                        return `- ${partName}
  Butiran: ${details}
  Isu biasa: ${issues}
  Pencegahan: ${prevention}`;
                    })
                    .join('\n');

                this.cachedKnowledge = parts || 'Tiada data komponen berjaya dimuatkan.';
                return this.cachedKnowledge;
            })
            .catch((error) => {
                console.warn('Website knowledge fallback in use:', error);
                this.cachedKnowledge = 'Data komponen langsung dari laman tidak tersedia sekarang. Guna pengetahuan laman terbina dalam sahaja.';
                return this.cachedKnowledge;
            })
            .finally(() => {
                this.knowledgePromise = null;
            });

        return this.knowledgePromise;
    }

    buildSystemPrompt(dynamicKnowledge) {
        return `
You are AC Auto Care AI Mechanic, an automotive assistant for this website.
Use the website knowledge below as your primary source of truth and stay focused on car air conditioning diagnostics.

Core website knowledge:
${WEBSITE_KNOWLEDGE_BASE}

Live website component knowledge:
${dynamicKnowledge}

Behavior rules:
- Answer in the same language as the user's question when possible.
- If the question is about this website's aircond content, answer from the website knowledge first.
- If the answer is not fully covered by the website knowledge, make a careful practical inference and say it is a general mechanic suggestion.
- Keep answers concise, helpful, and structured.
- Prioritize troubleshooting steps, symptoms, likely causes, and safe next actions.
- Do not invent features or website content that are not in the knowledge base.
        `.trim();
    }

    async createChatCompletion(userText) {
        if (!this.isConfigured) {
            return 'API token missing. Add `VITE_HF_TOKEN` in the `.env` file.';
        }

        try {
            const dynamicKnowledge = await this.loadWebsiteKnowledge();
            const chatCompletion = await this.client.chatCompletion({
                model: this.modelName,
                messages: [
                    {
                        role: 'system',
                        content: this.buildSystemPrompt(dynamicKnowledge)
                    },
                    {
                        role: 'user',
                        content: userText
                    }
                ],
                max_tokens: 700,
                temperature: 0.4
            });

            return chatCompletion.choices?.[0]?.message?.content || 'No response returned.';
        } catch (error) {
            console.error('Hugging Face Error:', error);
            return 'Sorry, the AI assistant could not reach Hugging Face right now.';
        }
    }

    async askQuestion(query) {
        const prompt = `
User question: ${query}

Please answer as the AC Auto Care AI assistant. If relevant, connect the answer to the website's troubleshooting guide, aircond circuit references, or known aircond component issues.
        `.trim();

        return this.createChatCompletion(prompt);
    }

    async diagnosePart(partName, partContext) {
        const prompt = `
Part name: ${partName}
Known part context: ${partContext}

Provide:
1. What this part does.
2. Likely symptoms of failure.
3. Checks the user or technician should perform.
4. Prevention or maintenance tips.

Use concise bullet points.
        `.trim();

        return this.createChatCompletion(prompt);
    }
}
