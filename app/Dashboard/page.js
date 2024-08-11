"use client";

import { useState } from "react";
import AuthLayout from "../../client/auth/AuthLayout";

export default function Dashboard() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I'm AI Support Buddy, How Can I Assist you today?",
    },
  ]);

  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (!message.trim()) return; // Prevent sending empty messages

    // Add user message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
    ]);

    // Clear input field
    setMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Add a placeholder for the assistant's response
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "" },
      ]);

      let accumulatedContent = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === "assistant") {
            return [
              ...newMessages.slice(0, -1),
              { ...lastMessage, content: accumulatedContent },
            ];
          } else {
            return [
              ...newMessages,
              { role: "assistant", content: accumulatedContent },
            ];
          }
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "Sorry, there was an error. Please try again.",
        },
      ]);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-gray-100  max-h-screen flex flex-col max-w-lg mx-auto">
        <div className="bg-blue-500 p-4 text-white flex justify-between items-center">
          <button id="login" className="hover:bg-blue-400 rounded-md p-1">
            <svg
              width="25px"
              height="25px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="6" r="4" stroke="#ffffff" strokeWidth="1.5" />
              <path
                d="M15 20.6151C14.0907 20.8619 13.0736 21 12 21C8.13401 21 5 19.2091 5 17C5 14.7909 8.13401 13 12 13C15.866 13 19 14.7909 19 17C19 17.3453 18.9234 17.6804 18.7795 18"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <span>Chat App</span>
          <button id="setting" className="hover:bg-blue-400 rounded-md p-1">
            <svg
              width="30px"
              height="30px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.1395 12.0002C14.1395 13.1048 13.2664 14.0002 12.1895 14.0002C11.1125 14.0002 10.2395 13.1048 10.2395 12.0002C10.2395 10.8957 11.1125 10.0002 12.1895 10.0002C13.2664 10.0002 14.1395 10.8957 14.1395 12.0002Z"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.57381 18.1003L5.12169 12.8133C4.79277 12.2907 4.79277 11.6189 5.12169 11.0963L7.55821 5.89229C7.93118 5.32445 8.55898 4.98876 9.22644 5.00029H12.1895H15.1525C15.8199 4.98876 16.4477 5.32445 16.8207 5.89229L19.2524 11.0923C19.5813 11.6149 19.5813 12.2867 19.2524 12.8093L16.8051 18.1003C16.4324 18.674 15.8002 19.0133 15.1281 19.0003H9.24984C8.5781 19.013 7.94636 18.6737 7.57381 18.1003Z"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : ""}`}
            >
              <div
                className={`${
                  msg.role === "user" ? "bg-blue-200" : "bg-gray-300"
                } text-black p-4 m-2 rounded-lg max-w-xs`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 flex items-center">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white rounded-full p-2 ml-2 hover:bg-blue-600 focus:outline-none"
          >
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 12L22 2L13 22L11 13L2 12Z"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
