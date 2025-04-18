import React, { useState, useEffect, useRef } from "react";

const ChatWindow = ({onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const username = "User";

  const messagesEndRef = useRef(null);

  const defaultBotReply = `Aximsoft facilitates startups to build the future. Our incubation program is conceptualized to bring ideas to life and to be always with you through the startup lifecycle. We strive to build extraordinary technology products and solutions that drive some of the brightest ideas and innovations.

Founded in 2005, Aximsoft is a full-scale technology firm headquartered in the USA with an offshore development center in India.

Aximsoft helps push the limits of what’s possible. We research, collaborate and innovate to put the latest technologies to work for you.`;

  useEffect(() => {
    const savedMessages = sessionStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("chatMessages", JSON.stringify(messages));
      scrollToBottom();
    }
  }, [messages]);

  const typeWriterEffect = (message) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < message.length) {
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, prevMessages.length - 1),
          { text: message.slice(0, i + 1), sender: "bot" },
        ]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 10);
  };
  const sendMessage = async (message, sender) => {
    if (message.trim() !== "") {
        if (showIntro) {
            setShowIntro(false);
        }

        setMessages((prevMessages) => [...prevMessages, { text: message, sender }]);

        if (sender === 'user') {
            setLoading(true);

            const allowedQuestions = [
                "About you?",
                "Tell me about Aximsoft",
                "About us?",
                "Tell me about you?",
                "Tell me about yourself"
            ];

            try {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: "", sender: 'bot' }
                ]);

                const match = allowedQuestions.some(q => q.toLowerCase() === message.toLowerCase());

                const reply = match
                    ? defaultBotReply
                    : "I'm here to help! Can you please be more specific or ask something else?";

                typeWriterEffect(reply);
            } catch (error) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: "Sorry, something went wrong. Please try again.", sender: 'bot' }
                ]);
            } finally {
                setLoading(false);
            }
        }
    }
};

  const handleButtonClick = () => {
    if (inputMessage.trim() !== "") {
      sendMessage(inputMessage, "user");
      setInputMessage("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleButtonClick();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  return (
    <>
    <div className="absolute top-10 right-20 z-10">
  <button onClick={onClose} aria-label="Close">
    <img src="/images/close-icon.svg" alt="close" className="h-8 w-auto" />
  </button>
</div>
    <div className="fixed inset-0 z-0 backdrop-blur-lg bg-black/30" />
      <div
        className="chat-bot ove-left-anim"
        style={{
          height: "85%",
          width: "60%",
          position: "relative",
          right: "0",
          bottom: "1020px",
          margin: "auto",
          height: "100vh",
        }}
      >
        <div className="absolute w-full chatbot-wrp">
          <div className="messages overflow-y-auto">
            <div className="msg-wrp">
              {/* Intro message with unique class */}
              {showIntro && (
                <div className="flex items-center gap-2 mb-3 bot-message justify-start">
                  <div className="text-msg intro-msg">How can I help you?</div>
                </div>
              )}

              {/* Render all chat messages */}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 mb-3 ${
                    msg.sender === "user"
                      ? "user-message justify-end"
                      : "bot-message justify-start"
                  }`}
                >
                  <div className="text-msg">{msg.text}</div>
                </div>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>

          <div className="chat__txt--wrp flex flex-col gap-3 justify-center items-center">
            <input
              type="text"
              value={inputMessage}
              placeholder="TYPE HERE"
              className="chat-input"
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
            />
            <button
              className="btn p-0"
              onClick={handleButtonClick}
              disabled={loading || inputMessage.trim() === ""}
            >
              SEND
            </button>
          </div>

          <div className="flex icon-wrp items-center justify-center">
            <img src='/images/fb-icon.svg' alt="Facebook" />
            <img src='/images/link-icon.svg' alt="LinkedIn" />
            <img src='/images/twit-icon.svg' alt="Twitter" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
