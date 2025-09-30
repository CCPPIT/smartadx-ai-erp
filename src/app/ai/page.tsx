"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Send, 
  Sparkles, 
  Brain, 
  MessageSquare, 
  Lightbulb, 
  Target, 
  TrendingUp,
  Plus,
  History,
  Settings,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc-react";

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "مرحباً! أنا مساعدك الذكي في SmartAdX. كيف يمكنني مساعدتك اليوم؟",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        role: "assistant",
        content: "أشكرك على سؤالك! بناءً على تحليلي، أوصي بتحسين استهداف الحملة الإعلانية الخاصة بك من خلال التركيز على الفئة العمرية 25-35 سنة، مع زيادة الميزانية بنسبة 15% خلال الأسبوع المقبل لتحقيق نتائج أفضل.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              مساعد الذكاء الاصطناعي
            </h1>
            <p className="text-muted-foreground mt-1">
              مساعد ذكي متطور لجميع احتياجاتك الإعلانية
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              السجل
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              الإعدادات
            </Button>
          </div>
        </div>

        {/* AI Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-morphism border-white/20 hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold">تحليل الحملات</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                تحليل أداء الحملات الإعلانية وتقديم توصيات لتحسين النتائج
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20 hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold">أفكار إبداعية</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                توليد أفكار إبداعية ومحتوى إعلاني مخصص لجمهورك المستهدف
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20 hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold">تحسين الأداء</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                استراتيجيات محسوبة لزيادة معدلات التحويل وتحسين العائد على الاستثمار
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat History */}
          <Card className="glass-morphism border-white/20 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                المحادثات السابقة
              </CardTitle>
              <CardDescription>سجل محادثاتك مع المساعد الذكي</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                    <div className="font-medium">تحليل حملة الصيف {item}</div>
                    <div className="text-sm text-muted-foreground mt-1">قبل {item} أيام</div>
                  </div>
                ))}
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  محادثة جديدة
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="glass-morphism border-white/20 lg:col-span-2 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                محادثة ذكية
              </CardTitle>
              <CardDescription>تحدث مع مساعد الذكاء الاصطناعي</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                          : "bg-white/10 border border-white/20"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.role === "assistant" && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                            <Brain className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <div>
                          <p>{message.content}</p>
                          <div className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                          <Brain className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="flex gap-2">
                <Textarea
                  placeholder="اكتب سؤالك أو طلبك هنا..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-white/10 border-white/20 text-foreground placeholder:text-gray-400 min-h-[60px]"
                />
                <Button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="gradient-primary text-white border-0 hover:scale-105 transition-transform"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Prompts */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              اقتراحات سريعة
            </CardTitle>
            <CardDescription>ابدأ بطرح أحد هذه الأسئلة الشائعة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                "كيف يمكنني تحسين معدل التحويل في حملتي؟",
                "ما هي أفضل أوقات النشر للوصول إلى جمهوري؟",
                "اقترح تصاميم إعلانات لمنتجي الجديد",
                "حلل أداء الحملات السابقة وقدم توصيات"
              ].map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-3 text-left justify-start hover:scale-105 transition-transform"
                  onClick={() => setInput(prompt)}
                >
                  <div className="text-sm">{prompt}</div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}