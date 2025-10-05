// Client-side Authentication Service
// This service uses API calls instead of direct database access
import { 
  Role, 
  Permission, 
  AuthenticationMethod, 
  AuthSettings,
  PermissionCheckResult,
  UserRoleType
} from "../types/auth-types";

// Client-side service functions
export class AuthServiceClient {
  // Base API URL - in a real app, this would come from environment variables
  private static BASE_URL = typeof window !== 'undefined' ? '' : 'http://localhost:3000';

  // Get all roles
  static async getRoles(): Promise<Role[]> {
    try {
      // In a real implementation, this would call your API
      // For now, we'll return mock data
      return [
        { id: 1, name: "SUPER_ADMIN", description: "Full system access with all permissions", level: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 2, name: "ADMIN", description: "Administrative access with most permissions", level: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 3, name: "MANAGER", description: "Business management access", level: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 4, name: "ANALYST", description: "Analytics and reporting access", level: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 5, name: "USER", description: "Basic user access", level: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ];
    } catch (error) {
      console.error("Error fetching roles:", error);
      return [];
    }
  }

  // Get all permissions
  static async getPermissions(): Promise<Permission[]> {
    try {
      // In a real implementation, this would call your API
      // For now, we'll return mock data
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
    } catch (error) {
      console.error("Error fetching permissions:", error);
      return [];
    }
  }

  // Get permissions for a specific role
  static async getRolePermissions(roleId: number): Promise<Permission[]> {
    try {
      // In a real implementation, this would call your API
      // For now, we'll return mock data based on role ID
      switch (roleId) {
        case 1: // SUPER_ADMIN
          // SUPER_ADMIN has all permissions
          return await this.getPermissions();
        case 2: // ADMIN
          // ADMIN has most permissions except system-level ones
          return (await this.getPermissions()).filter(p => 
            !["manage_system_settings", "view_system_logs"].includes(p.name)
          );
        case 3: // MANAGER
          // MANAGER has business-related permissions
          return (await this.getPermissions()).filter(p => 
            ["view_dashboard", "view_analytics", "create_campaign", "manage_users"].includes(p.name)
          );
        case 4: // ANALYST
          // ANALYST has read-only permissions
          return (await this.getPermissions()).filter(p => 
            ["view_dashboard", "view_analytics"].includes(p.name)
          );
        case 5: // USER
          // USER has basic permissions
          return (await this.getPermissions()).filter(p => 
            ["view_dashboard"].includes(p.name)
          );
        default:
          return [];
      }
    } catch (error) {
      console.error("Error fetching role permissions:", error);
      return [];
    }
  }

  // Check if user has specific permissions
  static async checkUserPermissions(userId: string, userRole: UserRoleType, requiredPermissions: string[]): Promise<PermissionCheckResult> {
    try {
      // In a real implementation, this would call your API
      // For now, we'll return mock data based on user role
      
      // SUPER_ADMIN has all permissions by default
      if (userRole === "SUPER_ADMIN") {
        return {
          hasPermission: true,
          requiredPermissions,
          missingPermissions: []
        };
      }
      
      // Get the role ID based on role name
      const roles = await this.getRoles();
      const role = roles.find(r => r.name === userRole);
      
      if (!role) {
        return {
          hasPermission: false,
          requiredPermissions,
          missingPermissions: requiredPermissions
        };
      }
      
      // Get permissions for this role
      const rolePermissions = await this.getRolePermissions(role.id);
      const rolePermissionNames = rolePermissions.map(p => p.name);
      
      // Check which permissions are missing
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
      // Fail-safe: allow access if there's an error
      return {
        hasPermission: true,
        requiredPermissions,
        missingPermissions: []
      };
    }
  }

  // Get all authentication methods
  static async getAuthMethods(): Promise<AuthenticationMethod[]> {
    try {
      // In a real implementation, this would call your API
      // For now, we'll return mock data
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
        },
        { 
          id: 4, 
          name: "passwordless", 
          display_name: "Passwordless Authentication", 
          description: "Magic links and one-time codes",
          is_active: true,
          config: { methods: ["magic_link", "email_otp"] },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: 5, 
          name: "social_auth", 
          display_name: "Social Authentication", 
          description: "Google, Facebook, GitHub login",
          is_active: true,
          config: { providers: ["google", "facebook", "github"] },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: 6, 
          name: "enterprise_saml", 
          display_name: "SAML Authentication", 
          description: "Enterprise SSO with SAML",
          is_active: true,
          config: { binding: "post", signature_algorithm: "rsa-sha256" },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error("Error fetching authentication methods:", error);
      return [];
    }
  }

  // Get authentication method by name
  static async getAuthMethodByName(name: string): Promise<AuthenticationMethod | undefined> {
    try {
      // In a real implementation, this would call your API
      // For now, we'll return mock data
      const mockMethods = await this.getAuthMethods();
      return mockMethods.find(method => method.name === name);
    } catch (error) {
      console.error("Error fetching authentication method:", error);
      return undefined;
    }
  }

  // Update authentication settings
  static async updateAuthSettings(settings: AuthSettings): Promise<boolean> {
    try {
      // In a real implementation, this would call your API
      console.log("Updating auth settings:", settings);
      return true; // Simulate success
    } catch (error) {
      console.error("Error updating auth settings:", error);
      return false;
    }
  }

  // Assign role to user
  static async assignRoleToUser(userId: string, roleName: string): Promise<boolean> {
    try {
      // In a real implementation, this would call your API
      console.log(`Assigning role ${roleName} to user ${userId}`);
      
      // SUPER_ADMIN can assign any role
      // Other roles have restrictions
      return true; // Simulate success
    } catch (error) {
      console.error("Error assigning role to user:", error);
      return false;
    }
  }

  // Remove role from user
  static async removeRoleFromUser(userId: string, roleName: string): Promise<boolean> {
    try {
      // In a real implementation, this would call your API
      console.log(`Removing role ${roleName} from user ${userId}`);
      
      // SUPER_ADMIN can remove any role
      // Other roles have restrictions
      return true; // Simulate success
    } catch (error) {
      console.error("Error removing role from user:", error);
      return false;
    }
  }

  // Get user roles
  static async getUserRoles(userId: string): Promise<Role[]> {
    try {
      // In a real implementation, this would call your API
      // For now, we'll return mock data
      // In a real app, this would depend on the actual user
      const roles = await this.getRoles();
      
      // For demonstration, we'll return SUPER_ADMIN for a specific user ID
      // In a real app, this would come from the database
      if (userId === "super-admin-user") {
        return roles.filter(role => role.name === "SUPER_ADMIN");
      }
      
      // Default user role
      return roles.filter(role => role.name === "USER");
    } catch (error) {
      console.error("Error fetching user roles:", error);
      return [];
    }
  }
  
  // Check if user is SUPER_ADMIN
  static async isSuperAdmin(userId: string): Promise<boolean> {
    try {
      const userRoles = await this.getUserRoles(userId);
      return userRoles.some(role => role.name === "SUPER_ADMIN");
    } catch (error) {
      console.error("Error checking if user is SUPER_ADMIN:", error);
      return false;
    }
  }
  
  // Get all users with SUPER_ADMIN role (simplified for client-side)
  static async getSuperAdmins(): Promise<Array<{id: string, name: string, email: string}>> {
    try {
      // In a real implementation, this would call your API
      // For now, we'll return mock data
      return [
        { id: "super-admin-user", name: "System Administrator", email: "admin@system.com" }
      ];
    } catch (error) {
      console.error("Error fetching SUPER_ADMIN users:", error);
      return [];
    }
  }
}