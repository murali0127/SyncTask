import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import Button from '../ui/Button';
import main from '../../lib/functions/groq-sdk';
import ReactMarkdown from 'react-markdown';
import { Toaster } from 'react-hot-toast';

const DEFAULT_PROMPTS = [
      //PLANNING
      "Prioritize my tasks for today",
      "Help me plan my day efficiently",
      "Which tasks should I do first?",
      "Organize my tasks by urgency and importance",
      //PRODUCTION OPTIMZATION
      "How can I complete my tasks faster?",
      "Suggest a better workflow for my tasks",
      "How do I avoid procrastination today?",
      "Give me productivity tips based on my tasks",
      //TIME & SCHEDULE
      "Create a schedule for my tasks today",
      "Estimate how long my tasks will take",
      "Split my tasks into a 2-hour work plan",
      "Plan my week based on my tasks",
      //SMART ASSISTANT
      "What am I missing in my task list?",
      "Suggest improvements for my tasks",
      "Are any of my tasks unrealistic?",
      "Help me simplify my task list",
      //MOTIVATION & RECOVERY
      "I feel overwhelmed, what should I do first?",
      "Help me restart my productivity today",
      "Motivate me to finish my tasks",
      "What’s the easiest task I can start with?"

];

export default function AIChatPanel({ isOpen, onClose }) {
      const [messages, setMessages] = useState([
            { id: 1, role: 'ai', content: "Hi! I'm your AI assistant. How can I help you manage your tasks today?" }
      ]);
      const [inputValue, setInputValue] = useState('');
      const [isTyping, setIsTyping] = useState(false);
      const messagesEndRef = useRef(null);

      const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      };

      useEffect(() => {
            scrollToBottom();
      }, [messages]);

      const handleSend = () => {
            if (!inputValue.trim()) return;

            const userMessage = {
                  id: Date.now(),
                  role: 'user',
                  content: inputValue.trim()
            };

            setMessages(prev => [...prev, userMessage]);
            setInputValue('');
            setIsTyping(true);

            setTimeout(async () => {
                  const responseContent = await main(userMessage.content);
                  const aiResponse = {
                        id: Date.now() + 1,
                        role: 'ai',
                        content: responseContent
                  };
                  setMessages(prev => [...prev, aiResponse]);
                  setIsTyping(false);
            }, 1000);
      };

      const handleKeyDown = (e) => {
            if (e.key === 'Enter' && !e.shiftkey) {
                  e.preventDefault();
                  handleSend();
            }
      };

      return (
            <div
                  className={clsx(
                        'fixed right-0 top-0 h-full w-100 bg-neutral-950 border-l border-neutral-800 gap-4',
                        'flex flex-col z-50 transition-transform duration-300 ease-out',
                        isOpen ? 'translate-x-0' : 'translate-x-full'
                  )}
            >

                  <div className="flex gap-2 items-center justify-between px-4 h-14 border-b border-neutral-800 flex-shrink-0">
                        <div className="flex items-center gap-2">
                              <i className="bi bi-openai text-lg text-neutral-400"></i>
                              <span className="text-sm font-medium text-white">AI Assistant</span>
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
                                          'flex',
                                          message.role === 'user' ? 'justify-end' : 'justify-start'
                                    )}
                              >
                                    <div
                                          className={clsx(
                                                'max-w-[75%] h-fit px-4 py-2.5 rounded-lg text-sm leading-relaxed',
                                                message.role === 'user'
                                                      ? 'bg-red-900 text-white rounded-br-sm'
                                                      : 'bg-neutral-800 text-neutral-200 rounded-bl-md border border-neutral-700'
                                          )}
                                    >
                                          <ReactMarkdown>
                                                {message.content}

                                          </ReactMarkdown>
                                    </div>
                              </div>
                        ))}

                        {isTyping && (
                              <div className="flex justify-start">
                                    <div className="bg-neutral-800 border border-neutral-700 px-4 py-3 rounded-2xl rounded-bl-md">
                                          <div className="flex gap-2">
                                                <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                          </div>
                                    </div>
                              </div>
                        )}
                        <div ref={messagesEndRef} />
                  </div>

                  <div className="p-4 border-t border-neutral-800 flex-shrink-0">
                        <div className="flex gap-2">
                              <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask anything..."
                                    className="h-7 flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all"
                              />
                              <Button
                                    variant="default"
                                    size="md"
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || isTyping}
                                    className="!px-3"
                              >
                                    <i className="bi bi-send"></i>
                              </Button>
                        </div>
                        <p className="text-xs text-neutral-600 mt-2 text-center">
                              AI responses may not always be accurate
                        </p>
                  </div>
            </div>
      );
}
