"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Key, 
  Smartphone, 
  Fingerprint,
  Shield,
  QrCode,
  Github,
  Chrome,
  Apple
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function EnhancedLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<"password" | "mfa" | "passwordless">("password");
  const [mfaCode, setMfaCode] = useState("");
  const [passwordlessEmail, setPasswordlessEmail] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const { login, register } = useAuth();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحبًا بعودتك!",
        });
        router.push("/");
      } else {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ أثناء محاولة تسجيل الدخول",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFAVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real implementation, this would verify the MFA code
      // For now, we'll just show a success message
      toast({
        title: "تم التحقق بنجاح",
        description: "مرحبًا بعودتك!",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: "خطأ في التحقق",
        description: "حدث خطأ أثناء التحقق بخطوتين",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordlessLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real implementation, this would send a magic link
      // For now, we'll just show a success message
      toast({
        title: "تم إرسال الرابط",
        description: "يرجى التحقق من بريدك الإلكتروني",
      });
      // Switch to passwordless confirmation view
      setAuthMethod("passwordless");
    } catch (error) {
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال الرابط",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would redirect to the OAuth provider
      // For now, we'll just show a success message
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحبًا بعودتك عبر ${provider}!`,
      });
      router.push("/");
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: `حدث خطأ أثناء تسجيل الدخول عبر ${provider}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="glass-morphism border-white/20 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              تسجيل الدخول المتقدم
            </CardTitle>
            <CardDescription>
              اختر طريقة تسجيل الدخول المفضلة لديك
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Authentication Method Selector */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={authMethod === "password" ? "default" : "outline"}
                size="sm"
                onClick={() => setAuthMethod("password")}
                className="flex items-center gap-1"
              >
                <Key className="w-4 h-4" />
                كلمة المرور
              </Button>
              <Button
                variant={authMethod === "mfa" ? "default" : "outline"}
                size="sm"
                onClick={() => setAuthMethod("mfa")}
                className="flex items-center gap-1"
              >
                <Shield className="w-4 h-4" />
                التحقق بخطوتين
              </Button>
              <Button
                variant={authMethod === "passwordless" ? "default" : "outline"}
                size="sm"
                onClick={() => setAuthMethod("passwordless")}
                className="flex items-center gap-1"
              >
                <Mail className="w-4 h-4" />
                بدون كلمة مرور
              </Button>
            </div>

            {/* Password Login Form */}
            {authMethod === "password" && (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pr-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full gradient-primary text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                      جاري تسجيل الدخول...
                    </div>
                  ) : (
                    "تسجيل الدخول"
                  )}
                </Button>
              </form>
            )}

            {/* MFA Verification Form */}
            {authMethod === "mfa" && (
              <form onSubmit={handleMFAVerification} className="space-y-4">
                <div className="text-center mb-4">
                  <Shield className="w-12 h-12 mx-auto text-indigo-500" />
                  <p className="mt-2 text-muted-foreground">
                    أدخل رمز التحقق من تطبيق المصادقة
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mfaCode">رمز التحقق</Label>
                  <div className="relative">
                    <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="mfaCode"
                      type="text"
                      placeholder="000000"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      className="pr-10 text-center text-2xl tracking-widest"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full gradient-primary text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                      جاري التحقق...
                    </div>
                  ) : (
                    "تحقق"
                  )}
                </Button>
              </form>
            )}

            {/* Passwordless Login Form */}
            {authMethod === "passwordless" && (
              <form onSubmit={handlePasswordlessLogin} className="space-y-4">
                <div className="text-center mb-4">
                  <Mail className="w-12 h-12 mx-auto text-indigo-500" />
                  <p className="mt-2 text-muted-foreground">
                    أدخل بريدك الإلكتروني لتستلم رابط تسجيل الدخول
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passwordlessEmail">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="passwordlessEmail"
                      type="email"
                      placeholder="your@email.com"
                      value={passwordlessEmail}
                      onChange={(e) => setPasswordlessEmail(e.target.value)}
                      className="pr-10"
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full gradient-primary text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                      جاري الإرسال...
                    </div>
                  ) : (
                    "إرسال الرابط"
                  )}
                </Button>
              </form>
            )}

            {/* OAuth Providers */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    أو تسجيل الدخول باستخدام
                  </span>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleOAuthLogin("google")}
                  disabled={isLoading}
                >
                  <Chrome className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleOAuthLogin("github")}
                  disabled={isLoading}
                >
                  <Github className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleOAuthLogin("apple")}
                  disabled={isLoading}
                >
                  <Apple className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Additional Options */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">ليس لديك حساب؟</span>{" "}
              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
                onClick={() => router.push("/register")}
              >
                إنشاء حساب
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}