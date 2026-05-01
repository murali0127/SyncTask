import Groq from "groq-sdk";
import { supabase } from "../supabase-client.jsx";

const SYSTEM_PROMPT = `
You are an AI assistant inside a task management (To-Do) application.

Your job is to:
- Help users create, update, delete, and manage tasks and task lists efficiently
- Suggest priorities, scheduling, and improvements
- Keep responses short and actionable
- create tasks and list if user needs you to do.
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
- No fluff, sugarcoat or halucination
`;


const tools = [
      {
            name: "get_todos",
            description: "Fetch all todos for the current user, optionally filtered by list_id or completed status.",
            input_schema: {
                  type: "object",
                  properties: {
                        list_id: { type: "number", description: "Filter by list ID" },
                        completed: { type: "boolean", description: "Filter by completion status" }
                  }
            }
      },
      {
            name: "create_todo",
            description: "Create a new todo task for the user.",
            input_schema: {
                  type: "object",
                  properties: {
                        title: { type: "string", description: "Task title" },
                        description: { type: "string", description: "Optional description" },
                        list_id: { type: "number", description: "Which list to add it to" },
                        priority: {
                              type: "array",
                              items: { type: "string", enum: ["low", "medium", "high"] },
                              description: "Priority level"
                        },
                        due_date: { type: "string", description: "ISO 8601 datetime string" }
                  },
                  required: ["title"]
            }
      },
      {
            name: "update_todo",
            description: "Update an existing todo. Can mark complete, change title, priority, due date, etc.",
            input_schema: {
                  type: "object",
                  properties: {
                        id: { type: "string", description: "UUID of the todo to update" },
                        title: { type: "string" },
                        description: { type: "string" },
                        completed: { type: "boolean" },
                        priority: { type: "array", items: { type: "string" } },
                        due_date: { type: "string" },
                        list_id: { type: "number" }
                  },
                  required: ["id"]
            }
      },
      {
            name: "delete_todo",
            description: "Permanently delete a todo by ID.",
            input_schema: {
                  type: "object",
                  properties: {
                        id: { type: "string", description: "UUID of the todo to delete" }
                  },
                  required: ["id"]
            }
      },
      {
            name: "get_lists",
            description: "Get all lists for the current user.",
            input_schema: { type: "object", properties: {} }
      },
      {
            name: "create_list",
            description: "Create a new list/category for organizing todos.",
            input_schema: {
                  type: "object",
                  properties: {
                        list_title: { type: "string" },
                        color: { type: "string", description: "Hex color like #ff5733" }
                  },
                  required: ["list_title"]
            }
      },
      {
            name: "delete_list",
            description: "Delete a list by ID. Todos in this list will also be deleted (cascades).",
            input_schema: {
                  type: "object",
                  properties: {
                        id: { type: "number" }
                  },
                  required: ["id"]
            }
      }
];


async function executeTools(
      toolName,
      toolInput,
      supabase,
      userId
) {
      switch (toolName) {
            case "get_todos": {
                  let query = supabase.from("todos").select("*").eq("user_id", userId);
                  if (toolInput.list_id) query = query.eq("list_id", toolInput.list_id);
                  if (toolInput.completed !== undefined) query = query.eq("completed", toolInput.completed);
                  const { data, error } = await query;
                  return error ? { error: error.message } : { todos: data };
            }
            case "create_todo": {
                  const { data, error } = await supabase
                        .from("todos")
                        .insert({ ...toolInput, user_id: userId })
                        .select()
                        .single();
                  return error ? { error: error.message } : { created: data };
            }
            case "delete_todo": {
                  const { error } = await supabase
                        .from("todos")
                        .delete()
                        .eq("id", toolInput.id)
                        .eq("user_id", userId);
                  return error ? { error: error.message } : { deleted: true, id: toolInput.id };
            }
            case "get_lists": {
                  const { data, error } = await supabase
                        .from("list")
                        .select("*")
                        .eq("user_id", userId);
                  return error ? { error: error.message } : { lists: data };
            }
            case "create_list": {
                  const { data, error } = await supabase
                        .from("list")
                        .insert({ ...toolInput, user_id: userId })
                        .select()
                        .single();
                  return error ? { error: error.message } : { created: data };
            }
            case "delete_list": {
                  const { error } = await supabase
                        .from("list")
                        .delete()
                        .eq("id", toolInput.id)
                        .eq("user_id", userId);
                  return error ? { error: error.message } : { deleted: true, id: toolInput.id };
            }
            default:
                  return { error: `Unknown tool : ${toolName}` }
      }

}
// It automatically looks for process.env.GROQ_API_KEY
const groq = new Groq({
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: true
});
async function main(input) {
      const response = await groq.chat.completions.create({

            model: "openai/gpt-oss-120b",
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