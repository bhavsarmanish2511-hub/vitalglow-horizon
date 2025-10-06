import { useState } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useTickets } from '@/contexts/TicketsContext';
import { mockTickets } from '@/data/mockTickets';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const quickPrompts = [
  "Summarize my assigned tickets for today",
  "What are the top 3 recurring issues this week?",
  "Give me an overview of unassigned tickets"
];

export function AIAgentWidget() {
  const { incidents } = useTickets();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI support assistant. How can I help you today?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState('');

  // Get all incidents (mock + user-created)
  const allIncidents = [...mockTickets.filter(t => t.type === 'incident'), ...incidents];

  const handlePromptClick = (prompt: string) => {
    handleSend(prompt);
  };

  const handleSend = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = '';
      
      if (messageText.toLowerCase().includes('assigned tickets')) {
        // Get actual assigned incidents
        const assignedIncidents = allIncidents.slice(0, 5);
        const ticketCount = assignedIncidents.length;
        
        if (ticketCount === 0) {
          aiResponse = 'You currently have no assigned incidents.';
        } else {
          aiResponse = `You have ${ticketCount} assigned ${ticketCount === 1 ? 'ticket' : 'tickets'} today:\n\n`;
          assignedIncidents.forEach((ticket, index) => {
            const priorityText = ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1);
            aiResponse += `${index + 1}. ${ticket.id} (${priorityText}): ${ticket.title}\n`;
          });
          
          // Calculate estimated resolution time (mock calculation)
          const totalHours = ticketCount * 0.8;
          aiResponse += `\nTotal estimated resolution time: ${totalHours.toFixed(1)} hours`;
        }
      } else if (messageText.toLowerCase().includes('recurring issues')) {
        aiResponse = 'Top 3 recurring issues this week:\n\n1. VPN connectivity (12 tickets) - Average resolution: 45min\n2. Email sync problems (8 tickets) - Average resolution: 30min\n3. Software license requests (6 tickets) - Average resolution: 2 hours';
      } else if (messageText.toLowerCase().includes('unassigned')) {
        aiResponse = 'There are currently 2 unassigned tickets:\n\n1. SR106 (Low): Printer configuration request\n2. SR107 (Medium): Password reset request\n\nBoth created within the last hour.';
      } else {
        aiResponse = 'I understand your request. Let me help you with that. For specific ticket information, please use one of the quick prompts or ask about assigned tickets, recurring issues, or unassigned tickets.';
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 shadow-2xl z-50">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">AI Support Assistant</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, index) => (
            <Badge
              key={index}
              variant="outline"
              className="cursor-pointer hover:bg-primary/10 transition-colors px-3 py-1"
              onClick={() => handlePromptClick(prompt)}
            >
              {prompt}
            </Badge>
          ))}
        </div>

        <ScrollArea className="h-80 pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button size="icon" onClick={() => handleSend()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
