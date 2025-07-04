// // "use client";

// // import { useState, useRef, useEffect } from "react";
// // import { motion } from "framer-motion";
// // import { X, Send, Loader2, Bot, User } from "lucide-react";

// // export default function ChatBot({ onClose }) {
// //   const [messages, setMessages] = useState([
// //     {
// //       sender: "bot",
// //       text: "Hi! I'm your AI assistant. How can I help you today? 💬",
// //       loading: false,
// //       timestamp: new Date().toISOString(),
// //     },
// //   ]);
// //   const [input, setInput] = useState("");
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const messagesEndRef = useRef(null);

// //   // Auto-scroll to bottom when messages change
// //   useEffect(() => {
// //     scrollToBottom();
// //   }, [messages]);

// //   const scrollToBottom = () => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   };

// //   const handleSend = async () => {
// //     if (!input.trim() || isLoading) return;

// //     const userMsg = {
// //       sender: "user",
// //       text: input,
// //       loading: false,
// //       timestamp: new Date().toISOString(),
// //     };
// //     setMessages((prev) => [...prev, userMsg]);
// //     setInput("");
// //     setError(null);

// //     // Add temporary loading message
// //     setMessages((prev) => [
// //       ...prev,
// //       {
// //         sender: "bot",
// //         text: "",
// //         loading: true,
// //         timestamp: new Date().toISOString(),
// //       },
// //     ]);
// //     setIsLoading(true);

// //     try {
// //       const response = await fetch("/api/chat", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           prompt: input,
// //           history: messages
// //             .filter((msg) => !msg.loading)
// //             .map((msg) => ({
// //               role: msg.sender === "user" ? "user" : "assistant",
// //               content: msg.text,
// //             })),
// //         }),
// //       });

// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }

// //       const data = await response.json();
// //       const botReply = data.reply || "Sorry, I couldn't process your request.";

// //       // Replace loading message with actual response
// //       setMessages((prev) => [
// //         ...prev.slice(0, -1),
// //         {
// //           sender: "bot",
// //           text: botReply,
// //           loading: false,
// //           timestamp: new Date().toISOString(),
// //         },
// //       ]);
// //     } catch (error) {
// //       console.error("Error:", error);
// //       setError("Failed to get response. Please try again.");
// //       // Remove loading message on error
// //       setMessages((prev) => prev.slice(0, -1));
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleKeyPress = (e) => {
// //     if (e.key === "Enter" && !e.shiftKey) {
// //       e.preventDefault();
// //       handleSend();
// //     }
// //   };

// //   const formatTime = (timestamp) => {
// //     return new Date(timestamp).toLocaleTimeString([], {
// //       hour: "2-digit",
// //       minute: "2-digit",
// //     });
// //   };

// //   return (
// //     <motion.div
// //       initial={{ opacity: 0, y: 40 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       exit={{ opacity: 0, y: 40 }}
// //       className="fixed bottom-4 right-4 z-50 w-96 h-[600px] bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-xl rounded-xl flex flex-col"
// //     >
// //       {/* Header */}
// //       <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-xl">
// //         <div className="flex items-center gap-2">
// //           <Bot className="w-5 h-5" />
// //           <h3 className="font-bold">AI Assistant</h3>
// //         </div>
// //         <button
// //           onClick={onClose}
// //           className="hover:bg-white/10 p-1 rounded-full"
// //           aria-label="Close chat"
// //         >
// //           <X className="w-5 h-5" />
// //         </button>
// //       </div>

// //       {/* Chat messages */}
// //       <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
// //         {messages.map((msg, i) => (
// //           <div
// //             key={`${msg.timestamp}-${i}`}
// //             className={`flex flex-col ${
// //               msg.sender === "bot" ? "items-start" : "items-end"
// //             }`}
// //           >
// //             <div
// //               className={`flex items-start gap-2 p-3 rounded-lg max-w-[85%] ${
// //                 msg.sender === "bot"
// //                   ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
// //                   : "bg-purple-500 text-white"
// //               }`}
// //             >
// //               {msg.sender === "bot" ? (
// //                 <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
// //               ) : (
// //                 <User className="w-4 h-4 mt-1 flex-shrink-0" />
// //               )}
// //               <div className="flex-1">
// //                 {msg.loading ? (
// //                   <div className="flex items-center gap-2">
// //                     <Loader2 className="w-4 h-4 animate-spin" />
// //                     <span>Thinking...</span>
// //                   </div>
// //                 ) : (
// //                   <div className="whitespace-pre-wrap">{msg.text}</div>
// //                 )}
// //                 <div
// //                   className={`text-xs mt-1 ${
// //                     msg.sender === "bot"
// //                       ? "text-gray-500 dark:text-gray-400"
// //                       : "text-purple-200"
// //                   }`}
// //                 >
// //                   {formatTime(msg.timestamp)}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //         {error && (
// //           <div className="text-red-500 text-sm text-center p-2">{error}</div>
// //         )}
// //         <div ref={messagesEndRef} />
// //       </div>

// //       {/* Input area */}
// //       <div className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-xl">
// //         <div className="flex gap-2">
// //           <textarea
// //             className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
// //             value={input}
// //             onChange={(e) => setInput(e.target.value)}
// //             onKeyDown={handleKeyPress}
// //             placeholder="Type your message..."
// //             disabled={isLoading}
// //             rows={1}
// //             style={{ minHeight: "44px", maxHeight: "120px" }}
// //           />
// //           <button
// //             className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
// //             onClick={handleSend}
// //             disabled={isLoading || !input.trim()}
// //             aria-label="Send message"
// //           >
// //             {isLoading ? (
// //               <Loader2 className="w-5 h-5 animate-spin" />
// //             ) : (
// //               <Send className="w-5 h-5" />
// //             )}
// //           </button>
// //         </div>
// //         <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
// //           AI assistant may produce inaccurate information.
// //         </p>
// //       </div>
// //     </motion.div>
// //   );
// // }


// "use client";

// import { useState, useRef, useEffect } from "react";
// import { motion } from "framer-motion";
// import { X, Send, Loader2, Bot, User } from "lucide-react";

// export default function ChatBot({ onClose }) {
//   const [messages, setMessages] = useState([
//     {
//       sender: "bot",
//       text: "Hi! I'm your AI assistant. How can I help you today? 💬",
//       loading: false,
//       timestamp: new Date().toISOString(),
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const messagesEndRef = useRef(null);
//   const chatBotRef = useRef(null); // Reference to the chatbot container

//   // Auto-scroll to bottom when messages change
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Click outside detection
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (chatBotRef.current && !chatBotRef.current.contains(event.target)) {
//         onClose();
//       }
//     };

//     // Add event listener
//     document.addEventListener("mousedown", handleClickOutside);
    
//     // Cleanup event listener on unmount
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [onClose]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleSend = async () => {
//     if (!input.trim() || isLoading) return;

//     const userMsg = {
//       sender: "user",
//       text: input,
//       loading: false,
//       timestamp: new Date().toISOString(),
//     };
//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     setError(null);

//     // Add temporary loading message
//     setMessages((prev) => [
//       ...prev,
//       {
//         sender: "bot",
//         text: "",
//         loading: true,
//         timestamp: new Date().toISOString(),
//       },
//     ]);
//     setIsLoading(true);

//     try {
//       const response = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           prompt: input,
//           history: messages
//             .filter((msg) => !msg.loading)
//             .map((msg) => ({
//               role: msg.sender === "user" ? "user" : "assistant",
//               content: msg.text,
//             })),
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       const botReply = data.reply || "Sorry, I couldn't process your request.";

//       // Replace loading message with actual response
//       setMessages((prev) => [
//         ...prev.slice(0, -1),
//         {
//           sender: "bot",
//           text: botReply,
//           loading: false,
//           timestamp: new Date().toISOString(),
//         },
//       ]);
//     } catch (error) {
//       console.error("Error:", error);
//       setError("Failed to get response. Please try again.");
//       // Remove loading message on error
//       setMessages((prev) => prev.slice(0, -1));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   const formatTime = (timestamp) => {
//     return new Date(timestamp).toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   return (
//     <motion.div
//       ref={chatBotRef} // Add ref to the main container
//       initial={{ opacity: 0, y: 40 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 40 }}
//       className="fixed bottom-4 right-4 z-50 w-96 h-[600px] bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-xl rounded-xl flex flex-col"
//     >
//       {/* Header */}
//       <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-xl">
//         <div className="flex items-center gap-2">
//           <Bot className="w-5 h-5" />
//           <h3 className="font-bold">AI Assistant</h3>
//         </div>
//         <button
//           onClick={onClose}
//           className="hover:bg-white/10 p-1 rounded-full"
//           aria-label="Close chat"
//         >
//           <X className="w-5 h-5" />
//         </button>
//       </div>

//       {/* Chat messages */}
//       <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
//         {messages.map((msg, i) => (
//           <div
//             key={`${msg.timestamp}-${i}`}
//             className={`flex flex-col ${
//               msg.sender === "bot" ? "items-start" : "items-end"
//             }`}
//           >
//             <div
//               className={`flex items-start gap-2 p-3 rounded-lg max-w-[85%] ${
//                 msg.sender === "bot"
//                   ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
//                   : "bg-purple-500 text-white"
//               }`}
//             >
//               {msg.sender === "bot" ? (
//                 <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
//               ) : (
//                 <User className="w-4 h-4 mt-1 flex-shrink-0" />
//               )}
//               <div className="flex-1">
//                 {msg.loading ? (
//                   <div className="flex items-center gap-2">
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                     <span>Thinking...</span>
//                   </div>
//                 ) : (
//                   <div className="whitespace-pre-wrap">{msg.text}</div>
//                 )}
//                 <div
//                   className={`text-xs mt-1 ${
//                     msg.sender === "bot"
//                       ? "text-gray-500 dark:text-gray-400"
//                       : "text-purple-200"
//                   }`}
//                 >
//                   {formatTime(msg.timestamp)}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//         {error && (
//           <div className="text-red-500 text-sm text-center p-2">{error}</div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input area */}
//       <div className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-xl">
//         <div className="flex gap-2">
//           <textarea
//             className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyPress}
//             placeholder="Type your message..."
//             disabled={isLoading}
//             rows={1}
//             style={{ minHeight: "44px", maxHeight: "120px" }}
//           />
//           <button
//             className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             onClick={handleSend}
//             disabled={isLoading || !input.trim()}
//             aria-label="Send message"
//           >
//             {isLoading ? (
//               <Loader2 className="w-5 h-5 animate-spin" />
//             ) : (
//               <Send className="w-5 h-5" />
//             )}
//           </button>
//         </div>
//         <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
//           AI assistant may produce inaccurate information.
//         </p>
//       </div>
//     </motion.div>
//   );
// }



"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Send, Loader2, MessageCircle, User } from "lucide-react";

export default function ChatBot({ onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm here to support your mental wellness journey. How are you feeling today?",
      loading: false,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = {
      sender: "user",
      text: input,
      loading: false,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setError(null);

    // Add temporary loading message
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: "",
        loading: true,
        timestamp: new Date().toISOString(),
      },
    ]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          history: messages
            .filter((msg) => !msg.loading)
            .map((msg) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text,
            })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.reply || "Sorry, I couldn't process your request.";

      // Replace loading message with actual response
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          sender: "bot",
          text: botReply,
          loading: false,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to get response. Please try again.");
      // Remove loading message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl p-6 max-w-lg w-full mx-4 shadow-2xl max-h-[80vh] flex flex-col"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">MindEcho Assistant</h3>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto mb-4">
          {messages.map((msg, i) => (
            <div
              key={`${msg.timestamp}-${i}`}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-2xl p-3 max-w-xs ${
                  msg.sender === "bot"
                    ? "bg-gray-50 text-gray-800"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                }`}
              >
                {msg.loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <div
                      className={`text-xs mt-1 ${
                        msg.sender === "bot"
                          ? "text-gray-500"
                          : "text-purple-200"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {error && (
            <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
          />
          <button 
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Send"
            )}
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          AI assistant may produce inaccurate information.
        </p>
      </motion.div>
    </motion.div>
  );
}