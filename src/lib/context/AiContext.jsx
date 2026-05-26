// Context that owns all AI satate
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../supabase-client";
import { useAuth } from "./AuthContext";
import main from "../ai/aiClient";

const AiContext = createContext(null);



export default function AiProvider({ children }) {
      const { user } = useAuth();
      const [messages, setMessages] = useState([
            {
                  id: 'init',
                  role: 'assistant',
                  content: `Hey ${user?.user_metadata?.name?.split("")[0] || "there"}. I am your Task assistent, I can create, update, and delete your tasks and lists. Just tell me what you need.`
            }
      ]);

      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      const historyRef = useRef([]);

      const sendMessage = useCallback(async (txt) => {
            if (!txt?.trim() || loading) return;

            //Add User message to the State
            const userMsgId = crypto.randomUUID();
            setMessages((prev) => [
                  ...prev,
                  { id: userMsgId, role: 'user', content: txt }
            ]);
            setLoading(true);
            setError(null);

            try {
                  //Run Against Agent
                  const userId = user?.id;

                  const { reply, history: updatedHistory } = await main({
                        message: txt,
                        history: historyRef.current,
                        supabase,
                        userId
                  });

                  //Update History from main function
                  historyRef.current = updatedHistory;

                  //Add Ai Reply
                  setMessages((prev) => [
                        ...prev,
                        { id: crypto.randomUUID(), role: 'assistant', content: reply }
                  ]);
            } catch (error) {
                  const errorMessage = error?.message || 'Something went wrong!. Try again after some time.';
                  setError(errorMessage);
            } finally {
                  setLoading(false); // After Executions
            }
      }, [loading, user?.id]);

      const clearHistory = useCallback(() => {
            historyRef.current = [];
            setMessages([
                  {
                        id: 'init',
                        role: 'assistant',
                        content: 'Converation cleared.'
                  }
            ]);
            setError(null);
      }, []);

      const value = {
            messages,
            loading,
            error,
            sendMessage,
            clearHistory
      }
      return (
            <AiContext.Provider value={value}>
                  {children}
            </AiContext.Provider>
      );
}

export function useAI() {
      const ctx = useContext(AiContext);
      if (!ctx) throw new Error("userAI Context must be used inside <AiProvider>");
      return ctx;
}
