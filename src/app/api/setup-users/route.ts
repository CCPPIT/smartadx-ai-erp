import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Check if users already exist
    const existingUsers = await prisma.user.findMany({
      where: {
        email: {
          in: [
            'superadmin@smartadx.com',
            'admin@smartadx.com',
            'manager@smartadx.com'
          ]
        }
      }
    });

    if (existingUsers.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Users already exist. Skipping setup."
      });
    }

    // Create users with different roles
    const superAdminUser = await prisma.user.create({
      data: {
        email: 'superadmin@smartadx.com',
        name: 'Super Administrator',
        role: 'USER', // We'll assign the SUPER_ADMIN role via UserRole table
      }
    });

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@smartadx.com',
        name: 'Administrator',
        role: 'USER', // We'll assign the ADMIN role via UserRole table
      }
    });

    const managerUser = await prisma.user.create({
      data: {
        email: 'manager@smartadx.com',
        name: 'Manager',
        role: 'USER', // We'll assign the MANAGER role via UserRole table
      }
    });

    // Get roles
    const superAdminRole = await prisma.role.findFirst({
      where: { name: 'SUPER_ADMIN' }
    });

    const adminRole = await prisma.role.findFirst({
      where: { name: 'ADMIN' }
    });

    const managerRole = await prisma.role.findFirst({
      where: { name: 'MANAGER' }
    });

    // Assign roles to users
    if (superAdminRole) {
      await prisma.userRole.create({
        data: {
          userId: superAdminUser.id,
          roleId: superAdminRole.id
        }
      });
    }

    if (adminRole) {
      await prisma.userRole.create({
        data: {
          userId: adminUser.id,
          roleId: adminRole.id
        }
      });
    }

    if (managerRole) {
      await prisma.userRole.create({
        data: {
          userId: managerUser.id,
          roleId: managerRole.id
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: "Users created successfully",
      users: [
        { id: superAdminUser.id, email: superAdminUser.email, name: superAdminUser.name, role: 'SUPER_ADMIN' },
        { id: adminUser.id, email: adminUser.email, name: adminUser.name, role: 'ADMIN' },
        { id: managerUser.id, email: managerUser.email, name: managerUser.name, role: 'MANAGER' }
      ]
    });
  } catch (error) {
    console.error("Error setting up users:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to set up users",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}