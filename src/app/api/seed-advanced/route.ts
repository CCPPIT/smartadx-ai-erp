import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Get existing users
    const users = await prisma.user.findMany()
    if (users.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No users found. Please run the basic seed first.'
      }, { status: 400 })
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
    
    // Create sample reward
    const reward = await prisma.reward.create({
      data: {
        title: 'Early Bird Special',
        description: 'Get 20% off for early adoption of our new features',
        points: 100,
        userId: adminUser.id,
      },
    })
    
    // Create sample AI generated content
    const aiContent = await prisma.aIGeneratedContent.create({
      data: {
        type: 'ad',
        prompt: 'Create an advertisement for a summer sale',
        content: 'Beat the heat with our amazing summer sale! Up to 70% off on selected items. Limited time offer!',
        userId: adminUser.id,
      },
    })
    
    // Create sample social media integration
    const socialMediaIntegration = await prisma.socialMediaIntegration.create({
      data: {
        platform: 'facebook',
        accessToken: 'fake_access_token_12345',
        userId: adminUser.id,
      },
    })
    
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
    
    return NextResponse.json({
      success: true,
      message: 'Advanced database seeding completed successfully!',
      data: {
        posts: [post1, post2],
        notifications: [notification1, notification2],
        aiChat: { ...aiChat, messages: [message1, message2] },
        userPreference,
        reward,
        aiContent,
        socialMediaIntegration,
        report
      }
    })
  } catch (error) {
    console.error('Error seeding advanced database:', error)
    return NextResponse.json({
      success: false,
      message: 'Error seeding advanced database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}