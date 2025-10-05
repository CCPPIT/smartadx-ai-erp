"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole, AuthMethod, AuthService, AuthTokens } from "@/services/authService";

interface EnhancedAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loginWithOAuth: (provider: string) => Promise<boolean>;
  initiatePasswordlessAuth: (email: string) => Promise<boolean>;
  verifyMFA: (code: string) => Promise<boolean>;
  hasPermission: (requiredRole: UserRole) => boolean;
  refreshAuth: () => Promise<boolean>;
}

const EnhancedAuthContext = createContext<EnhancedAuthContextType | undefined>(undefined);

export function EnhancedAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mfaRequired, setMfaRequired] = useState(false);

  // Check if user is already authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would check for valid tokens
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Use the auth service to authenticate
      const authenticatedUser = await AuthService.authenticateWithPassword(email, password);
      
      if (authenticatedUser) {
        // Check if MFA is required
        if (authenticatedUser.mfaEnabled) {
          setMfaRequired(true);
          setUser(authenticatedUser);
          return false; // MFA required, don't complete login yet
        }
        
        // Complete login
        setUser(authenticatedUser);
        setIsAuthenticated(true);
        
        // Store in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(authenticatedUser));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call your registration API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful registration
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        role: "USER",
        authMethods: ["password"],
        mfaEnabled: false,
        emailVerified: false,
        createdAt: new Date(),
        lastLogin: new Date()
      };
      
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthService.clearAuthCookies();
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    setMfaRequired(false);
  };

  const loginWithOAuth = async (provider: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real implementation, this would redirect to the OAuth provider
      // For simulation, we'll create a mock user
      const mockUser: User = {
        id: `oauth-${provider}-${Date.now()}`,
        email: `${provider}-user@example.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        role: "USER",
        authMethods: ["oauth"],
        mfaEnabled: false,
        emailVerified: true,
        createdAt: new Date(),
        lastLogin: new Date()
      };
      
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error("OAuth login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const initiatePasswordlessAuth = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      return await AuthService.initiatePasswordlessAuth(email);
    } catch (error) {
      console.error("Passwordless auth error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMFA = async (code: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real implementation, this would verify the MFA code
      // For simulation, we'll assume it's valid
      if (user && mfaRequired) {
        setMfaRequired(false);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("MFA verification error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    
    // Role hierarchy: ADMIN > MANAGER > ANALYST > USER
    const roleHierarchy: Record<UserRole, number> = {
      "ADMIN": 4,
      "MANAGER": 3,
      "ANALYST": 2,
      "USER": 1
    };
    
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const refreshAuth = async (): Promise<boolean> => {
    try {
      // In a real implementation, this would refresh the auth tokens
      return true;
    } catch (error) {
      console.error("Auth refresh error:", error);
      return false;
    }
  };

  return (
    <EnhancedAuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      loginWithOAuth,
      initiatePasswordlessAuth,
      verifyMFA,
      hasPermission,
      refreshAuth
    }}>
      {children}
    </EnhancedAuthContext.Provider>
  );
}

export function useEnhancedAuth() {
  const context = useContext(EnhancedAuthContext);
  if (context === undefined) {
    throw new Error("useEnhancedAuth must be used within an EnhancedAuthProvider");
  }
  return context;
}