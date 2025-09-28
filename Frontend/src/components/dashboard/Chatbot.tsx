import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Heart,
  Thermometer,
  Pill,
  Activity,
  Upload,
  FileText,
  Loader2
} from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
}

export const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your Mining Safety Assistant. I can help you analyze site safety reports and identify hazards. Please type your question or upload a report.",
      sender: 'bot',
      timestamp: new Date()
    },
    {
      id: 2,
      text: "You can upload mining site PDF reports for hazard analysis. How can I assist you with safety concerns today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const quickQuestions = [
    { icon: Heart, text: "I see hazardous cracks" },
    { icon: Thermometer, text: "Temperature rising in mine" },
    { icon: Activity, text: "Check for potential rockfall" },
    { icon: Pill, text: "Dust exposure symptoms" }
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedFile) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: selectedFile ? `${inputMessage}\n📎 Attached: ${selectedFile.name}` : inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    const loadingMessage: Message = {
      id: messages.length + 2,
      text: "Analyzing your request...",
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);

    try {
      const payload = { 
        user_query: inputMessage,
        user_id: "dashboard_user"
      };

      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to get response from server');

      const data = await response.json();

      const botResponse: Message = {
        id: messages.length + 3,
        text: data.response || "I couldn't process your request. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => prev.slice(0, -1).concat(botResponse));
      
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: messages.length + 3,
        text: "Sorry, I'm having trouble connecting to the server. Please check your internet connection and try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => prev.slice(0, -1).concat(errorMessage));
      
      toast({
        title: "Connection Error",
        description: "Unable to connect to the AI backend. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setInputMessage('');
      setSelectedFile(null);
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: typeof quickQuestions[0]) => {
    setInputMessage(question.text);
    handleSendMessage();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      toast({
        title: "PDF Selected",
        description: `${file.name} is ready to upload`,
      });
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a PDF file only",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-primary to-accent mb-4">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Mining Safety Reports in Seconds
          </h1>
          <p className="text-xl text-muted-foreground">
            Chat with your Mining Safety Assistant
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Upload PDF safety reports for instant hazard analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Questions Sidebar */}
          <div className="lg:col-span-1">
            <Card className="medical-card border-2 border-primary/20 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Common Safety Checks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start h-auto p-3 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:border-primary/30 transition-all duration-200"
                    onClick={() => handleQuickQuestion(question)}
                    disabled={isLoading}
                  >
                    <div className="flex items-start gap-2">
                      <question.icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="text-sm font-medium whitespace-normal break-words leading-snug">
                        {question.text}
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="medical-card h-[600px] flex flex-col border-2 border-primary/20 shadow-xl">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div>Mining Assistant</div>
                    <div className="text-sm font-normal text-muted-foreground">
                      Your Site Safety Guide
                    </div>
                  </div>
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin text-primary ml-auto" />}
                </CardTitle>
              </CardHeader>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.sender === 'bot' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-white">
                            {message.isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Bot className="h-4 w-4" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={`max-w-[80%] rounded-lg p-3 shadow-sm ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-primary to-accent text-white'
                            : message.isLoading 
                            ? 'bg-muted animate-pulse' 
                            : 'bg-card border'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        <p className="text-xs opacity-50 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>

                      {message.sender === 'user' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4 bg-gradient-to-r from-primary/5 to-accent/5">
                {selectedFile && (
                  <div className="mb-3 p-2 bg-card rounded-lg border flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="flex-1">{selectedFile.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedFile(null)}
                      className="h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="Ask about mining safety reports, hazards, or upload a file..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="pdf-upload"
                      disabled={isLoading}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => document.getElementById('pdf-upload')?.click()}
                      disabled={isLoading}
                      className="shrink-0"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={(!inputMessage.trim() && !selectedFile) || isLoading}
                    className="btn-medical bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-200 shrink-0"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Upload mining site PDF reports for instant analysis. Always consult safety officers for actionable decisions.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Disclaimer */}
        <Card className="mt-8 border-accent/20 bg-accent/5">
          <CardContent className="p-6">
            <h3 className="font-semibold text-secondary mb-2">Important Disclaimer</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This assistant provides general safety insights based on uploaded data. It does not replace field inspections. Always follow official safety protocols and consult qualified engineers and site safety personnel.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chatbot;
