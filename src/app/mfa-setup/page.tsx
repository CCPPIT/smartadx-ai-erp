"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Shield, 
  Smartphone, 
  Mail, 
  Fingerprint, 
  Key,
  QrCode,
  Copy,
  Check
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function MFASetupPage() {
  const [activeMethod, setActiveMethod] = useState<"totp" | "sms" | "email" | "securityKey">("totp");
  const [totpCode, setTotpCode] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  // Mock TOTP secret and QR code for demonstration
  const totpSecret = "JBSWY3DPEHPK3PXP";
  const qrCodeData = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yMCAyMGg2MHY2MEgyMHoiIGZpbGw9IiMwMDAiLz48L3N2Zz4=";

  const handleCopySecret = () => {
    navigator.clipboard.writeText(totpSecret);
    setIsCopied(true);
    toast({
      title: "تم النسخ",
      description: "تم نسخ سر المصادقة إلى الحافظة",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleVerifyTOTP = () => {
    setIsVerifying(true);
    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false);
      toast({
        title: "تم التحقق",
        description: "تم إعداد المصادقة الثنائية بنجاح",
      });
      router.push("/settings");
    }, 1500);
  };

  const handleSendSMSCode = () => {
    toast({
      title: "تم الإرسال",
      description: "تم إرسال رمز التحقق إلى رقمك",
    });
  };

  const handleVerifySMS = () => {
    setIsVerifying(true);
    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false);
      toast({
        title: "تم التحقق",
        description: "تم إعداد المصادقة الثنائية بنجاح",
      });
      router.push("/settings");
    }, 1500);
  };

  const handleSendEmailCode = () => {
    toast({
      title: "تم الإرسال",
      description: "تم إرسال رمز التحقق إلى بريدك الإلكتروني",
    });
  };

  const handleVerifyEmail = () => {
    setIsVerifying(true);
    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false);
      toast({
        title: "تم التحقق",
        description: "تم إعداد المصادقة الثنائية بنجاح",
      });
      router.push("/settings");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            إعداد المصادقة الثنائية
          </h1>
          <p className="text-muted-foreground mt-2">
            اختر طريقة المصادقة الثنائية لحماية حسابك
          </p>
        </div>

        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              طرق المصادقة الثنائية
            </CardTitle>
            <CardDescription>
              اختر طريقة واحدة على الأقل لإعداد المصادقة الثنائية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Button
                variant={activeMethod === "totp" ? "default" : "outline"}
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => setActiveMethod("totp")}
              >
                <Smartphone className="w-6 h-6" />
                <span>تطبيق المصادقة</span>
              </Button>
              
              <Button
                variant={activeMethod === "sms" ? "default" : "outline"}
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => setActiveMethod("sms")}
              >
                <Mail className="w-6 h-6" />
                <span>رسالة نصية</span>
              </Button>
              
              <Button
                variant={activeMethod === "email" ? "default" : "outline"}
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => setActiveMethod("email")}
              >
                <Mail className="w-6 h-6" />
                <span>البريد الإلكتروني</span>
              </Button>
              
              <Button
                variant={activeMethod === "securityKey" ? "default" : "outline"}
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => setActiveMethod("securityKey")}
              >
                <Fingerprint className="w-6 h-6" />
                <span>مفتاح الأمان</span>
              </Button>
            </div>

            {/* TOTP Setup */}
            {activeMethod === "totp" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">إعداد تطبيق المصادقة</h3>
                  <p className="text-sm text-muted-foreground">
                    امسح رمز QR هذا أو أدخل السر يدويًا في تطبيق المصادقة
                  </p>
                </div>
                
                <div className="flex flex-col items-center gap-6">
                  <div className="p-4 bg-white rounded-lg">
                    <img 
                      src={qrCodeData} 
                      alt="QR Code for TOTP setup" 
                      className="w-48 h-48"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Input 
                      value={totpSecret} 
                      readOnly 
                      className="font-mono text-center"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleCopySecret}
                    >
                      {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  <div className="w-full max-w-xs">
                    <Label htmlFor="totpCode" className="text-right block mb-2">
                      أدخل الرمز المكون من 6 أرقام
                    </Label>
                    <Input
                      id="totpCode"
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      className="text-center text-2xl font-mono"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleVerifyTOTP}
                    disabled={totpCode.length !== 6 || isVerifying}
                    className="w-full max-w-xs"
                  >
                    {isVerifying ? "جاري التحقق..." : "تحقق واحفظ"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* SMS Setup */}
            {activeMethod === "sms" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">إعداد الرسائل النصية</h3>
                  <p className="text-sm text-muted-foreground">
                    أدخل رقم هاتفك لتستلم رموز التحقق
                  </p>
                </div>
                
                <div className="flex flex-col items-center gap-6">
                  <div className="w-full max-w-xs">
                    <Label htmlFor="phoneNumber" className="text-right block mb-2">
                      رقم الهاتف
                    </Label>
                    <Input
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+966 50 123 4567"
                      dir="ltr"
                      className="text-center"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSendSMSCode}
                    disabled={!phoneNumber}
                    className="w-full max-w-xs"
                  >
                    إرسال رمز التحقق
                  </Button>
                  
                  <div className="w-full max-w-xs">
                    <Label htmlFor="smsCode" className="text-right block mb-2">
                      أدخل الرمز المكون من 6 أرقام
                    </Label>
                    <Input
                      id="smsCode"
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      className="text-center text-2xl font-mono"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleVerifySMS}
                    disabled={smsCode.length !== 6 || isVerifying}
                    className="w-full max-w-xs"
                  >
                    {isVerifying ? "جاري التحقق..." : "تحقق واحفظ"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Email Setup */}
            {activeMethod === "email" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">إعداد البريد الإلكتروني</h3>
                  <p className="text-sm text-muted-foreground">
                    أدخل بريدك الإلكتروني لتستلم رموز التحقق
                  </p>
                </div>
                
                <div className="flex flex-col items-center gap-6">
                  <div className="w-full max-w-xs">
                    <Label htmlFor="email" className="text-right block mb-2">
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="email"
                      value={user?.email || ""}
                      readOnly
                      dir="ltr"
                      className="text-center"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSendEmailCode}
                    className="w-full max-w-xs"
                  >
                    إرسال رمز التحقق
                  </Button>
                  
                  <div className="w-full max-w-xs">
                    <Label htmlFor="emailCode" className="text-right block mb-2">
                      أدخل الرمز المكون من 6 أرقام
                    </Label>
                    <Input
                      id="emailCode"
                      value={emailCode}
                      onChange={(e) => setEmailCode(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      className="text-center text-2xl font-mono"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleVerifyEmail}
                    disabled={emailCode.length !== 6 || isVerifying}
                    className="w-full max-w-xs"
                  >
                    {isVerifying ? "جاري التحقق..." : "تحقق واحفظ"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Security Key Setup */}
            {activeMethod === "securityKey" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6 text-center"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">إعداد مفتاح الأمان</h3>
                  <p className="text-sm text-muted-foreground">
                    اتصل بمفتاح الأمان وانقر على الزر أدناه
                  </p>
                </div>
                
                <div className="flex flex-col items-center gap-6">
                  <div className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl border border-white/20">
                    <Fingerprint className="w-16 h-16 mx-auto text-blue-400" />
                  </div>
                  
                  <Button 
                    className="w-full max-w-xs h-16 text-lg"
                    onClick={() => {
                      toast({
                        title: "قيد التطوير",
                        description: "ميزة مفتاح الأمان قيد التطوير",
                      });
                    }}
                  >
                    <Key className="w-5 h-5 ml-2" />
                    توصيل مفتاح الأمان
                  </Button>
                  
                  <p className="text-sm text-muted-foreground max-w-md">
                    مفاتيح الأمان مثل YubiKey توفر أمانًا إضافيًا من خلال المصادقة الفيزيائية
                  </p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}