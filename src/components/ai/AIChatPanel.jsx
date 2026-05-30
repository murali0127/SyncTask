import { useState, useRef, useEffect, useCallback } from "react";
import clsx from "clsx";
import ReactMarkdown from "react-markdown";
import NavBarAvatar from "../ui/NavBarAvatar";
import { Brain } from "lucide-react";
import "./aiChatPanel.css";
import { useAI } from "../../lib/context/AiContext";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

function AiAvatar() {
      return (
            <div
                  style={{
                        width: "25px",
                        height: "25px",
                        borderRadius: "50%",
                        background: "#31363F",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontFamily: "'Syne', sans-serif",
                        color: "#C84B31",
                        animation: "aiAvatarPulse 3.5s ease-in-out infinite",
                        flexShrink: 0,
                  }}
            >
                  <Brain size={20} />
            </div>
      );
}

export default function AIChatPanel({ isOpen, onClose }) {
      const { messages, loading, error, sendMessage } = useAI();

      const [inputValue, setInputValue] = useState("");
      const [showPicker, setShowPicker] = useState(false);

      const messagesEndRef = useRef(null);

      const scrollToBottom = useCallback(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, []);

      useEffect(() => {
            scrollToBottom();
      }, [messages, loading, scrollToBottom]);

      const handleSend = useCallback(async () => {
            const text = inputValue.trim();
            if (!text || loading) return;

            setInputValue("");
            setShowPicker(false);
            await sendMessage(text);
      }, [inputValue, loading, sendMessage]);

      const handleKeyDown = useCallback(
            (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                  }
            },
            [handleSend]
      );

      const handleEmojiSelect = useCallback((emoji) => {
            setInputValue((prev) => prev + (emoji?.native || ""));
            setShowPicker(false);
      }, []);

      return (
            <div
                  className={clsx(
                        "font-inter fixed right-0 font-mogra top-0 h-full w-100 bg-neutral-950 border-l border-neutral-800 gap-4",
                        "flex flex-col z-50 transition-transform duration-300 ease-out",
                        isOpen ? "translate-x-0" : "translate-x-full"
                  )}
            >
                  <div className="flex gap-2 items-center justify-between px-4 h-14 border-b border-neutral-800 flex-shrink-0">
                        <div className="flex items-center gap-2">
                              <i className="bi bi-openai text-lg text-neutral-400"></i>
                              <span className="text-sm font-inter font-medium text-white">AI Assistant</span>
                        </div>

                        <button
                              onClick={onClose}
                              className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
                        >
                              <i className="bi bi-x-lg text-base"></i>
                        </button>
                  </div>

                  <div className="flex-1 overflow-y-auto px-4 space-y-4">
                        {messages.map((message) => (
                              <div
                                    key={message.id}
                                    className={clsx(
                                          "flex items-end gap-2.5",
                                          message.role === "user" ? "justify-end" : "justify-start"
                                    )}
                              >
                                    {message.role !== "user" && (
                                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs">
                                                <AiAvatar />
                                          </div>
                                    )}

                                    <div
                                          className={clsx(
                                                "max-w-[75%] h-fit px-4 py-2.5 rounded-xl text-sm leading-relaxed",
                                                message.role === "user"
                                                      ? "bg-red-950/70 text-red-100 rounded-br-none border border-red-900/40"
                                                      : "text-red-200 bg-neutral-800 text-neutral-200 rounded-bl-none border border-neutral-700"
                                          )}
                                    >
                                          <ReactMarkdown>{String(message.content ?? "")}</ReactMarkdown>
                                    </div>

                                    {message.role === "user" && (
                                          <div className="flex-shrink-0">
                                                <NavBarAvatar size="sm" />
                                          </div>
                                    )}
                              </div>
                        ))}

                        {loading && (
                              <div className="flex justify-start gap-2">
                                    <div className="flex-shrink-0 mt-2">
                                          <AiAvatar />
                                    </div>
                                    <div className="loading-box bg-neutral-800 border border-neutral-700 px-4 py-3 rounded-2xl rounded-bl-md">
                                          <div className="flex gap-2">
                                                <span
                                                      className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"
                                                      style={{ animationDelay: "0ms" }}
                                                />
                                                <span
                                                      className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"
                                                      style={{ animationDelay: "150ms" }}
                                                />
                                                <span
                                                      className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"
                                                      style={{ animationDelay: "300ms" }}
                                                />
                                          </div>
                                    </div>
                              </div>
                        )}

                        <div ref={messagesEndRef} />
                  </div>

                  <div className="p-4 border-t border-neutral-800 flex-shrink-0">
                        {/* {error ? (
                              <p className="text-xs text-red-400 mb-2">{error}</p>
                        ) : null} */}

                        <div className="flex gap-2">
                              <textarea
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask anything..."
                                    className="max-h-10 flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-4 text-sm text-slate-200 placeholder-neutral-500 outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all"
                              />

                              <div className="emoji-picker-wrapper">
                                    <button
                                          type="button"
                                          className="emoji-trigger-btn"
                                          onClick={() => setShowPicker((prev) => !prev)}
                                    >
                                          <i className="bi bi-emoji-laughing-fill"></i>
                                    </button>

                                    {showPicker && (
                                          <div className="emoji-picker">
                                                <Picker
                                                      data={data}
                                                      theme="dark"
                                                      set="default"
                                                      previewPosition="none"
                                                      skinTonePosition="none"
                                                      perLine={8}
                                                      maxFrequentRows={2}
                                                      onEmojiSelect={handleEmojiSelect}
                                                />
                                          </div>
                                    )}
                              </div>

                              <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || loading}
                                    className="px-2 rounded-xl border border-neutral-700 text-neutral-400 bg-neutral-800 hover:bg-neutral-600 hover:text-neutral-50 transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                    <i className="bi bi-send"></i>
                              </button>
                        </div>

                        <p className="text-xs text-neutral-600 mt-2 text-center">
                              AI responses may not always be accurate
                        </p>
                  </div>
            </div>
      );
}
