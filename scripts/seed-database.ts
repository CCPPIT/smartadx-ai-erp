import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  try {
    // Clear existing data
    await prisma.analytics.deleteMany()
    await prisma.ad.deleteMany()
    await prisma.campaign.deleteMany()
    await prisma.client.deleteMany()
    await prisma.user.deleteMany()
    
    // Create sample users
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@smartadx.com',
        name: 'Admin User',
        role: 'ADMIN',
      },
    })
    
    const regularUser = await prisma.user.create({
      data: {
        email: 'user@smartadx.com',
        name: 'Regular User',
        role: 'USER',
      },
    })
    
    console.log('Created users:', [adminUser, regularUser])
    
    // Create sample clients
    const client1 = await prisma.client.create({
      data: {
        name: 'Tech Solutions Inc.',
        email: 'contact@techsolutions.com',
        phone: '+1234567890',
        company: 'Tech Solutions Inc.',
      },
    })
    
    const client2 = await prisma.client.create({
      data: {
        name: 'Marketing Pro LLC',
        email: 'info@marketingpro.com',
        phone: '+0987654321',
        company: 'Marketing Pro LLC',
      },
    })
    
    console.log('Created clients:', [client1, client2])
    
    // Create sample campaigns
    const campaign1 = await prisma.campaign.create({
      data: {
        name: 'Summer Sale Campaign',
        description: 'Promotion for summer sale event',
        status: 'ACTIVE',
        budget: 5000.00,
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-08-31'),
        userId: adminUser.id,
      },
    })
    
    const campaign2 = await prisma.campaign.create({
      data: {
        name: 'New Product Launch',
        description: 'Launch campaign for new product line',
        status: 'DRAFT',
        budget: 10000.00,
        userId: regularUser.id,
      },
    })
    
    const campaign3 = await prisma.campaign.create({
      data: {
        name: 'Holiday Specials',
        description: 'Holiday season promotional campaign',
        status: 'PAUSED',
        budget: 7500.00,
        startDate: new Date('2025-11-01'),
        endDate: new Date('2025-12-31'),
        userId: adminUser.id,
      },
    })
    
    console.log('Created campaigns:', [campaign1, campaign2, campaign3])
    
    // Create sample ads
    const ad1 = await prisma.ad.create({
      data: {
        title: 'Summer Sale Banner',
        content: '50% off on all products this summer!',
        campaignId: campaign1.id,
        status: 'ACTIVE',
      },
    })
    
    const ad2 = await prisma.ad.create({
      data: {
        title: 'New Product Teaser',
        content: 'Coming soon: Revolutionary new product line',
        campaignId: campaign2.id,
        status: 'ACTIVE',
      },
    })
    
    console.log('Created ads:', [ad1, ad2])
    
    // Create sample analytics
    const analytics1 = await prisma.analytics.create({
      data: {
        campaignId: campaign1.id,
        clicks: 1250,
        impressions: 15000,
        conversions: 85,
        revenue: 25000.00,
        date: new Date(),
      },
    })
    
    const analytics2 = await prisma.analytics.create({
      data: {
        campaignId: campaign3.id,
        clicks: 890,
        impressions: 12000,
        conversions: 42,
        revenue: 18500.00,
        date: new Date(),
      },
    })
    
    console.log('Created analytics:', [analytics1, analytics2])
    
    console.log('Database seeding completed successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seed()