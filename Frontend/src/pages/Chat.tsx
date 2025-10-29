import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI skincare advisor. Ask me anything about ingredients, product recommendations, or routine tips!",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { role: "user", content: input }]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Based on your current products, that's a great question! Let me help you with that...",
        },
      ]);
    }, 1000);
  };

  const suggestedQuestions = [
    "What order should I use my products?",
    "Can I use retinol with vitamin C?",
    "How to treat dry skin?",
    "Best products for anti-aging?",
  ];

  return (
    <div className="h-screen bg-gradient-subtle flex flex-col pb-20">
      <div className="max-w-screen-lg mx-auto px-4 py-8 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Advisor</h1>
              <p className="text-sm text-muted-foreground">Ask me anything about skincare</p>
            </div>
          </div>
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">Quick questions:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestedQuestions.map((question, index) => (
                <Card
                  key={index}
                  className="p-3 cursor-pointer hover:shadow-card transition-smooth border-border"
                  onClick={() => setInput(question)}
                >
                  <p className="text-sm text-foreground">{question}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} role={message.role} content={message.content} />
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Ask about ingredients, routines, or products..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="bg-card border-border"
          />
          <Button 
            onClick={handleSend} 
            className="bg-primary text-primary-foreground hover:opacity-90"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Chat;
