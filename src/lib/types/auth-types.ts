// Authentication System Types

// Role types
export interface Role {
  id: number;
  name: string;
  description: string;
  level: number;
  created_at: string;
  updated_at: string;
}

// Permission types
export interface Permission {
  id: number;
  name: string;
  description: string;
  category: string;
  created_at: string;
}

// Role-Permission mapping
export interface RolePermission {
  role_id: number;
  permission_id: number;
  created_at: string;
}

// User-Role mapping
export interface UserRole {
  user_id: string;
  role_id: number;
  assigned_at: string;
}

// Generic config type for authentication methods
export interface AuthMethodConfig {
  [key: string]: string | number | boolean | string[] | number[] | Record<string, unknown> | null | undefined;
}

// Authentication method types
export interface AuthenticationMethod {
  id: number;
  name: string;
  display_name: string;
  description: string;
  is_active: boolean;
  config: AuthMethodConfig;
  created_at: string;
  updated_at: string;
}

// User authentication method
export interface UserAuthMethod {
  id: number;
  user_id: string;
  auth_method_id: number;
  is_primary: boolean;
  is_enabled: boolean;
  config: AuthMethodConfig;
  created_at: string;
  updated_at: string;
}

// User session
export interface UserSession {
  id: string;
  user_id: string;
  auth_method: string;
  ip_address: string;
  user_agent: string;
  expires_at: string;
  created_at: string;
  last_accessed: string;
}

// Authentication audit log
export interface AuthAuditLog {
  id: number;
  user_id: string;
  action: string;
  auth_method: string;
  ip_address: string;
  user_agent: string;
  success: boolean;
  failure_reason: string;
  created_at: string;
}

// Authentication configuration types
export interface JWTConfig {
  expires_in: string;
  algorithm: string;
}

export interface OAuthConfig {
  grant_type: string;
  pkce_required?: boolean;
  response_type?: string;
  audience?: string;
}

export interface MFAConfig {
  algorithm?: string;
  digits?: number;
  period?: number;
  provider?: string;
  length?: number;
  types?: string[];
}

export interface BiometricConfig {
  types: string[];
}

export interface PasswordlessConfig {
  methods: string[];
}

export interface SocialAuthConfig {
  providers: string[];
}

export interface EnterpriseAuthConfig {
  binding?: string;
  signature_algorithm?: string;
  protocol?: string;
  encryption?: string;
  type?: string;
}

// Combined authentication settings
export interface AuthSettings {
  primaryMethod: string;
  mfaEnabled: boolean;
  biometricEnabled: boolean;
  passwordlessEnabled: boolean;
  socialAuthEnabled: boolean;
  enterpriseAuthEnabled: boolean;
}

// User permissions check result
export interface PermissionCheckResult {
  hasPermission: boolean;
  requiredPermissions: string[];
  missingPermissions: string[];
}

// Role hierarchy
export type UserRoleType = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'ANALYST' | 'USER';

export const USER_ROLES: Record<UserRoleType, { name: string; level: number }> = {
  SUPER_ADMIN: { name: 'SUPER_ADMIN', level: 5 },
  ADMIN: { name: 'ADMIN', level: 4 },
  MANAGER: { name: 'MANAGER', level: 3 },
  ANALYST: { name: 'ANALYST', level: 2 },
  USER: { name: 'USER', level: 1 }
};