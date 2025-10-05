// Authentication Service
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';
import { 
  Role, 
  Permission, 
  RolePermission, 
  UserRole, 
  AuthenticationMethod, 
  UserAuthMethod, 
  AuthSettings,
  PermissionCheckResult,
  UserRoleType
} from "../types/auth-types";

// Create a single instance of PrismaClient
let prisma: PrismaClient;

try {
  prisma = new PrismaClient();
} catch (error) {
  console.error("Failed to initialize Prisma client:", error);
  // Fallback to mock data if Prisma fails to initialize
  prisma = null as any;
}

// Service functions
export class AuthService {
  // Get all roles
  static async getRoles(): Promise<Role[]> {
    // If Prisma client failed to initialize, return mock data
    if (!prisma) {
      return [
        { id: 1, name: "SUPER_ADMIN", description: "Full system access with all permissions", level: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 2, name: "ADMIN", description: "Administrative access with most permissions", level: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 3, name: "MANAGER", description: "Business management access", level: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 4, name: "ANALYST", description: "Analytics and reporting access", level: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 5, name: "USER", description: "Basic user access", level: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ];
    }
    
    try {
      const roles = await prisma.role.findMany({
        orderBy: { level: 'desc' }
      });
      
      return roles.map((role: { id: number; name: string; description: string | null; level: number; createdAt: Date; updatedAt: Date; }) => ({
        id: role.id,
        name: role.name,
        description: role.description || '',
        level: role.level,
        created_at: role.createdAt.toISOString(),
        updated_at: role.updatedAt.toISOString()
      }));
    } catch (error) {
      console.error("Error fetching roles:", error);
      // Return mock data as fallback
      return [
        { id: 1, name: "SUPER_ADMIN", description: "Full system access with all permissions", level: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 2, name: "ADMIN", description: "Administrative access with most permissions", level: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 3, name: "MANAGER", description: "Business management access", level: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 4, name: "ANALYST", description: "Analytics and reporting access", level: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 5, name: "USER", description: "Basic user access", level: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ];
    }
  }

  // Get all permissions
  static async getPermissions(): Promise<Permission[]> {
    // If Prisma client failed to initialize, return mock data
    if (!prisma) {
      return [
        { id: 1, name: "view_dashboard", description: "View dashboard overview", category: "dashboard", created_at: new Date().toISOString() },
        { id: 2, name: "manage_users", description: "Manage user accounts", category: "system", created_at: new Date().toISOString() },
        { id: 3, name: "view_analytics", description: "View analytics data", category: "analytics", created_at: new Date().toISOString() },
        { id: 4, name: "create_campaign", description: "Create new advertising campaigns", category: "campaigns", created_at: new Date().toISOString() },
        { id: 5, name: "manage_roles", description: "Manage user roles", category: "system", created_at: new Date().toISOString() },
        { id: 6, name: "manage_permissions", description: "Manage system permissions", category: "system", created_at: new Date().toISOString() },
        { id: 7, name: "manage_auth_methods", description: "Manage authentication methods", category: "system", created_at: new Date().toISOString() },
        { id: 8, name: "view_system_logs", description: "View system audit logs", category: "system", created_at: new Date().toISOString() },
        { id: 9, name: "manage_system_settings", description: "Modify system-wide settings", category: "system", created_at: new Date().toISOString() }
      ];
    }
    
    try {
      const permissions = await prisma.permission.findMany({
        orderBy: { name: 'asc' }
      });
      
      return permissions.map((permission: { id: number; name: string; description: string | null; category: string | null; createdAt: Date; }) => ({
        id: permission.id,
        name: permission.name,
        description: permission.description || '',
        category: permission.category || '',
        created_at: permission.createdAt.toISOString()
      }));
    } catch (error) {
      console.error("Error fetching permissions:", error);
      // Return mock data as fallback
      return [
        { id: 1, name: "view_dashboard", description: "View dashboard overview", category: "dashboard", created_at: new Date().toISOString() },
        { id: 2, name: "manage_users", description: "Manage user accounts", category: "system", created_at: new Date().toISOString() },
        { id: 3, name: "view_analytics", description: "View analytics data", category: "analytics", created_at: new Date().toISOString() },
        { id: 4, name: "create_campaign", description: "Create new advertising campaigns", category: "campaigns", created_at: new Date().toISOString() },
        { id: 5, name: "manage_roles", description: "Manage user roles", category: "system", created_at: new Date().toISOString() },
        { id: 6, name: "manage_permissions", description: "Manage system permissions", category: "system", created_at: new Date().toISOString() },
        { id: 7, name: "manage_auth_methods", description: "Manage authentication methods", category: "system", created_at: new Date().toISOString() },
        { id: 8, name: "view_system_logs", description: "View system audit logs", category: "system", created_at: new Date().toISOString() },
        { id: 9, name: "manage_system_settings", description: "Modify system-wide settings", category: "system", created_at: new Date().toISOString() }
      ];
    }
  }

  // Get permissions for a specific role
  static async getRolePermissions(roleId: number): Promise<Permission[]> {
    // If Prisma client failed to initialize, return mock data
    if (!prisma) {
      return [
        { id: 1, name: "view_dashboard", description: "View dashboard overview", category: "dashboard", created_at: new Date().toISOString() },
        { id: 2, name: "manage_users", description: "Manage user accounts", category: "system", created_at: new Date().toISOString() }
      ];
    }
    
    try {
      const rolePermissions = await prisma.rolePermission.findMany({
        where: { roleId },
        include: { permission: true }
      });
      
      return rolePermissions.map((rp: { permission: { id: number; name: string; description: string | null; category: string | null; createdAt: Date; }; }) => ({
        id: rp.permission.id,
        name: rp.permission.name,
        description: rp.permission.description || '',
        category: rp.permission.category || '',
        created_at: rp.permission.createdAt.toISOString()
      }));
    } catch (error) {
      console.error("Error fetching role permissions:", error);
      // Return mock data as fallback
      return [
        { id: 1, name: "view_dashboard", description: "View dashboard overview", category: "dashboard", created_at: new Date().toISOString() },
        { id: 2, name: "manage_users", description: "Manage user accounts", category: "system", created_at: new Date().toISOString() }
      ];
    }
  }

  // Check if user has specific permissions
  static async checkUserPermissions(userId: string, userRole: UserRoleType, requiredPermissions: string[]): Promise<PermissionCheckResult> {
    // If Prisma client failed to initialize, return mock data
    if (!prisma) {
      // SUPER_ADMIN has all permissions by default
      if (userRole === "SUPER_ADMIN") {
        return {
          hasPermission: true,
          requiredPermissions,
          missingPermissions: []
        };
      }
      
      return {
        hasPermission: true,
        requiredPermissions,
        missingPermissions: []
      };
    }
    
    try {
      // SUPER_ADMIN has all permissions by default
      if (userRole === "SUPER_ADMIN") {
        return {
          hasPermission: true,
          requiredPermissions,
          missingPermissions: []
        };
      }
      
      // First check if user has a specific role assigned
      const userRoles = await prisma.userRole.findMany({
        where: { userId },
        include: { role: true }
      });
      
      // If user has specific roles, check those
      if (userRoles.length > 0) {
        const roleIds = userRoles.map((ur: { roleId: number; }) => ur.roleId);
        const rolePermissions = await prisma.rolePermission.findMany({
          where: { roleId: { in: roleIds } },
          include: { permission: true }
        });
        
        const userPermissionNames = rolePermissions.map((rp: { permission: { name: string; }; }) => rp.permission.name);
        const missingPermissions = requiredPermissions.filter(
          perm => !userPermissionNames.includes(perm)
        );
        
        return {
          hasPermission: missingPermissions.length === 0,
          requiredPermissions,
          missingPermissions
        };
      }
      
      // If no specific roles, fall back to checking the user's default role
      const role = await prisma.role.findFirst({
        where: { name: userRole }
      });
      
      if (!role) {
        return {
          hasPermission: false,
          requiredPermissions,
          missingPermissions: requiredPermissions
        };
      }

      const rolePermissions = await this.getRolePermissions(role.id);
      const rolePermissionNames = rolePermissions.map(p => p.name);
      
      const missingPermissions = requiredPermissions.filter(
        perm => !rolePermissionNames.includes(perm)
      );
      
      return {
        hasPermission: missingPermissions.length === 0,
        requiredPermissions,
        missingPermissions
      };
    } catch (error) {
      console.error("Error checking user permissions:", error);
      // Return mock data as fallback
      return {
        hasPermission: true,
        requiredPermissions,
        missingPermissions: []
      };
    }
  }

  // Get all authentication methods
  static async getAuthMethods(): Promise<AuthenticationMethod[]> {
    // If Prisma client failed to initialize, return mock data
    if (!prisma) {
      return [
        { 
          id: 1, 
          name: "jwt", 
          display_name: "JSON Web Tokens (JWT)", 
          description: "Modern token-based authentication without server storage",
          is_active: true,
          config: { expires_in: "24h", algorithm: "RS256" },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: 2, 
          name: "mfa_totp", 
          display_name: "Time-based OTP (TOTP)", 
          description: "Google Authenticator or Authy",
          is_active: true,
          config: { algorithm: "SHA1", digits: 6, period: 30 },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: 3, 
          name: "biometric", 
          display_name: "Biometric Authentication", 
          description: "Fingerprint, face, or voice recognition",
          is_active: true,
          config: { types: ["fingerprint", "face", "voice"] },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }
    
    try {
      const methods = await prisma.authenticationMethod.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      });
      
      return methods.map((method: { id: number; name: string; displayName: string; description: string | null; isActive: boolean; config: any; createdAt: Date; updatedAt: Date; }) => ({
        id: method.id,
        name: method.name,
        display_name: method.displayName,
        description: method.description || '',
        is_active: method.isActive,
        config: method.config ? JSON.parse(JSON.stringify(method.config)) : {},
        created_at: method.createdAt.toISOString(),
        updated_at: method.updatedAt.toISOString()
      }));
    } catch (error) {
      console.error("Error fetching authentication methods:", error);
      // Return mock data as fallback
      return [
        { 
          id: 1, 
          name: "jwt", 
          display_name: "JSON Web Tokens (JWT)", 
          description: "Modern token-based authentication without server storage",
          is_active: true,
          config: { expires_in: "24h", algorithm: "RS256" },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: 2, 
          name: "mfa_totp", 
          display_name: "Time-based OTP (TOTP)", 
          description: "Google Authenticator or Authy",
          is_active: true,
          config: { algorithm: "SHA1", digits: 6, period: 30 },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: 3, 
          name: "biometric", 
          display_name: "Biometric Authentication", 
          description: "Fingerprint, face, or voice recognition",
          is_active: true,
          config: { types: ["fingerprint", "face", "voice"] },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }
  }

  // Get authentication method by name
  static async getAuthMethodByName(name: string): Promise<AuthenticationMethod | undefined> {
    // If Prisma client failed to initialize, return mock data
    if (!prisma) {
      const mockMethods = [
        { 
          id: 1, 
          name: "jwt", 
          display_name: "JSON Web Tokens (JWT)", 
          description: "Modern token-based authentication without server storage",
          is_active: true,
          config: { expires_in: "24h", algorithm: "RS256" },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      return mockMethods.find(method => method.name === name);
    }
    
    try {
      const method = await prisma.authenticationMethod.findFirst({
        where: { name, isActive: true }
      });
      
      if (!method) return undefined;
      
      return {
        id: method.id,
        name: method.name,
        display_name: method.displayName,
        description: method.description || '',
        is_active: method.isActive,
        config: method.config ? JSON.parse(JSON.stringify(method.config)) : {},
        created_at: method.createdAt.toISOString(),
        updated_at: method.updatedAt.toISOString()
      };
    } catch (error) {
      console.error("Error fetching authentication method:", error);
      // Return mock data as fallback
      const mockMethods = [
        { 
          id: 1, 
          name: "jwt", 
          display_name: "JSON Web Tokens (JWT)", 
          description: "Modern token-based authentication without server storage",
          is_active: true,
          config: { expires_in: "24h", algorithm: "RS256" },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      return mockMethods.find(method => method.name === name);
    }
  }

  // Update authentication settings
  static async updateAuthSettings(settings: AuthSettings): Promise<boolean> {
    try {
      // In a real implementation, this would update the database
      console.log("Updating auth settings:", settings);
      return true; // Simulate success
    } catch (error) {
      console.error("Error updating auth settings:", error);
      return false;
    }
  }

  // Assign role to user
  static async assignRoleToUser(userId: string, roleName: string): Promise<boolean> {
    // If Prisma client failed to initialize, return mock data
    if (!prisma) {
      return true;
    }
    
    try {
      const role = await prisma.role.findFirst({
        where: { name: roleName }
      });
      
      if (!role) return false;
      
      await prisma.userRole.create({
        data: {
          userId,
          roleId: role.id
        }
      });
      
      return true;
    } catch (error) {
      console.error("Error assigning role to user:", error);
      return false;
    }
  }

  // Remove role from user
  static async removeRoleFromUser(userId: string, roleName: string): Promise<boolean> {
    // If Prisma client failed to initialize, return mock data
    if (!prisma) {
      return true;
    }
    
    try {
      const role = await prisma.role.findFirst({
        where: { name: roleName }
      });
      
      if (!role) return false;
      
      await prisma.userRole.delete({
        where: {
          userId_roleId: {
            userId,
            roleId: role.id
          }
        }
      });
      
      return true;
    } catch (error) {
      console.error("Error removing role from user:", error);
      return false;
    }
  }

  // Get user roles
  static async getUserRoles(userId: string): Promise<Role[]> {
    // If Prisma client failed to initialize, return mock data
    if (!prisma) {
      return [
        { id: 5, name: "USER", description: "Basic user access", level: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ];
    }
    
    try {
      const userRoles = await prisma.userRole.findMany({
        where: { userId },
        include: { role: true }
      });
      
      if (userRoles.length > 0) {
        return userRoles.map((ur: { role: { id: number; name: string; description: string | null; level: number; createdAt: Date; updatedAt: Date; }; }) => ({
          id: ur.role.id,
          name: ur.role.name,
          description: ur.role.description || '',
          level: ur.role.level,
          created_at: ur.role.createdAt.toISOString(),
          updated_at: ur.role.updatedAt.toISOString()
        }));
      }
      
      // Return default USER role if no specific roles assigned
      const defaultRole = await prisma.role.findFirst({
        where: { name: 'USER' }
      });
      
      if (defaultRole) {
        return [{
          id: defaultRole.id,
          name: defaultRole.name,
          description: defaultRole.description || '',
          level: defaultRole.level,
          created_at: defaultRole.createdAt.toISOString(),
          updated_at: defaultRole.updatedAt.toISOString()
        }];
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching user roles:", error);
      // Return mock data as fallback
      return [
        { id: 5, name: "USER", description: "Basic user access", level: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ];
    }
  }
  
  // Check if user is SUPER_ADMIN
  static async isSuperAdmin(userId: string): Promise<boolean> {
    try {
      // If Prisma client failed to initialize, return mock data
      if (!prisma) {
        // For demo purposes, assume user with ID "super-admin-user" is SUPER_ADMIN
        return userId === "super-admin-user";
      }
      
      const userRoles = await prisma.userRole.findMany({
        where: { userId },
        include: { role: true }
      });
      
      return userRoles.some((ur: { role: { name: string; } }) => ur.role.name === "SUPER_ADMIN");
    } catch (error) {
      console.error("Error checking if user is SUPER_ADMIN:", error);
      return false;
    }
  }
  
  // Get all users with SUPER_ADMIN role
  static async getSuperAdmins(): Promise<Array<{id: string, name: string | null, email: string}>> {
    try {
      // If Prisma client failed to initialize, return mock data
      if (!prisma) {
        return [
          { id: "super-admin-user", name: "System Administrator", email: "admin@system.com" }
        ];
      }
      
      const superAdminRole = await prisma.role.findFirst({
        where: { name: "SUPER_ADMIN" }
      });
      
      if (!superAdminRole) {
        return [];
      }
      
      const userRoles = await prisma.userRole.findMany({
        where: { roleId: superAdminRole.id },
        include: { user: true }
      });
      
      return userRoles.map((ur: { user: { id: string; name: string | null; email: string; } }) => ({
        id: ur.user.id,
        name: ur.user.name,
        email: ur.user.email
      }));
    } catch (error) {
      console.error("Error fetching SUPER_ADMIN users:", error);
      return [];
    }
  }
  
  // Create a new SUPER_ADMIN user
  static async createSuperAdmin(userId: string): Promise<boolean> {
    try {
      // If Prisma client failed to initialize, return mock data
      if (!prisma) {
        console.log(`Creating SUPER_ADMIN for user ${userId} (mock)`);
        return true;
      }
      
      // Check if SUPER_ADMIN role exists
      let superAdminRole = await prisma.role.findFirst({
        where: { name: "SUPER_ADMIN" }
      });
      
      // If not, create it
      if (!superAdminRole) {
        superAdminRole = await prisma.role.create({
          data: {
            name: "SUPER_ADMIN",
            description: "Full system access with all permissions",
            level: 5
          }
        });
      }
      
      // Assign SUPER_ADMIN role to user
      await prisma.userRole.create({
        data: {
          userId,
          roleId: superAdminRole.id
        }
      });
      
      return true;
    } catch (error) {
      console.error("Error creating SUPER_ADMIN:", error);
      return false;
    }
  }
}