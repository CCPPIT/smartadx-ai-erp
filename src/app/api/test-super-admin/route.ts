import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth-service';

export async function GET() {
  try {
    // Test fetching roles
    const roles = await AuthService.getRoles();
    
    // Test fetching permissions
    const permissions = await AuthService.getPermissions();
    
    // Test fetching auth methods
    const authMethods = await AuthService.getAuthMethods();
    
    // Test checking if a user is SUPER_ADMIN (mock user)
    const isSuperAdmin = await AuthService.isSuperAdmin("super-admin-user");
    
    // Test fetching all SUPER_ADMIN users
    const superAdmins = await AuthService.getSuperAdmins();
    
    return NextResponse.json({
      success: true,
      data: {
        roles: roles.slice(0, 3), // Return first 3 roles
        permissions: permissions.slice(0, 3), // Return first 3 permissions
        authMethods: authMethods.slice(0, 3), // Return first 3 auth methods
        isSuperAdmin,
        superAdmins,
        message: "Super Admin authentication system is working correctly"
      }
    });
  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to test Super Admin authentication system",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}