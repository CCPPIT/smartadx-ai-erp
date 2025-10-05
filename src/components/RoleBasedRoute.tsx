"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext";
import { UserRole } from "@/services/authService";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requireAuth?: boolean;
}

export default function RoleBasedRoute({ 
  children, 
  requiredRole = "USER",
  requireAuth = true
}: RoleBasedRouteProps) {
  const { user, isAuthenticated, isLoading, hasPermission } = useEnhancedAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      // Redirect to login page if not authenticated
      router.push("/enhanced-login");
    } else if (!isLoading && isAuthenticated && requiredRole && user && !hasPermission(requiredRole)) {
      // Redirect to unauthorized page if user doesn't have required role
      router.push("/unauthorized");
    }
  }, [user, isAuthenticated, isLoading, requiredRole, hasPermission, router, requireAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري التحقق من الصلاحيات...</p>
        </motion.div>
      </div>
    );
  }

  if (!requireAuth) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null; // or a redirect component
  }

  if (requiredRole && user && !hasPermission(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass-morphism border-white/20 rounded-2xl p-8 text-center">
            <div className="mx-auto bg-gradient-to-br from-red-500 to-orange-500 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">وصول غير مصرح به</h2>
            <p className="text-muted-foreground mb-6">
              ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة
            </p>
            <Button 
              onClick={() => router.push("/")}
              className="gradient-primary text-white"
            >
              العودة إلى الرئيسية
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}