import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import Button from '../ui/Button';
import main from '../../lib/functions/groq-sdk';
import ReactMarkdown from 'react-markdown';
import { Toaster } from 'react-hot-toast';
import NavBarAvatar from '../ui/NavBarAvatar';
import { Brain } from 'lucide-react';
import "./aiChatPanel.css"
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

function AiAvatar() {
      const randomColor = () => {
            const r = math.floor(Math.random() * 255) + 1;
            const g = math.floor(Math.random() * 255) + 1;
            const b = math.floor(Math.random() * 255) + 1;
            return `rgb(${r},${g},${b})`
      }

      return (
            <div
                  style={{
                        width: "25px",
                        height: "25px",
                        borderRadius: "50%",
                        // background: "linear-gradient(135deg,rgba(139,0,0,0.4),rgba(220,38,38,0.25))",
                        background: "#31363F",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        // fontSize: size * 0.42,
                        fontWeight: 700,
                        fontFamily: "'Syne', sans-serif",
                        color: "#C84B31",
                        animation: "aiAvatarPulse 3.5s ease-in-out infinite ",
                        flexShrink: 0,
                  }}
            >
                  <Brain size={"20px"} />
            </div>
      );
}


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
                        'fixed right-0 font-mogra top-0 h-full w-100 bg-neutral-950 border-l border-neutral-800 gap-4',
                        'flex flex-col z-50 transition-transform duration-300 ease-out',
                        isOpen ? 'translate-x-0' : 'translate-x-full'
                  )}
            >

                  <div className="flex gap-2 items-center justify-between px-4 h-14 border-b border-neutral-800 flex-shrink-0">
                        <div className="flex items-center gap-2">
                              <i className="bi bi-openai text-lg text-neutral-400"></i>
                              <span className="text-sm font-inter       font-medium text-white">AI Assistant</span>
                        </div>
                        <button
                              onClick={onClose}
                              className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
                        >
                              <i className="bi bi-x-lg text-base"></i>
                        </button>
                  </div>

                  <div className="flex-1  overflow-y-auto px-4 space-y-4">
                        {messages.map((message) => (
                              <div
                                    key={message.id}
                                    className={clsx(
                                          'flex items-end gap-2.5', // Added items-end to align bottoms, and gap-2.5 for spacing
                                          message.role === 'user' ? 'justify-end' : 'justify-start'
                                    )}
                              >
                                    {message.role !== 'user' && (
                                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-800 border  border-neutral-700 flex items-center justify-center text-xs">
                                                {/* <Brain size="20px" width={"25px"} className='text-red-700/50' /> */}
                                                <AiAvatar />
                                          </div>
                                    )}
                                    <div
                                          className={clsx(
                                                'max-w-[75%] h-fit px-4 py-2.5 rounded-xl text-sm leading-relaxed', // Upgraded to rounded-xl for a softer look
                                                message.role === 'user'
                                                      ? 'bg-red-950/70 text-red-100 rounded-br-none border border-red-900/40' // Softened the harsh solid red to a sleek translucent dark red match
                                                      : 'text-red-200 bg-neutral-800 text-neutral-200 rounded-bl-none border border-neutral-700'
                                          )}
                                    >
                                          <ReactMarkdown>
                                                {message.content}
                                          </ReactMarkdown>
                                    </div>

                                    {/* User Avatar stays perfectly on the right side of the user bubble */}
                                    {message.role === 'user' && (
                                          <div className='flex-shrink-0'>
                                                <NavBarAvatar size="sm" />
                                          </div>
                                    )}
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
                                    className="h-8 flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all"
                              />
                              <button
                                    // variant="default"
                                    size="md"
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || isTyping}
                                    className="px-2 py-1 rounded-xl border border-neutral-700 text-neutral-400 bg-neutral-800 hover:bg-neutral-600 hover:text-white transition-all duration-100"
                              >
                                    <i className="bi bi-send"></i>
                              </ button>
                        </div>
                        <p className="text-xs text-neutral-600 mt-2 text-center">
                              AI responses may not always be accurate
                        </p>
                  </div>
            </div>
      );
}
