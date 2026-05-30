// src/lib/ai/aiClient.js
import Groq from "groq-sdk";
import executeTool from './toolExecuter.js';
import TOOLS from './tools.js';

const groq = new Groq({
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: true
});

function buildSystemPrompt(userId) {
      return `You are an intelligent task management assistant embedded inside SyncTask (an AI-Assisted Task Manager Platform).
      Today: ${new Date().toISOString().split('T')[0]}. User ID: ${userId}

      STRICT OPERATING RULES:
      1. Before ANY update or delete, ALWAYS call get_todos or get_lists first to get real IDs.
      2. When user mentions a list by name (e.g. "my Shopping list"), call get_lists, match by list_title, use the numeric id.
      3. NEVER guess or fabricate an id. If you cannot find it, tell the user clearly.
      4. Infer priority from natural language:
            - "urgent", "ASAP", "critical", "important" → high
            - "whenever", "someday", "low priority" → low
            - default → medium
      5. Infer due dates intelligently:
            - "tomorrow" → next calendar day at 09:00
            - "next week" → +7 days
            - "Friday" → nearest upcoming Friday
            - "end of month" → last day of current month
      6. Respond in plain conversational text. No markdown. No bullet lists unless user asks.
      7. Keep confirmations brief: "Done — added 'Buy milk' to Shopping (high priority, due tomorrow)."
      8. For delete operations: always confirm what you found before deleting.
      9. If the user asks something unrelated to task management, answer briefly and bring focus back.
10.Fi the user specifies you to create a new to-do or new List, please ensure the user that you have all the information specified in the schema to create a to_do or list.
      Your job is to help users create, update, delete, and manage tasks and task lists efficiently.
      Keep responses short and actionable. Do NOT give long explanations unless explicitly asked.`;
}

const MAX_ITERATIONS = 8;

export async function main({ message, history = [], supabase, userId }) {
      if (!userId) throw new Error("User not authenticated");

      // Build the running message list for this turn
      const messages = [
            ...history,
            { role: "user", content: message },
      ];

      let finalResponse = null;

      for (let i = 0; i < MAX_ITERATIONS; i++) {
            const response = await groq.chat.completions.create({
                  model: "llama-3.3-70b-versatile", // ← use a real Groq model
                  messages: [
                        { role: "system", content: buildSystemPrompt(userId) },
                        ...messages,
                  ],
                  tools: TOOLS,
                  tool_choice: "auto",
                  temperature: 0.2,
            });

            const choice = response.choices[0];
            const assistantMessage = choice.message;

            // ── STOP: model is done ──────────────────────────────────────────
            if (
                  choice.finish_reason === "stop" ||
                  !assistantMessage.tool_calls?.length
            ) {
                  finalResponse = assistantMessage.content || "Done.";
                  messages.push({ role: "assistant", content: finalResponse });
                  break;
            }

            // ── CONTINUE: model wants to call tools ─────────────────────────
            messages.push(assistantMessage); // push the assistant's tool-call message

            const toolResults = [];

            for (const toolCall of assistantMessage.tool_calls) {
                  let toolInput;
                  try {
                        toolInput = JSON.parse(toolCall.function.arguments);
                  } catch {
                        toolInput = {};
                  }

                  const result = await executeTool(
                        toolCall.function.name,
                        toolInput,
                        supabase,
                        userId
                  );

                  toolResults.push({
                        role: "tool",
                        tool_call_id: toolCall.id,
                        content: JSON.stringify(result),
                  });
            }

            messages.push(...toolResults); // feed results back for next iteration
      }

      if (!finalResponse) {
            finalResponse = "I completed the action but had trouble generating a summary.";
      }

      return {
            reply: finalResponse,
            history: messages,
      };
}

export default main;