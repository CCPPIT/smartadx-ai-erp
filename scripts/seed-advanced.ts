import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  try {
    // Get existing users
    const users = await prisma.user.findMany()
    if (users.length === 0) {
      console.log('No users found. Please run the basic seed first.')
      return
    }
    
    const adminUser = users[0]
    
    // Create sample posts
    const post1 = await prisma.post.create({
      data: {
        content: 'Check out our new summer sale! 50% off on all products.',
        platform: 'facebook',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        userId: adminUser.id,
      },
    })
    
    const post2 = await prisma.post.create({
      data: {
        content: 'New product launch coming soon! Stay tuned for exciting updates.',
        platform: 'twitter',
        status: 'DRAFT',
        userId: adminUser.id,
      },
    })
    
    console.log('Created posts:', [post1, post2])
    
    // Create sample notifications
    const notification1 = await prisma.notification.create({
      data: {
        title: 'New Campaign Created',
        message: 'Your summer sale campaign has been successfully created.',
        type: 'success',
        priority: 1,
        userId: adminUser.id,
      },
    })
    
    const notification2 = await prisma.notification.create({
      data: {
        title: 'Analytics Update',
        message: 'Your campaign analytics have been updated.',
        type: 'info',
        priority: 0,
        userId: adminUser.id,
      },
    })
    
    console.log('Created notifications:', [notification1, notification2])
    
    // Create sample AI chat
    const aiChat = await prisma.aIChat.create({
      data: {
        title: 'Marketing Strategy Discussion',
        userId: adminUser.id,
      },
    })
    
    // Add messages to the AI chat
    const message1 = await prisma.aIChatMessage.create({
      data: {
        content: 'Can you help me create a marketing strategy for our new product?',
        role: 'user',
        chatId: aiChat.id,
      },
    })
    
    const message2 = await prisma.aIChatMessage.create({
      data: {
        content: 'Sure! I recommend focusing on social media advertising and email campaigns.',
        role: 'assistant',
        chatId: aiChat.id,
      },
    })
    
    console.log('Created AI chat:', aiChat)
    console.log('Created AI chat messages:', [message1, message2])
    
    // Create sample user preference
    const userPreference = await prisma.userPreference.create({
      data: {
        userId: adminUser.id,
        theme: 'dark',
        language: 'en',
        timezone: 'UTC',
        notifications: true,
        emailNotifications: true,
      },
    })
    
    console.log('Created user preference:', userPreference)
    
    // Create sample reward
    const reward = await prisma.reward.create({
      data: {
        title: 'Early Bird Special',
        description: 'Get 20% off for early adoption of our new features',
        points: 100,
        userId: adminUser.id,
      },
    })
    
    console.log('Created reward:', reward)
    
    // Create sample AI generated content
    const aiContent = await prisma.aIGeneratedContent.create({
      data: {
        type: 'ad',
        prompt: 'Create an advertisement for a summer sale',
        content: 'Beat the heat with our amazing summer sale! Up to 70% off on selected items. Limited time offer!',
        userId: adminUser.id,
      },
    })
    
    console.log('Created AI generated content:', aiContent)
    
    // Create sample social media integration
    const socialMediaIntegration = await prisma.socialMediaIntegration.create({
      data: {
        platform: 'facebook',
        accessToken: 'fake_access_token_12345',
        userId: adminUser.id,
      },
    })
    
    console.log('Created social media integration:', socialMediaIntegration)
    
    // Create sample report
    const report = await prisma.report.create({
      data: {
        title: 'Monthly Campaign Performance',
        type: 'campaign_performance',
        format: 'PDF',
        userId: adminUser.id,
        filters: JSON.stringify({ dateRange: 'last_30_days' }),
      },
    })
    
    console.log('Created report:', report)
    
    console.log('Advanced database seeding completed successfully!')
  } catch (error) {
    console.error('Error seeding advanced database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seed()