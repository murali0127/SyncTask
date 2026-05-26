//DEFINE TOOLS

import { ToolCase } from "lucide-react"


const TOOLS = [
      {
            type: 'function',
            function: {
                  name: 'get_todos',
                  description: 'Fetches todos for current user. ALWAYS call this before update or delete. Returns id, title, priority, completed, due_date, lisT_id.',
                  parameters: {
                        type: 'object',
                        properties: {
                              list_id: {
                                    type: 'number',
                                    description: 'Filter by list_id. Pass this when user mentions a specific list.'
                              },
                              completed: {
                                    type: 'boolean',
                                    description: 'Filter by complition status (optional).'
                              }
                        }
                  }
            }
      },
      {
            type: 'funtion',
            function: {
                  name: 'get_lists',
                  description: 'Fetch all list for the user. Returns id, list_title, color, icon. Call this when user mention a list by name so you resolve its numeric id before creating a todo.',
                  parameters: {
                        type: 'object',
                        properties: {}
                  }
            }
      },
      {
            type: "function",
            function: {
                  name: "create_todo",
                  description: "Create a new todo. list_id is REQUIRED — call get_lists first to resolve the id from a list name. Never guess an id.",
                  parameters: {
                        type: "object",
                        properties: {
                              title: {
                                    type: "string",
                                    description: "Short, action-oriented task title."
                              },
                              description: {
                                    type: "string",
                                    description: "Optional additional detail."
                              },
                              list_id: {
                                    type: "number",
                                    description: "Numeric id of the list this todo belongs to."
                              },
                              priority: {
                                    type: "string",
                                    enum: ["low", "medium", "high"],
                                    description: "Priority. Infer from language: urgent/ASAP/critical=high, whenever/someday=low, default/Not specified=medium."
                              },
                              due_date: {
                                    type: "string",
                                    description: "ISO 8601 datetime. Infer: tomorrow=next day, next week=+7 days, Friday=nearest Friday, default/not specified=next day."
                              },
                              reminder_minutes_before: {
                                    type: "number",
                                    description: "Minutes before due_date to send reminder. Optional."
                              }
                        },
                        required: ["title", "list_id"]
                  }
            }
      },
      {
            type: "function",
            function: {
                  name: "update_todo",
                  description: "Update any field on a todo. ALWAYS call get_todos first to get the real UUID. Do not guess ids.",
                  parameters: {
                        type: "object",
                        properties: {
                              id: {
                                    type: "string",
                                    description: "UUID of the todo to update."
                              },
                              title: { type: "string" },
                              description: { type: "string" },
                              completed: { type: "boolean" },
                              priority: { type: "string", enum: ["low", "medium", "high"] },
                              due_date: { type: "string" },
                              list_id: { type: "number" }
                        },
                        required: ["id"]
                  }
            }
      },
      {
            type: "function",
            function: {
                  name: "delete_todo",
                  description: "Permanently delete a todo. ALWAYS call get_todos first to confirm the correct UUID. Tell the user what you are about to delete before doing it.",
                  parameters: {
                        type: "object",
                        properties: {
                              id: {
                                    type: "string",
                                    description: "UUID of the todo to delete."
                              }
                        },
                        required: ["id"]
                  }
            }
      },
      {
            type: "function",
            function: {
                  name: "create_list",
                  description: "Create a new task list. Assign a sensible emoji icon and a hex color.",
                  parameters: {
                        type: "object",
                        properties: {
                              list_title: { type: "string" },
                              color: { type: "string", description: "Hex color e.g. #6366f1" },
                              icon: { type: "string", description: "Single emoji e.g. 🛒" },
                              list_description: { type: "string", description: "Optional description." }
                        },
                        required: ["list_title"]
                  }
            }
      },
      {
            type: "function",
            function: {
                  name: "delete_list",
                  description: "Delete a list and all todos in it. Call get_lists first to confirm the correct id. This is irreversible.",
                  parameters: {
                        type: "object",
                        properties: {
                              id: {
                                    type: "number",
                                    description: "Numeric id of the list."
                              }
                        },
                        required: ["id"]
                  }
            }
      }


]

export default TOOLS;