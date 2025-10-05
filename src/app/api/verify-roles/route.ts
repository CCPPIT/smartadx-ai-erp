import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get all roles
    const roles = await prisma.role.findMany({
      orderBy: { level: 'desc' }
    });

    // Get all permissions
    const permissions = await prisma.permission.findMany({
      orderBy: { name: 'asc' }
    });

    // Get role-permission mappings for SUPER_ADMIN
    const superAdminRole = await prisma.role.findFirst({
      where: { name: 'SUPER_ADMIN' }
    });

    let superAdminPermissions = [];
    if (superAdminRole) {
      const rolePermissions = await prisma.rolePermission.findMany({
        where: { roleId: superAdminRole.id },
        include: { permission: true }
      });
      superAdminPermissions = rolePermissions.map(rp => rp.permission);
    }

    // Get role-permission mappings for ADMIN
    const adminRole = await prisma.role.findFirst({
      where: { name: 'ADMIN' }
    });

    let adminPermissions = [];
    if (adminRole) {
      const rolePermissions = await prisma.rolePermission.findMany({
        where: { roleId: adminRole.id },
        include: { permission: true }
      });
      adminPermissions = rolePermissions.map(rp => rp.permission);
    }

    // Get authentication methods
    const authMethods = await prisma.authenticationMethod.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: {
        roles: roles.map(role => ({
          id: role.id,
          name: role.name,
          description: role.description,
          level: role.level
        })),
        permissions: permissions.slice(0, 5), // First 5 permissions
        superAdminPermissions: superAdminPermissions.slice(0, 5), // First 5 SUPER_ADMIN permissions
        adminPermissions: adminPermissions.slice(0, 5), // First 5 ADMIN permissions
        authMethods: authMethods.map(method => ({
          id: method.id,
          name: method.name,
          displayName: method.displayName,
          description: method.description
        }))
      }
    });
  } catch (error) {
    console.error("Error verifying roles:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to verify roles",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}