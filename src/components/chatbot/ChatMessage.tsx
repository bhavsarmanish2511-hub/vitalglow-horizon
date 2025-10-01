import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { TicketPanel } from "./TicketPanel";
import { ReportCard } from "./ReportCard";
import { IncidentTimeline } from "./IncidentTimeline";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  type?: string;
  data?: any;
  ticketId?: string;
}

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 animate-fade-in", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
          isUser ? "bg-primary" : "bg-muted"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 max-w-[80%]">
        <div
          className={cn(
            "rounded-lg p-3",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          {message.timestamp && (
            <p className={cn("text-xs mt-1", isUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
        
        {/* Render ticket/report/incident cards */}
        {!isUser && message.type === "ticket" && message.data && (
          <TicketPanel data={message.data} />
        )}
        {!isUser && message.type === "report" && message.data && (
          <ReportCard data={message.data} />
        )}
        {!isUser && message.type === "incident" && message.data && (
          <IncidentTimeline data={message.data} />
        )}
      </div>
    </div>
  );
}
