"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit,
  Send,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Image as ImageIcon,
  FileText
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

type ScheduledPost = {
  id: number;
  content: string;
  platform: string;
  date: string;
  time: string;
  status: "scheduled" | "published" | "failed";
};

export default function SchedulePostsPage() {
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({
    content: "",
    platform: "",
    date: "",
    time: ""
  });

  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([
    {
      id: 1,
      content: "إطلاق منتجنا الجديد! 🚀",
      platform: "facebook",
      date: "2025-10-05",
      time: "10:00",
      status: "scheduled"
    },
    {
      id: 2,
      content: "عرض خاص لفترة محدودة! 🎉",
      platform: "instagram",
      date: "2025-10-06",
      time: "14:00",
      status: "scheduled"
    },
    {
      id: 3,
      content: "شكراً لدعمكم المستمر ❤️",
      platform: "twitter",
      date: "2025-10-04",
      time: "09:00",
      status: "published"
    }
  ]);

  const platforms = [
    { value: "facebook", label: "Facebook", icon: Facebook, color: "text-blue-600" },
    { value: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-600" },
    { value: "twitter", label: "Twitter/X", icon: Twitter, color: "text-sky-600" },
    { value: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-blue-700" }
  ];

  const getPlatformIcon = (platform: string) => {
    const p = platforms.find(pl => pl.value === platform);
    if (!p) return Facebook;
    return p.icon;
  };

  const getPlatformColor = (platform: string) => {
    const p = platforms.find(pl => pl.value === platform);
    return p?.color || "text-gray-600";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-500">مجدول</Badge>;
      case "published":
        return <Badge className="bg-green-500">منشور</Badge>;
      case "failed":
        return <Badge className="bg-red-500">فشل</Badge>;
      default:
        return <Badge>غير معروف</Badge>;
    }
  };

  const handleAddPost = () => {
    if (newPost.content && newPost.platform && newPost.date && newPost.time) {
      const post: ScheduledPost = {
        id: Date.now(),
        ...newPost,
        status: "scheduled"
      };
      setScheduledPosts([...scheduledPosts, post]);
      setNewPost({ content: "", platform: "", date: "", time: "" });
      setShowNewPost(false);
    }
  };

  const handleDeletePost = (id: number) => {
    setScheduledPosts(scheduledPosts.filter(post => post.id !== id));
  };

  const bestTimes = [
    { platform: "Facebook", time: "13:00 - 16:00", day: "الأربعاء والخميس" },
    { platform: "Instagram", time: "11:00 - 14:00", day: "الثلاثاء والجمعة" },
    { platform: "Twitter", time: "12:00 - 15:00", day: "من الاثنين إلى الجمعة" },
    { platform: "LinkedIn", time: "07:00 - 09:00", day: "الثلاثاء والأربعاء" }
  ];

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
            <Calendar className="w-8 h-8 text-purple-600" />
            جدولة النشر التلقائي
          </h1>
          <p className="text-muted-foreground mt-2">
            جدول منشوراتك على جميع المنصات الاجتماعية
          </p>
        </div>
        <Button
          onClick={() => setShowNewPost(!showNewPost)}
          className="gradient-primary text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          منشور جديد
        </Button>
      </motion.div>

      {/* New Post Form */}
      {showNewPost && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-morphism border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                منشور جديد
              </CardTitle>
              <CardDescription>أنشئ وجدول منشورك على المنصات الاجتماعية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">محتوى المنشور *</Label>
                <Textarea
                  id="content"
                  placeholder="اكتب محتوى منشورك هنا..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="glass-morphism min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground">
                  {newPost.content.length} / 280 حرف
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">المنصة *</Label>
                  <Select
                    value={newPost.platform}
                    onValueChange={(value) => setNewPost({ ...newPost, platform: value })}
                  >
                    <SelectTrigger className="glass-morphism">
                      <SelectValue placeholder="اختر المنصة" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((platform) => {
                        const Icon = platform.icon;
                        return (
                          <SelectItem key={platform.value} value={platform.value}>
                            <div className="flex items-center gap-2">
                              <Icon className={`w-4 h-4 ${platform.color}`} />
                              {platform.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">التاريخ *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newPost.date}
                    onChange={(e) => setNewPost({ ...newPost, date: e.target.value })}
                    className="glass-morphism"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">الوقت *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newPost.time}
                    onChange={(e) => setNewPost({ ...newPost, time: e.target.value })}
                    className="glass-morphism"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAddPost}
                  disabled={!newPost.content || !newPost.platform || !newPost.date || !newPost.time}
                  className="gradient-primary text-white gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  جدولة المنشور
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewPost(false)}
                >
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Tabs defaultValue="scheduled" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="scheduled">المجدولة</TabsTrigger>
          <TabsTrigger value="published">المنشورة</TabsTrigger>
          <TabsTrigger value="calendar">التقويم</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-4">
          {scheduledPosts.filter(post => post.status === "scheduled").length === 0 ? (
            <Card className="glass-morphism border-white/20">
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">لا توجد منشورات مجدولة</h3>
                <p className="text-muted-foreground mb-4">
                  ابدأ بإنشاء منشور جديد وجدوله للنشر التلقائي
                </p>
                <Button
                  onClick={() => setShowNewPost(true)}
                  className="gradient-primary text-white gap-2"
                >
                  <Plus className="w-4 h-4" />
                  منشور جديد
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {scheduledPosts
                .filter(post => post.status === "scheduled")
                .map((post) => {
                  const Icon = getPlatformIcon(post.platform);
                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="glass-morphism border-white/20">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <Icon className={`w-5 h-5 ${getPlatformColor(post.platform)}`} />
                                {getStatusBadge(post.status)}
                                <Badge variant="outline" className="gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {post.date}
                                </Badge>
                                <Badge variant="outline" className="gap-1">
                                  <Clock className="w-3 h-3" />
                                  {post.time}
                                </Badge>
                              </div>
                              <p className="text-lg">{post.content}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {scheduledPosts
              .filter(post => post.status === "published")
              .map((post) => {
                const Icon = getPlatformIcon(post.platform);
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="glass-morphism border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Icon className={`w-5 h-5 ${getPlatformColor(post.platform)}`} />
                              {getStatusBadge(post.status)}
                              <Badge variant="outline" className="gap-1">
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                تم النشر في {post.date} - {post.time}
                              </Badge>
                            </div>
                            <p className="text-lg">{post.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">عرض التقويم</h3>
              <p className="text-muted-foreground">
                قريباً: عرض تقويم تفاعلي لجميع منشوراتك المجدولة
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Best Times to Post */}
      <Card className="glass-morphism border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            أفضل أوقات النشر
          </CardTitle>
          <CardDescription>
            بناءً على تحليل البيانات، هذه أفضل الأوقات للنشر على كل منصة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bestTimes.map((item, index) => {
              const platform = platforms.find(p => p.label === item.platform);
              const Icon = platform?.icon || Clock;
              return (
                <Card key={index} className="glass-morphism border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-5 h-5 ${platform?.color}`} />
                      <h4 className="font-semibold">{item.platform}</h4>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">الوقت: {item.time}</p>
                      <p className="text-muted-foreground">اليوم: {item.day}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
