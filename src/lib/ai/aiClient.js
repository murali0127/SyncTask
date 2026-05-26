// GROK-SDK
import Groq from "groq-sdk";
// import { supabase } from "../supabase-client.jsx";
import executeTool from './toolExecuter.js';
import TOOLS from './tools.js'
import { Reply } from "lucide-react";




// It automatically looks for process.env.GROQ_API_KEY
const groq = new Groq({
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: true
});

//Build System Promts for more optimzed workflow
function buildSystemPrompt(userId) {
      return `You are an intelligent task management assistent embedded inside SyncTask(A AI-Assisted Task Manager Platform, which automated Human Tasks). 
      Today : ${new Date().toISOString().split('T')[0]}. User id : ${userId}
     
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
      
      ABOUT YOU            
      Your job is to:
      - Help users create, update, delete, and manage tasks and task lists efficiently
      - Suggest priorities, scheduling, and improvements
      - Keep responses short and actionable
      - delete tasks and task, list if user asks you to, with user permission.
      
      Rules:
      - Always respond in 2-5 lines max only if the user not specify anything about the content detail.
      - Prefer bullet points over paragraphs
      - Do NOT give long explanations unless explicitly asked
      - Focus only on productivity and task management
      - If user asks general knowledge, answer briefly and relate it back to productivity if possible
      - If unclear, ask a short clarifying question
      
      Tone:
      - Clear
      - professional
      - Direct
      - Practical
      - No fluff, sugarcoat or halucination`;
}

const MAX_ITERATION = 8; //Prevents tool-use loop

async function main({ message, history = [], supabase, userId }) {
      if (!userId) throw new Error("User not Authenticated");
      const messages = [
            ...history,
            { role: "user", content: message },
      ]

      let finalResponse = null;

      for (let i = 0; i <= MAX_ITERATION; i++) {

            const response = await groq.chat.completions.create({
                  model: "openai/gpt-oss-120b",
                  messages: [{
                        role: "system",
                        content: buildSystemPrompt(userId)
                  },
                  ...messages //user message
                  ],
                  tools: TOOLS,
                  tool_choice: "auto",
                  temperature: 0.2,  //This 0.2 Lower Temperature Value make it Determinitic
            })
      }
      const choice = response.choices[0];
      const assistantMessage = choice.message;

      console.log(choice);
      // if (choice.finish_reason === "stop" || !assistantMessage.tool_calls?.length) {
      //       finalResponse = assistantMessage.content || "Done.";
      //       messages.push({ role: "assistant", content: finalResponse });
      //       break;
      // }
      messages.push(assistantMessage);

      const toolResults = [];

      for (const toolCall of assistantMessage.tool_calls) {
            let toolInput;
            try {
                  toolInput = JSON.parse(toolCall.function.arguments)
            } catch {
                  toolInput = {};
            }

            // Executes Tools
            const result = await executeTool(
                  toolCall.function.name,
                  toolInput,
                  supabase,
                  userId
            )
            toolResults.push({
                  role: "tool",
                  tool_call_id: toolCall.id,
                  content: JSON.stringify(result)
            });
      }
      messages.push(...toolResults);

      if (!finalResponse) {
            finalResponse = "I completed the action but had trouble generating a summary.";
      }

      return {
            reply: finalResponse,
            history: messages
      };
}

export default main;     