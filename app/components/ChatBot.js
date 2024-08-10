"use client";

import { useState, useRef, useEffect } from "react";
import { Box, Stack, TextField, Button } from "@mui/material";
import ReactMarkdown from 'react-markdown';
import { Typography } from '@mui/material';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I’m Support Chat Agent, How Can I Assist you today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef(null);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const userMessage = { role: "user", content: message };
    const assistantMessage = { role: "assistant", content: "" };

    setMessage("");
    setMessages((prevMessages) => [...prevMessages, userMessage, assistantMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, userMessage]),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let result = "";
      const processText = async ({ done, value }) => {
        if (done) {
          setIsLoading(false);
          return;
        }

        const text = decoder.decode(value || new Int8Array(), { stream: true });
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1].content += text;
          return updatedMessages;
        });

        return reader.read().then(processText);
      };

      reader.read().then(processText);
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Stack
        direction="column"
        width={{ xs: "90%", sm: "90%", md: "600px" }}
        height="700px"
        border="1px solid black"
        borderRadius={10}
        p={2}
        spacing={2}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
              <Box
                bgcolor={
                  message.role === "assistant" ? "primary.main" : "secondary.main"
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <Typography variant="body1">{children}</Typography>,
                    strong: ({ children }) => <Typography variant="body1" component="span" fontWeight="bold">{children}</Typography>,
                    em: ({ children }) => <Typography variant="body1" component="span" fontStyle="italic">{children}</Typography>,
                    ul: ({ children }) => <Typography component="ul" style={{ paddingLeft: '20px', marginBottom: '8px' }}>{children}</Typography>,
                    li: ({ children }) => <Typography component="li" variant="body2" style={{ marginBottom: '4px' }}>{children}</Typography>,
                    h1: ({ children }) => <Typography variant="h4" gutterBottom>{children}</Typography>,
                    h2: ({ children }) => <Typography variant="h5" gutterBottom>{children}</Typography>,
                    h3: ({ children }) => <Typography variant="h6" gutterBottom>{children}</Typography>,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </Box>
            </Box>
          ))}
          {isLoading && (
            <Box display="flex" justifyContent="center">
              <Box bgcolor="primary.light" color="white" borderRadius={16} p={3}>
                Loading...
              </Box>
            </Box>
          )}
          <div ref={messageEndRef} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={message.trim() === "" || isLoading}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
