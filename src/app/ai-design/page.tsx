"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Palette,
  Sparkles,
  Wand2,
  Image as ImageIcon,
  Download,
  RefreshCw,
  Copy,
  Heart,
  Share2,
  Zap,
  Layers,
  Type,
  Layout
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AIDesignPage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("");
  const [size, setSize] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesigns, setGeneratedDesigns] = useState<any[]>([]);

  const designStyles = [
    { value: "modern", label: "عصري", color: "from-blue-500 to-cyan-500" },
    { value: "minimal", label: "بسيط", color: "from-gray-500 to-slate-500" },
    { value: "colorful", label: "ملون", color: "from-pink-500 to-purple-500" },
    { value: "professional", label: "احترافي", color: "from-indigo-500 to-blue-500" },
    { value: "creative", label: "إبداعي", color: "from-orange-500 to-red-500" },
    { value: "elegant", label: "أنيق", color: "from-purple-500 to-pink-500" }
  ];

  const designSizes = [
    { value: "square", label: "مربع (1:1)", dimensions: "1080x1080" },
    { value: "story", label: "ستوري (9:16)", dimensions: "1080x1920" },
    { value: "post", label: "منشور (4:5)", dimensions: "1080x1350" },
    { value: "banner", label: "بانر (16:9)", dimensions: "1920x1080" },
    { value: "cover", label: "غلاف (820x312)", dimensions: "820x312" }
  ];

  const templates = [
    {
      id: 1,
      title: "إعلان منتج",
      description: "تصميم جذاب لعرض المنتجات",
      category: "product",
      preview: "🎨"
    },
    {
      id: 2,
      title: "منشور تسويقي",
      description: "منشور احترافي للحملات",
      category: "marketing",
      preview: "📱"
    },
    {
      id: 3,
      title: "ستوري انستقرام",
      description: "قصة جذابة للسوشيال ميديا",
      category: "social",
      preview: "📸"
    },
    {
      id: 4,
      title: "بانر ويب",
      description: "بانر احترافي للمواقع",
      category: "web",
      preview: "🖼️"
    }
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    // محاكاة توليد التصاميم
    setTimeout(() => {
      const mockDesigns = [
        { id: 1, url: "/api/placeholder/400/400", likes: 0 },
        { id: 2, url: "/api/placeholder/400/400", likes: 0 },
        { id: 3, url: "/api/placeholder/400/400", likes: 0 },
        { id: 4, url: "/api/placeholder/400/400", likes: 0 }
      ];
      setGeneratedDesigns(mockDesigns);
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
            <Palette className="w-8 h-8 text-purple-600" />
            تصميم بالذكاء الاصطناعي
          </h1>
          <p className="text-muted-foreground mt-2">
            أنشئ تصاميم احترافية بضغطة زر واحدة
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2 gap-2">
          <Sparkles className="w-4 h-4" />
          مدعوم بالذكاء الاصطناعي
        </Badge>
      </motion.div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="generate">توليد تصميم</TabsTrigger>
          <TabsTrigger value="templates">القوالب الجاهزة</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Section */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5" />
                    إعدادات التصميم
                  </CardTitle>
                  <CardDescription>صف التصميم الذي تريده</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prompt">وصف التصميم *</Label>
                    <Textarea
                      id="prompt"
                      placeholder="مثال: تصميم إعلان لمنتج تقني حديث بألوان زرقاء وبرتقالية..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="glass-morphism min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="style">نمط التصميم</Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger className="glass-morphism">
                        <SelectValue placeholder="اختر النمط" />
                      </SelectTrigger>
                      <SelectContent>
                        {designStyles.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">حجم التصميم</Label>
                    <Select value={size} onValueChange={setSize}>
                      <SelectTrigger className="glass-morphism">
                        <SelectValue placeholder="اختر الحجم" />
                      </SelectTrigger>
                      <SelectContent>
                        {designSizes.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label} - {s.dimensions}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt || isGenerating}
                    className="w-full gradient-primary text-white gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        جاري التوليد...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        توليد التصميم
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Styles */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-sm">أنماط سريعة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {designStyles.map((s) => (
                      <Button
                        key={s.value}
                        variant="outline"
                        size="sm"
                        onClick={() => setStyle(s.value)}
                        className={`glass-morphism ${style === s.value ? 'border-purple-500' : ''}`}
                      >
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${s.color} mr-2`} />
                        {s.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <div className="lg:col-span-2">
              <Card className="glass-morphism border-white/20 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    التصاميم المولدة
                  </CardTitle>
                  <CardDescription>
                    {generatedDesigns.length > 0
                      ? `${generatedDesigns.length} تصاميم تم توليدها`
                      : "ستظهر التصاميم هنا بعد التوليد"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
                        <Sparkles className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <p className="text-muted-foreground">جاري توليد تصاميم رائعة...</p>
                    </div>
                  ) : generatedDesigns.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {generatedDesigns.map((design) => (
                        <motion.div
                          key={design.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="group relative"
                        >
                          <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
                            <div className="w-full h-full flex items-center justify-center text-6xl">
                              🎨
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                            <Button size="sm" variant="secondary" className="gap-2">
                              <Download className="w-4 h-4" />
                              تحميل
                            </Button>
                            <Button size="sm" variant="secondary">
                              <Heart className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="secondary">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-purple-600" />
                      </div>
                      <p className="text-muted-foreground text-center">
                        اكتب وصفاً للتصميم واضغط على "توليد التصميم"
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* AI Tips */}
          <Card className="glass-morphism border-white/20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    نصائح للحصول على أفضل النتائج
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• كن محدداً في وصف التصميم (الألوان، الأسلوب، العناصر)</li>
                    <li>• استخدم كلمات مثل "احترافي"، "عصري"، "ملون" لتحديد النمط</li>
                    <li>• اذكر الغرض من التصميم (إعلان، منشور، بانر)</li>
                    <li>• جرب أنماطاً مختلفة للحصول على تنوع في النتائج</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="glass-morphism border-white/20 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center text-6xl mb-4 group-hover:scale-105 transition-transform">
                      {template.preview}
                    </div>
                    <h3 className="font-semibold mb-1">{template.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {template.description}
                    </p>
                    <Button size="sm" className="w-full gradient-primary text-white gap-2">
                      <Wand2 className="w-4 h-4" />
                      استخدم القالب
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
