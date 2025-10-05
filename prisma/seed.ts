import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create default roles if they don't exist
  const roles = [
    { name: 'SUPER_ADMIN', description: 'Full system access with all permissions', level: 5 },
    { name: 'ADMIN', description: 'Administrative access with most permissions', level: 4 },
    { name: 'MANAGER', description: 'Business management access', level: 3 },
    { name: 'ANALYST', description: 'Analytics and reporting access', level: 2 },
    { name: 'USER', description: 'Basic user access', level: 1 }
  ];

  for (const roleData of roles) {
    const existingRole = await prisma.role.findFirst({
      where: { name: roleData.name }
    });

    if (!existingRole) {
      await prisma.role.create({
        data: roleData
      });
      console.log(`Created role: ${roleData.name}`);
    } else {
      console.log(`Role already exists: ${roleData.name}`);
    }
  }

  // Create default permissions if they don't exist
  const permissions = [
    // Dashboard permissions
    { name: 'view_dashboard', description: 'View dashboard overview', category: 'dashboard' },
    { name: 'view_analytics', description: 'View analytics data', category: 'analytics' },
    { name: 'view_reports', description: 'View system reports', category: 'reports' },
    
    // Campaign permissions
    { name: 'create_campaign', description: 'Create new advertising campaigns', category: 'campaigns' },
    { name: 'edit_campaign', description: 'Edit existing campaigns', category: 'campaigns' },
    { name: 'delete_campaign', description: 'Delete campaigns', category: 'campaigns' },
    { name: 'view_campaigns', description: 'View all campaigns', category: 'campaigns' },
    
    // Client permissions
    { name: 'manage_clients', description: 'Manage client accounts', category: 'clients' },
    { name: 'view_clients', description: 'View client information', category: 'clients' },
    
    // AI permissions
    { name: 'use_ai_tools', description: 'Access AI-powered tools', category: 'ai' },
    { name: 'generate_ai_content', description: 'Generate AI content', category: 'ai' },
    { name: 'view_ai_insights', description: 'View AI-generated insights', category: 'ai' },
    
    // Design permissions
    { name: 'use_design_studio', description: 'Access design studio', category: 'design' },
    { name: 'create_designs', description: 'Create new designs', category: 'design' },
    { name: 'edit_designs', description: 'Edit existing designs', category: 'design' },
    
    // System permissions
    { name: 'manage_users', description: 'Manage user accounts', category: 'system' },
    { name: 'manage_roles', description: 'Manage user roles', category: 'system' },
    { name: 'manage_permissions', description: 'Manage system permissions', category: 'system' },
    { name: 'view_system_status', description: 'View system status and health', category: 'system' },
    { name: 'manage_settings', description: 'Modify system settings', category: 'system' },
    
    // Financial permissions
    { name: 'view_billing', description: 'View billing information', category: 'billing' },
    { name: 'manage_payments', description: 'Manage payments', category: 'billing' },
    
    // Notification permissions
    { name: 'manage_notifications', description: 'Manage notification settings', category: 'notifications' },
    { name: 'send_notifications', description: 'Send system notifications', category: 'notifications' },
    
    // Authentication permissions
    { name: 'manage_auth_methods', description: 'Manage authentication methods', category: 'system' },
    { name: 'view_system_logs', description: 'View system audit logs', category: 'system' },
    { name: 'manage_system_settings', description: 'Modify system-wide settings', category: 'system' }
  ];

  for (const permData of permissions) {
    const existingPerm = await prisma.permission.findFirst({
      where: { name: permData.name }
    });

    if (!existingPerm) {
      await prisma.permission.create({
        data: permData
      });
      console.log(`Created permission: ${permData.name}`);
    } else {
      console.log(`Permission already exists: ${permData.name}`);
    }
  }

  // Create role-permission mappings
  const superAdminRole = await prisma.role.findFirst({ where: { name: 'SUPER_ADMIN' } });
  const adminRole = await prisma.role.findFirst({ where: { name: 'ADMIN' } });
  const managerRole = await prisma.role.findFirst({ where: { name: 'MANAGER' } });
  const analystRole = await prisma.role.findFirst({ where: { name: 'ANALYST' } });
  const userRole = await prisma.role.findFirst({ where: { name: 'USER' } });

  if (superAdminRole) {
    // SUPER_ADMIN gets all permissions
    const allPermissions = await prisma.permission.findMany();
    for (const perm of allPermissions) {
      const existing = await prisma.rolePermission.findFirst({
        where: {
          roleId: superAdminRole.id,
          permissionId: perm.id
        }
      });
      
      if (!existing) {
        await prisma.rolePermission.create({
          data: {
            roleId: superAdminRole.id,
            permissionId: perm.id
          }
        });
      }
    }
    console.log('Assigned all permissions to SUPER_ADMIN');
  }

  if (adminRole) {
    // ADMIN gets most permissions
    const adminPermissions = await prisma.permission.findMany({
      where: {
        OR: [
          { category: 'dashboard' },
          { category: 'analytics' },
          { category: 'reports' },
          { category: 'campaigns' },
          { category: 'clients' },
          { category: 'ai' },
          { category: 'design' },
          { category: 'system' },
          { category: 'billing' },
          { category: 'notifications' }
        ]
      }
    });
    
    for (const perm of adminPermissions) {
      const existing = await prisma.rolePermission.findFirst({
        where: {
          roleId: adminRole.id,
          permissionId: perm.id
        }
      });
      
      if (!existing) {
        await prisma.rolePermission.create({
          data: {
            roleId: adminRole.id,
            permissionId: perm.id
          }
        });
      }
    }
    console.log('Assigned permissions to ADMIN');
  }

  if (managerRole) {
    // MANAGER gets business-related permissions
    const managerPermissions = await prisma.permission.findMany({
      where: {
        OR: [
          { category: 'dashboard' },
          { category: 'analytics' },
          { category: 'reports' },
          { category: 'campaigns' },
          { category: 'clients' },
          { category: 'ai' },
          { category: 'design' }
        ]
      }
    });
    
    for (const perm of managerPermissions) {
      const existing = await prisma.rolePermission.findFirst({
        where: {
          roleId: managerRole.id,
          permissionId: perm.id
        }
      });
      
      if (!existing) {
        await prisma.rolePermission.create({
          data: {
            roleId: managerRole.id,
            permissionId: perm.id
          }
        });
      }
    }
    console.log('Assigned permissions to MANAGER');
  }

  if (analystRole) {
    // ANALYST gets read-only permissions
    const analystPermissions = await prisma.permission.findMany({
      where: {
        OR: [
          { category: 'dashboard' },
          { category: 'analytics' },
          { category: 'reports' }
        ]
      }
    });
    
    for (const perm of analystPermissions) {
      const existing = await prisma.rolePermission.findFirst({
        where: {
          roleId: analystRole.id,
          permissionId: perm.id
        }
      });
      
      if (!existing) {
        await prisma.rolePermission.create({
          data: {
            roleId: analystRole.id,
            permissionId: perm.id
          }
        });
      }
    }
    console.log('Assigned permissions to ANALYST');
  }

  if (userRole) {
    // USER gets basic permissions
    const userPermissions = await prisma.permission.findMany({
      where: {
        name: 'view_dashboard'
      }
    });
    
    for (const perm of userPermissions) {
      const existing = await prisma.rolePermission.findFirst({
        where: {
          roleId: userRole.id,
          permissionId: perm.id
        }
      });
      
      if (!existing) {
        await prisma.rolePermission.create({
          data: {
            roleId: userRole.id,
            permissionId: perm.id
          }
        });
      }
    }
    console.log('Assigned permissions to USER');
  }

  // Create authentication methods if they don't exist
  const authMethods = [
    {
      name: 'jwt',
      displayName: 'JSON Web Tokens (JWT)',
      description: 'Modern token-based authentication without server storage',
      config: JSON.stringify({ expires_in: '24h', algorithm: 'RS256' }),
    },
    {
      name: 'mfa_totp',
      displayName: 'Time-based OTP (TOTP)',
      description: 'Google Authenticator or Authy',
      config: JSON.stringify({ algorithm: 'SHA1', digits: 6, period: 30 }),
    },
    {
      name: 'biometric',
      displayName: 'Biometric Authentication',
      description: 'Fingerprint, face, or voice recognition',
      config: JSON.stringify({ types: ['fingerprint', 'face', 'voice'] }),
    },
    {
      name: 'passwordless',
      displayName: 'Passwordless Authentication',
      description: 'Magic links and one-time codes',
      config: JSON.stringify({ methods: ['magic_link', 'email_otp'] }),
    },
    {
      name: 'social_auth',
      displayName: 'Social Authentication',
      description: 'Google, Facebook, GitHub login',
      config: JSON.stringify({ providers: ['google', 'facebook', 'github'] }),
    },
    {
      name: 'enterprise_saml',
      displayName: 'SAML Authentication',
      description: 'Enterprise SSO with SAML',
      config: JSON.stringify({ binding: 'post', signature_algorithm: 'rsa-sha256' }),
    }
  ];

  for (const methodData of authMethods) {
    const existingMethod = await prisma.authenticationMethod.findFirst({
      where: { name: methodData.name }
    });

    if (!existingMethod) {
      await prisma.authenticationMethod.create({
        data: methodData
      });
      console.log(`Created auth method: ${methodData.name}`);
    } else {
      console.log(`Auth method already exists: ${methodData.name}`);
    }
  }

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })