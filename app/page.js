"use client";

import { Box, Button } from "@mui/material";
import ChatBot from "../app/components/ChatBot";
import { useState } from "react";

export default function Home() {
  const [show, setShow] = useState(false);

  const showBot = () => {
    setShow(!show);
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {show ? <ChatBot /> : null}
      <Box
        width="70px"
        height="70px"
        borderRadius="50%"
        bgcolor="#47ffc0"
        display="flex"
        justifyContent="center"
        alignItems="center"
        // sx={{ position: "relative", right: "-325px", bottom: "20px" ,
        //   backgroundImage: "url('/assets/Ai-Bot.png')", // Replace with your image path
        //   backgroundSize: 'cover', // Adjust as needed
        //   backgroundPosition: 'center', // Adjust as needed
        //   height: '70px', // Adjust height as needed
        //   width: '70px', // Adjust width as needed
        //   }}
         
      >
        <Button
          size="large"
          height="100px"
          width="100px"
          bgcolor="#47ffc0"
          
          onClick={showBot}
        >
          {" "}
          AI
        </Button>
      </Box>
    </Box>
  );
}
