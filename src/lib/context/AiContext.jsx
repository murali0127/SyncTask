import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../supabase-client";
import { useAuth } from "./AuthContext";
import main from "../ai/aiClient";

const AiContext = createContext(null);

function getGreetingName(user) {
      const fullName = user?.user_metadata?.name?.trim();
      if (!fullName) return "there";
      return fullName.split(/\s+/)[0] || "there";
}

function buildInitialMessage(user) {
      return {
            id: "init",
            role: "assistant",
            content: `Hey ${getGreetingName(user)}. I am your task assistant. I can create, update, and delete your tasks and lists. Just tell me what you need.`,
      };
}

export default function AiProvider({ children }) {
      const { user, profile } = useAuth();

      const [messages, setMessages] = useState(() => [buildInitialMessage(user)]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      const historyRef = useRef([]);
      const loadingRef = useRef(false);

      useEffect(() => {
            loadingRef.current = loading;
      }, [loading]);

      useEffect(() => {
            // Keep the greeting in sync if the user becomes available after the initial render.
            setMessages((prev) => {
                  if (prev.length === 1 && prev[0]?.id === "init") {
                        return [buildInitialMessage(user)];
                  }
                  return prev;
            });
      }, [user]);

      const sendMessage = useCallback(
            async (txt) => {
                  const messageText = typeof txt === "string" ? txt.trim() : "";
                  if (!messageText || loadingRef.current) return;

                  const userMsgId = crypto.randomUUID();
                  setMessages((prev) => [...prev, { id: userMsgId, role: "user", content: messageText }]);

                  setLoading(true);
                  loadingRef.current = true;
                  setError(null);

                  try {
                        const userId = user?.id;

                        const { reply, history: updatedHistory } = await main({
                              message: messageText,
                              history: Array.isArray(historyRef.current) ? historyRef.current : [],
                              supabase,
                              userId,
                        });

                        historyRef.current = Array.isArray(updatedHistory) ? updatedHistory : [];

                        setMessages((prev) => [
                              ...prev,
                              {
                                    id: crypto.randomUUID(),
                                    role: "assistant",
                                    content: typeof reply === "string" && reply.trim() ? reply : "I could not generate a response.",
                              },
                        ]);
                  } catch (err) {
                        const errorMessage =
                              err?.message || "Something went wrong. Try again after some time.";
                        setError(errorMessage);
                        console.error("AI request failed:", err);
                  } finally {
                        setLoading(false);
                        loadingRef.current = false;
                  }
            },
            [user?.id]
      );

      const clearHistory = useCallback(() => {
            historyRef.current = [];
            setMessages([buildInitialMessage(user)]);
            setError(null);
      }, [user]);

      const value = {
            messages,
            loading,
            error,
            sendMessage,
            clearHistory,
      };

      return <AiContext.Provider value={value}>{children}</AiContext.Provider>;
}

export function useAI() {
      const ctx = useContext(AiContext);
      if (!ctx) throw new Error("useAI must be used inside <AiProvider>");
      return ctx;
}
