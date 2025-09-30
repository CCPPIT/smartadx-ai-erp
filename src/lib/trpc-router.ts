import { router } from './trpc'
import { campaignRouter } from '@/app/api/trpc/routers/campaigns'
import { analyticsRouter } from '@/app/api/trpc/routers/analytics'
import { clientRouter } from '@/app/api/trpc/routers/clients'
import { postRouter } from '@/app/api/trpc/routers/posts'
import { notificationRouter } from '@/app/api/trpc/routers/notifications'
import { aiChatRouter } from '@/app/api/trpc/routers/aiChats'
import { invoiceRouter } from '@/app/api/trpc/routers/invoices'
import { paymentRouter } from '@/app/api/trpc/routers/payments'
import { userPreferenceRouter } from '@/app/api/trpc/routers/userPreferences'
import { reportRouter } from '@/app/api/trpc/routers/reports'
import { rewardRouter } from '@/app/api/trpc/routers/rewards'
import { aiGeneratedContentRouter } from '@/app/api/trpc/routers/aiGeneratedContents'
import { socialMediaIntegrationRouter } from '@/app/api/trpc/routers/socialMediaIntegrations'
import { automationRouter } from '@/app/api/trpc/routers/automation'
import { designRouter } from '@/app/api/trpc/routers/design'
import { marketTrendRouter } from '@/app/api/trpc/routers/marketTrends'
import { competitorAnalysisRouter } from '@/app/api/trpc/routers/competitorAnalysis'
import { smartTargetingRouter } from '@/app/api/trpc/routers/smartTargeting'
import { aiCopywritingRouter } from '@/app/api/trpc/routers/aiCopywriting'
import { aiAdRouter } from '@/app/api/trpc/routers/aiAds'

export const appRouter = router({
  campaign: campaignRouter,
  analytics: analyticsRouter,
  client: clientRouter,
  post: postRouter,
  notification: notificationRouter,
  aiChat: aiChatRouter,
  invoice: invoiceRouter,
  payment: paymentRouter,
  userPreference: userPreferenceRouter,
  report: reportRouter,
  reward: rewardRouter,
  aiGeneratedContent: aiGeneratedContentRouter,
  socialMediaIntegration: socialMediaIntegrationRouter,
  automation: automationRouter,
  design: designRouter,
  marketTrend: marketTrendRouter,
  competitorAnalysis: competitorAnalysisRouter,
  smartTargeting: smartTargetingRouter,
  aiCopywriting: aiCopywritingRouter,
  aiAd: aiAdRouter,
})

export type AppRouter = typeof appRouter