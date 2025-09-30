"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search as SearchIcon,
  Sparkles,
  TrendingUp,
  Users,
  Megaphone,
  FileText,
  Calendar,
  DollarSign,
  Bell,
  Settings,
  X,
  Clock,
  Hash,
  Tag,
  Star,
  Brain
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "حملة الربيع",
    "تحليل الأداء",
    "العميل أحمد محمد",
    "فاتورة #12345"
  ]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([
    "تحليل حملات الشهر الماضي",
    "مقارنة أداء الحملات الإعلانية",
    "توصيات لتحسين معدل التحويل",
    "توليد إعلان جديد باستخدام الذكاء الاصطناعي"
  ]);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Mock search results
  const mockResults = [
    {
      id: 1,
      type: "campaign",
      title: "حملة الربيع 2024",
      description: "حملة إعلانية لفصل الربيع مع عروض خاصة",
      icon: Megaphone,
      tags: ["قيد التشغيل", "عالي الأداء"],
      lastModified: "منذ 2 ساعة"
    },
    {
      id: 2,
      type: "client",
      title: "أحمد محمد عبدالله",
      description: "عميل مميز - شركة التقنية الحديثة",
      icon: Users,
      tags: ["عميل ذهبي", "مرتفع القيمة"],
      lastModified: "منذ يوم واحد"
    },
    {
      id: 3,
      type: "report",
      title: "تقرير أداء الحملات - أبريل 2024",
      description: "تحليل شامل لأداء الحملات الإعلانية",
      icon: FileText,
      tags: ["تحليل", "شهري"],
      lastModified: "منذ 3 أيام"
    },
    {
      id: 4,
      type: "analytics",
      title: "تحليل معدل التحويل",
      description: "تحليل مفصل لمعدل التحويل حسب المنصة",
      icon: TrendingUp,
      tags: ["تحليل", "تحسين"],
      lastModified: "منذ أسبوع"
    },
    {
      id: 5,
      type: "invoice",
      title: "فاتورة #12345",
      description: "فاتورة لشركة التقنية الحديثة - أبريل 2024",
      icon: DollarSign,
      tags: ["مدفوعة", "فاتورة شهرية"],
      lastModified: "منذ 5 أيام"
    }
  ];

  useEffect(() => {
    if (searchQuery.length > 2) {
      // Simulate search results
      const filteredResults = mockResults.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Add to recent searches
    if (query && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 3)]);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
            <SearchIcon className="w-8 h-8 text-primary" />
            البحث الذكي
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            ابحث في جميع أنحاء النظام باستخدام الذكاء الاصطناعي للحصول على نتائج دقيقة واقتراحات ذكية
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="ابحث في الحملات، العملاء، التقارير، الفواتير..."
              className="pl-12 py-6 text-lg rounded-2xl border-2 focus:border-primary"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearchQuery("")}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* AI Search Badge */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              بحث ذكي مع اقتراحات AI
            </Badge>
            <Badge variant="outline">
              <Brain className="w-3 h-3 mr-1" />
              تحليل سياقي
            </Badge>
          </div>
        </div>

        {/* Search Results */}
        {searchQuery ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                نتائج البحث عن: "{searchQuery}"
              </h2>
              <span className="text-muted-foreground">
                {searchResults.length} نتيجة
              </span>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid gap-4">
                {searchResults.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-primary/10 text-primary">
                            <result.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold truncate">{result.title}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {result.type === "campaign" && "حملة"}
                                {result.type === "client" && "عميل"}
                                {result.type === "report" && "تقرير"}
                                {result.type === "analytics" && "تحليل"}
                                {result.type === "invoice" && "فاتورة"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {result.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              {result.tags.map((tag: string, tagIndex: number) => (
                                <Badge key={tagIndex} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {result.lastModified}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <SearchIcon className="w-12 h-12 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">لم يتم العثور على نتائج</h3>
                    <p className="text-muted-foreground mt-1">
                      جرب استخدام كلمات مفتاحية مختلفة أو استخدم اقتراحات الذكاء الاصطناعي
                    </p>
                  </div>
                  <Button className="mt-4 gradient-primary text-white">
                    <Sparkles className="w-4 h-4 mr-2" />
                    اطلب اقتراحات ذكية
                  </Button>
                </div>
              </Card>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* AI Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  اقتراحات الذكاء الاصطناعي
                </CardTitle>
                <CardDescription>
                  اقتراحات ذكية بناءً على استخدامك واحتياجاتك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aiSuggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-start h-auto py-3 px-4 text-right"
                        onClick={() => handleSearch(suggestion)}
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <span>{suggestion}</span>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        عمليات البحث الأخيرة
                      </CardTitle>
                      <CardDescription>
                        عمليات البحث التي قمت بها مؤخرًا
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRecentSearches}
                    >
                      <X className="w-4 h-4 ml-2" />
                      مسح الكل
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <Button
                        key={index}
                        variant="secondary"
                        className="gap-2"
                        onClick={() => handleSearch(search)}
                      >
                        <SearchIcon className="w-4 h-4" />
                        {search}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Search Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  نصائح للبحث
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      icon: Hash,
                      title: "استخدم الرموز",
                      description: "ابحث باستخدام #رقم_الفاتورة أو @اسم_العميل"
                    },
                    {
                      icon: Tag,
                      title: "ابحث بالوسوم",
                      description: "ابحث باستخدام وسوم مثل: #قيد_التنفيذ أو #مكتمل"
                    },
                    {
                      icon: Calendar,
                      title: "ابحث بالتاريخ",
                      description: "ابحث بالتاريخ مثل: 2024-04 أو أبريل 2024"
                    }
                  ].map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <tip.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{tip.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  );
}