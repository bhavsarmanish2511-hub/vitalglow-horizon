import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { ReportCard } from "./ReportCard";
import { TicketPanel } from "./TicketPanel";
import { IncidentTimeline } from "./IncidentTimeline";
import { TicketDetailsModal } from "@/components/tickets/TicketDetailsModal";
import { IncidentDetailsModal } from "@/components/incidents/IncidentDetailsModal";
import { useChatbot } from "@/hooks/useChatbot";
import { useTickets } from "@/contexts/TicketsContext";

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const { messages, inputValue, setInputValue, sendMessage, isTyping } = useChatbot();
  const { getTicketById, getIncidentById } = useTickets();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Handler to view ticket details from chat
  const handleViewDetail = (ticketId: string, type: "ticket" | "incident") => {
    if (type === "ticket") {
      const ticket = getTicketById(ticketId);
      if (ticket) setSelectedTicket(ticket);
    } else {
      const incident = getIncidentById(ticketId);
      if (incident) setSelectedIncident(incident);
    }
  };

  // Listen for quick action prompts
  useEffect(() => {
    const handlePrompt = (e: CustomEvent) => {
      setIsOpen(true);
      setTimeout(() => {
        sendMessage(e.detail);
      }, 300);
    };
    window.addEventListener('chatbot-prompt', handlePrompt as EventListener);
    return () => window.removeEventListener('chatbot-prompt', handlePrompt as EventListener);
  }, [sendMessage]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-primary z-50"
          size="icon"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-card rounded-lg shadow-2xl border border-border flex flex-col animate-slide-in z-50">
          <div className="bg-gradient-primary p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary-foreground" />
              <h3 className="font-semibold text-primary-foreground">AI Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <ChatMessage message={message} />
                  {message.type === "report" && message.data && (
                    <ReportCard data={message.data} />
                  )}
                  {message.type === "ticket" && message.data && (
                    <>
                      <TicketPanel data={message.data} />
                      {message.ticketId && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => handleViewDetail(message.ticketId!, "ticket")}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Ticket Details
                        </Button>
                      )}
                    </>
                  )}
                  {message.type === "incident" && message.data && (
                    <>
                      <IncidentTimeline data={message.data} />
                      {message.ticketId && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => handleViewDetail(message.ticketId!, "incident")}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Incident Details
                        </Button>
                      )}
                    </>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-muted-foreground p-3 bg-muted/30 rounded-lg animate-pulse">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                  <span className="text-sm font-medium">Assistant is thinking...</span>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon" className="bg-gradient-primary">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Ticket and Incident Detail Modals */}
      {selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          open={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
      {selectedIncident && (
        <IncidentDetailsModal
          incident={selectedIncident}
          open={!!selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </>
  );
}
