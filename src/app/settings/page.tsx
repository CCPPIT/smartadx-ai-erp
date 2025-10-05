"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Settings, 
  Palette, 
  Globe, 
  Bell, 
  Shield, 
  Database, 
  Moon, 
  Sun,
  Monitor,
  Save,
  RotateCcw,
  Key,
  Lock,
  Smartphone,
  Fingerprint,
  Mail,
  Chrome,
  Building,
  Wifi,
  CheckCircle,
  AlertTriangle,
  User,
  Eye,
  EyeOff,
  Users,
  UserCheck,
  UserX,
  List,
  TableIcon,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { AuthServiceClient } from "@/lib/services/auth-service-client";
import { Role, Permission, AuthenticationMethod } from "@/lib/types/auth-types";

export default function SettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("authentication");
  const [settings, setSettings] = useState({
    theme: "system",
    language: "ar",
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      profileVisibility: "private",
      dataSharing: false
    },
    security: {
      twoFactor: false,
      loginAlerts: true
    },
    authentication: {
      method: "jwt",
      mfaEnabled: false,
      biometricEnabled: false,
      passwordlessEnabled: false,
      socialAuthEnabled: false,
      enterpriseAuthEnabled: false
    }
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [authMethods, setAuthMethods] = useState<AuthenticationMethod[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [rolesData, permissionsData, authMethodsData] = await Promise.all([
          AuthServiceClient.getRoles(),
          AuthServiceClient.getPermissions(),
          AuthServiceClient.getAuthMethods()
        ]);
        
        setRoles(rolesData);
        setPermissions(permissionsData);
        setAuthMethods(authMethodsData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "خطأ في تحميل البيانات",
          description: "حدث خطأ أثناء تحميل إعدادات المصادقة",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSave = () => {
    // In a real implementation, this would save to backend
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم تحديث إعداداتك بنجاح",
    });
  };

  const handleReset = () => {
    setSettings({
      theme: "system",
      language: "ar",
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      privacy: {
        profileVisibility: "private",
        dataSharing: false
      },
      security: {
        twoFactor: false,
        loginAlerts: true
      },
      authentication: {
        method: "jwt",
        mfaEnabled: false,
        biometricEnabled: false,
        passwordlessEnabled: false,
        socialAuthEnabled: false,
        enterpriseAuthEnabled: false
      }
    });
    toast({
      title: "تم إعادة تعيين الإعدادات",
      description: "تمت إعادة تعيين الإعدادات إلى القيم الافتراضية",
    });
  };

  const updateNotificationSetting = (key: keyof typeof settings.notifications, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const updatePrivacySetting = (key: keyof typeof settings.privacy, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const updateSecuritySetting = (key: keyof typeof settings.security, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value
      }
    }));
  };

  const updateAuthenticationSetting = (key: keyof typeof settings.authentication, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      authentication: {
        ...prev.authentication,
        [key]: value
      }
    }));
  };

  // Authentication methods data
  const authMethodOptions = [
    { id: "jwt", name: "رموز ويب JSON (JWT)", description: "مصادقة حديثة بدون حاجة لتخزين على الخادم" },
    { id: "opaque", name: "رموز غير شفافة", description: "رموز عشوائية تُخزن على الخادم" },
    { id: "oauth-auth-code", name: "رمز التفويض (Authorization Code)", description: "للمصادقة مع تطبيقات خارجية" },
    { id: "oauth-implicit", name: "تدفق ضمني (Implicit Flow)", description: "لتطبيقات أحادية الصفحة" },
    { id: "oauth-client-creds", name: "بيانات العميل (Client Credentials)", description: "لمصادقة خادم-لخادم" },
    { id: "oauth-device", name: "تدفق الأجهزة (Device Flow)", description: "لمصادقة أجهزة IoT" }
  ];

  // MFA methods data
  const mfaMethodOptions = [
    { id: "totp", name: "الرمز الزمني (TOTP)", description: "Google Authenticator أو Authy" },
    { id: "sms", name: "الرسائل النصية (SMS)", description: "رمز لمرة واحدة عبر SMS" },
    { id: "email", name: "البريد الإلكتروني", description: "رمز لمرة واحدة عبر البريد" },
    { id: "biometric", name: "الحيوية (Biometric)", description: "بصمة أو وجه أو صوت" },
    { id: "security-key", name: "مفتاح الأمان", description: "YubiKey أو مفتاح فيزيائي" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              الإعدادات
            </h1>
            <p className="text-muted-foreground mt-1">
              تخصيص تجربتك في SmartAdX AI ERP
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 ml-2" />
              إعادة تعيين
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 ml-2" />
              حفظ التغييرات
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  فئات الإعدادات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-1">
                  {[
                    { id: "appearance", label: "المظهر", icon: Palette },
                    { id: "language", label: "اللغة", icon: Globe },
                    { id: "notifications", label: "الإشعارات", icon: Bell },
                    { id: "privacy", label: "الخصوصية", icon: Shield },
                    { id: "security", label: "الأمان", icon: Database },
                    { id: "authentication", label: "المصادقة", icon: Key },
                    { id: "roles", label: "الأدوار والصلاحيات", icon: Users },
                    { id: "auth-methods", label: "أنواع المصادقة", icon: Lock }
                  ].map((item) => (
                    <button
                      key={item.id}
                      className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-300"
                          : "hover:bg-white/10"
                      }`}
                      onClick={() => setActiveTab(item.id)}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Appearance Settings */}
            {activeTab === "appearance" && (
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    المظهر
                  </CardTitle>
                  <CardDescription>
                    تخصيص مظهر التطبيق
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">الوضع الليلي</h3>
                      <p className="text-sm text-muted-foreground">تفعيل الوضع الداكن للتطبيق</p>
                    </div>
                    <Switch
                      checked={settings.theme === "dark"}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ 
                          ...prev, 
                          theme: checked ? "dark" : "light" 
                        }))
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>سمة النظام</Label>
                    <Select 
                      value={settings.theme} 
                      onValueChange={(value) => 
                        setSettings(prev => ({ ...prev, theme: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="w-4 h-4" />
                            فاتح
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="w-4 h-4" />
                            داكن
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4" />
                            النظام
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Language Settings */}
            {activeTab === "language" && (
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    اللغة
                  </CardTitle>
                  <CardDescription>
                    تخصيص لغة التطبيق
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>لغة العرض</Label>
                    <Select 
                      value={settings.language} 
                      onValueChange={(value) => 
                        setSettings(prev => ({ ...prev, language: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    الإشعارات
                  </CardTitle>
                  <CardDescription>
                    إدارة تفضيلات الإشعارات
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">إشعارات البريد الإلكتروني</h3>
                      <p className="text-sm text-muted-foreground">تلقي إشعارات على البريد الإلكتروني</p>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => 
                        updateNotificationSetting("email", checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">إشعارات الهاتف</h3>
                      <p className="text-sm text-muted-foreground">تلقي إشعارات فورية على الهاتف</p>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) => 
                        updateNotificationSetting("push", checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">إشعارات الرسائل النصية</h3>
                      <p className="text-sm text-muted-foreground">تلقي إشعارات عبر الرسائل النصية</p>
                    </div>
                    <Switch
                      checked={settings.notifications.sms}
                      onCheckedChange={(checked) => 
                        updateNotificationSetting("sms", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Privacy Settings */}
            {activeTab === "privacy" && (
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    الخصوصية
                  </CardTitle>
                  <CardDescription>
                    إدارة إعدادات الخصوصية
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>رؤية الملف الشخصي</Label>
                    <Select 
                      value={settings.privacy.profileVisibility as string} 
                      onValueChange={(value) => 
                        updatePrivacySetting("profileVisibility", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">عام</SelectItem>
                        <SelectItem value="private">خاص</SelectItem>
                        <SelectItem value="friends">الأصدقاء فقط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">مشاركة البيانات</h3>
                      <p className="text-sm text-muted-foreground">مشاركة البيانات مع الشركاء</p>
                    </div>
                    <Switch
                      checked={settings.privacy.dataSharing as boolean}
                      onCheckedChange={(checked) => 
                        updatePrivacySetting("dataSharing", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    الأمان
                  </CardTitle>
                  <CardDescription>
                    إدارة إعدادات الأمان
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">التحقق بخطوتين</h3>
                      <p className="text-sm text-muted-foreground">تفعيل التحقق بخطوتين للحماية الإضافية</p>
                    </div>
                    <Switch
                      checked={settings.security.twoFactor as boolean}
                      onCheckedChange={(checked) => 
                        updateSecuritySetting("twoFactor", checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">تنبيهات تسجيل الدخول</h3>
                      <p className="text-sm text-muted-foreground">تلقي تنبيهات عند تسجيل الدخول من أجهزة جديدة</p>
                    </div>
                    <Switch
                      checked={settings.security.loginAlerts as boolean}
                      onCheckedChange={(checked) => 
                        updateSecuritySetting("loginAlerts", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Authentication Settings */}
            {activeTab === "authentication" && (
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    أنواع المصادقة
                  </CardTitle>
                  <CardDescription>
                    تخصيص أنواع المصادقة المتاحة للنظام
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Primary Authentication Method */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        طريقة المصادقة الأساسية
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        حدد الطريقة الأساسية للمصادقة في النظام
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {authMethodOptions.map((method) => (
                        <div 
                          key={method.id}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            settings.authentication.method === method.id
                              ? "border-indigo-500 bg-indigo-500/10"
                              : "border-white/20 hover:border-white/40"
                          }`}
                          onClick={() => updateAuthenticationSetting("method", method.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center ${
                              settings.authentication.method === method.id
                                ? "border-indigo-500 bg-indigo-500"
                                : "border-white/30"
                            }`}>
                              {settings.authentication.method === method.id && (
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">{method.name}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {method.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MFA Options */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        المصادقة متعددة العوامل (MFA)
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        تفعيل طرق إضافية للتحقق من الهوية
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {mfaMethodOptions.map((method) => (
                        <div 
                          key={method.id}
                          className="p-4 rounded-lg border border-white/20 hover:border-white/40 transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <Switch 
                              checked={settings.authentication.mfaEnabled}
                              onCheckedChange={(checked) => 
                                updateAuthenticationSetting("mfaEnabled", checked)
                              }
                            />
                            <div>
                              <h4 className="font-medium text-sm">{method.name}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {method.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advanced Authentication Options */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">خيارات المصادقة المتقدمة</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        تفعيل أنواع مصادقة إضافية للنظام
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3">
                          <Fingerprint className="w-5 h-5 text-indigo-400" />
                          <div>
                            <h4 className="font-medium text-sm">المصادقة الحيوية</h4>
                            <p className="text-xs text-muted-foreground">
                              بصمة، وجه، صوت
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.authentication.biometricEnabled as boolean}
                          onCheckedChange={(checked) => 
                            updateAuthenticationSetting("biometricEnabled", checked)
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-green-400" />
                          <div>
                            <h4 className="font-medium text-sm">المصادقة بدون كلمة مرور</h4>
                            <p className="text-xs text-muted-foreground">
                              روابط سحرية ورموز لمرة واحدة
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.authentication.passwordlessEnabled as boolean}
                          onCheckedChange={(checked) => 
                            updateAuthenticationSetting("passwordlessEnabled", checked)
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3">
                          <Chrome className="w-5 h-5 text-blue-400" />
                          <div>
                            <h4 className="font-medium text-sm">المصادقة الاجتماعية</h4>
                            <p className="text-xs text-muted-foreground">
                              Google، Facebook، GitHub
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.authentication.socialAuthEnabled as boolean}
                          onCheckedChange={(checked) => 
                            updateAuthenticationSetting("socialAuthEnabled", checked)
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-yellow-400" />
                          <div>
                            <h4 className="font-medium text-sm">مصادقة المؤسسات</h4>
                            <p className="text-xs text-muted-foreground">
                              SAML، LDAP، Active Directory
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.authentication.enterpriseAuthEnabled as boolean}
                          onCheckedChange={(checked) => 
                            updateAuthenticationSetting("enterpriseAuthEnabled", checked)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Recommendations */}
                  <div className="p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">توصيات الأمان</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          للتطبيقات عالية الأمان، نوصي بتفعيل المصادقة متعددة العوامل والمصادقة الحيوية.
                          لتطبيقات المؤسسات، استخدم SAML أو LDAP. للتطبيقات الحديثة، JWT هو الخيار الأمثل.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Roles and Permissions */}
            {activeTab === "roles" && (
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    الأدوار والصلاحيات
                  </CardTitle>
                  <CardDescription>
                    إدارة الأدوار والصلاحيات في النظام
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">الأدوار</h3>
                    <Button size="sm">
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة دور جديد
                    </Button>
                  </div>
                  
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>الاسم</TableHead>
                          <TableHead>الوصف</TableHead>
                          <TableHead>المستوى</TableHead>
                          <TableHead>الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {roles.map((role) => (
                          <TableRow key={role.id}>
                            <TableCell className="font-medium">{role.name}</TableCell>
                            <TableCell>{role.description}</TableCell>
                            <TableCell>{role.level}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  
                  <div className="flex justify-between items-center mt-8">
                    <h3 className="text-lg font-medium">الصلاحيات</h3>
                    <Button size="sm">
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة صلاحية جديدة
                    </Button>
                  </div>
                  
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>الاسم</TableHead>
                          <TableHead>الوصف</TableHead>
                          <TableHead>الفئة</TableHead>
                          <TableHead>الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {permissions.map((permission) => (
                          <TableRow key={permission.id}>
                            <TableCell className="font-medium">{permission.name}</TableCell>
                            <TableCell>{permission.description}</TableCell>
                            <TableCell>{permission.category}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Authentication Methods */}
            {activeTab === "auth-methods" && (
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    أنواع المصادقة
                  </CardTitle>
                  <CardDescription>
                    إدارة أنواع المصادقة المتاحة في النظام
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">طرق المصادقة</h3>
                    <Button size="sm">
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة طريقة مصادقة
                    </Button>
                  </div>
                  
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>الاسم</TableHead>
                          <TableHead>الاسم المعروض</TableHead>
                          <TableHead>الوصف</TableHead>
                          <TableHead>الحالة</TableHead>
                          <TableHead>الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {authMethods.map((method) => (
                          <TableRow key={method.id}>
                            <TableCell className="font-medium">{method.name}</TableCell>
                            <TableCell>{method.display_name}</TableCell>
                            <TableCell>{method.description}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                method.is_active 
                                  ? "bg-green-500/20 text-green-600 dark:text-green-300" 
                                  : "bg-red-500/20 text-red-600 dark:text-red-300"
                              }`}>
                                {method.is_active ? "مفعل" : "معطل"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Switch checked={method.is_active} />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  
                  <div className="p-4 rounded-lg border border-blue-500/30 bg-blue-500/10">
                    <div className="flex items-start gap-3">
                      <TableIcon className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">نظام جداول المصادقة</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          تم إنشاء جداول قاعدة البيانات التالية لإدارة المصادقة:
                        </p>
                        <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside">
                          <li>جدول الأدوار (roles) - لتعريف الأدوار المختلفة في النظام</li>
                          <li>جدول الصلاحيات (permissions) - لتحديد الصلاحيات المحددة</li>
                          <li>جدول ربط الأدوار بالصلاحيات (role_permissions) - لربط الأدوار بالصلاحيات المناسبة</li>
                          <li>جدول طرق المصادقة (auth_methods) - لتعريف طرق المصادقة المتاحة</li>
                          <li>جدول مصادقة المستخدمين (user_auth_methods) - لتتبع طرق المصادقة لكل مستخدم</li>
                          <li>جدول الجلسات (sessions) - لإدارة جلسات المستخدمين النشطة</li>
                          <li>جدول سجلات التدقيق (audit_logs) - لتسجيل عمليات المصادقة والأمان</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}