import Groq from "groq-sdk";

const SYSTEM_PROMPT = `
You are an AI assistant inside a task management (To-Do) application.

Your job is to:
- Help users manage tasks efficiently
- Suggest priorities, scheduling, and improvements
- Keep responses short and actionable

Rules:
- Always respond in 2-5 lines max only if the user not specify anything about the content detail.
- Prefer bullet points over paragraphs
- Do NOT give long explanations unless explicitly asked
- Focus only on productivity and task management
- If user asks general knowledge, answer briefly and relate it back to productivity if possible
- If unclear, ask a short clarifying question

Tone:
- Clear
- Direct
- Practical
- No fluff, sugarcoat or halucination
`;

// It automatically looks for process.env.GROQ_API_KEY
const groq = new Groq({
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: true
});
async function main(input) {
      const response = await groq.chat.completions.create({

            model: "llama-3.3-70b-versatile",
            messages: [{
                  role: "system",
                  content: SYSTEM_PROMPT
            },
            {
                  role: 'user',
                  content: input
            }]
      })
      return response.choices[0].message.content
}

export default main;     