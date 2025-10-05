"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthServiceClient } from "@/lib/services/auth-service-client";
import { Role, UserRoleType } from "@/lib/types/auth-types";

// Define user roles including SUPER_ADMIN
type UserRole = UserRoleType;

interface User {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  roles?: Role[]; // Multiple roles support
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: string) => Promise<boolean>;
  getUserRoles: () => Promise<Role[]>;
  isSuperAdmin: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call your authentication API
      // For now, we'll simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful login with a default role
      // In a real app, this would come from the server
      const userData = { id: "user-123", email, name: "مستخدم تجريبي", role: "ADMIN" as UserRole };
      
      // For demo purposes, let's make the first user a SUPER_ADMIN
      if (email === "admin@system.com") {
        userData.role = "SUPER_ADMIN" as UserRole;
      }
      
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call your registration API
      // For now, we'll simulate registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful registration with a default role
      // In a real app, this would come from the server
      const userData = { id: "user-123", email, name, role: "USER" as UserRole };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // Check if user has a specific permission
  const hasPermission = async (permission: string): Promise<boolean> => {
    if (!user?.role) return false;
    
    // SUPER_ADMIN has all permissions
    if (user.role === "SUPER_ADMIN") {
      return true;
    }
    
    // In a real implementation, this would check against actual user permissions
    // For now, we'll use the AuthServiceClient to check permissions
    try {
      const result = await AuthServiceClient.checkUserPermissions(
        user.id, 
        user.role, 
        [permission]
      );
      return result.hasPermission;
    } catch (error) {
      console.error("Error checking permissions:", error);
      return false;
    }
  };

  // Get user roles
  const getUserRoles = async (): Promise<Role[]> => {
    if (!user) return [];
    
    try {
      // In a real implementation, this would fetch from the server
      return await AuthServiceClient.getUserRoles(user.id);
    } catch (error) {
      console.error("Error fetching user roles:", error);
      return [];
    }
  };
  
  // Check if user is SUPER_ADMIN
  const isSuperAdmin = async (): Promise<boolean> => {
    if (!user) return false;
    
    // If user role is explicitly set to SUPER_ADMIN
    if (user.role === "SUPER_ADMIN") {
      return true;
    }
    
    try {
      // In a real implementation, this would check with the server
      return await AuthServiceClient.isSuperAdmin(user.id);
    } catch (error) {
      console.error("Error checking if user is SUPER_ADMIN:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, hasPermission, getUserRoles, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}