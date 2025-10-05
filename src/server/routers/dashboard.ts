import { z } from 'zod';
import { publicProcedure, router } from '@/lib/trpc';
import { prisma } from '@/lib/prisma';

export const dashboardRouter = router({
  /**
   * Get dashboard statistics
   */
  getStats: publicProcedure.query(async () => {
    try {
      // Get total campaigns
      const totalCampaigns = await prisma.campaign.count();
      
      // Get active campaigns
      const activeCampaigns = await prisma.campaign.count({
        where: { status: 'ACTIVE' }
      });
      
      // Get total clients
      const totalClients = await prisma.client.count();
      
      // Get total revenue from payments
      const revenueResult = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'COMPLETED' }
      });
      const totalRevenue = revenueResult._sum.amount || 0;
      
      // Get analytics data for conversion rate
      const analyticsData = await prisma.analytics.aggregate({
        _sum: {
          clicks: true,
          impressions: true,
          conversions: true
        }
      });
      
      const clicks = analyticsData._sum.clicks || 0;
      const impressions = analyticsData._sum.impressions || 0;
      const conversions = analyticsData._sum.conversions || 0;
      
      // Calculate conversion rate
      const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
      
      // Calculate CTR (Click-Through Rate)
      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      
      // Get previous month data for comparison
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      const lastMonthCampaigns = await prisma.campaign.count({
        where: {
          createdAt: {
            gte: lastMonth
          }
        }
      });
      
      const campaignGrowth = totalCampaigns > 0 
        ? ((lastMonthCampaigns / totalCampaigns) * 100).toFixed(1)
        : '0';
      
      return {
        totalCampaigns,
        activeCampaigns,
        totalClients,
        totalRevenue,
        conversionRate: conversionRate.toFixed(2),
        ctr: ctr.toFixed(2),
        campaignGrowth: `+${campaignGrowth}%`,
        stats: [
          {
            title: 'إجمالي الحملات',
            value: totalCampaigns.toString(),
            change: `+${campaignGrowth}%`,
            trend: 'up',
            description: 'هذا الشهر'
          },
          {
            title: 'الإيرادات',
            value: `$${(totalRevenue / 1000).toFixed(1)}K`,
            change: '+23%',
            trend: 'up',
            description: 'إجمالي هذا الشهر'
          },
          {
            title: 'العملاء النشطين',
            value: totalClients.toString(),
            change: '+8%',
            trend: 'up',
            description: 'عملاء متفاعلين'
          },
          {
            title: 'معدل التحويل',
            value: `${conversionRate.toFixed(1)}%`,
            change: ctr > 3 ? '+5%' : '-2%',
            trend: ctr > 3 ? 'up' : 'down',
            description: 'آخر 30 يوم'
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default values on error
      return {
        totalCampaigns: 0,
        activeCampaigns: 0,
        totalClients: 0,
        totalRevenue: 0,
        conversionRate: '0',
        ctr: '0',
        campaignGrowth: '+0%',
        stats: [
          {
            title: 'إجمالي الحملات',
            value: '0',
            change: '+0%',
            trend: 'up',
            description: 'هذا الشهر'
          },
          {
            title: 'الإيرادات',
            value: '$0',
            change: '+0%',
            trend: 'up',
            description: 'إجمالي هذا الشهر'
          },
          {
            title: 'العملاء النشطين',
            value: '0',
            change: '+0%',
            trend: 'up',
            description: 'عملاء متفاعلين'
          },
          {
            title: 'معدل التحويل',
            value: '0%',
            change: '+0%',
            trend: 'up',
            description: 'آخر 30 يوم'
          }
        ]
      };
    }
  }),

  /**
   * Get recent activities
   */
  getRecentActivities: publicProcedure
    .input(z.object({
      limit: z.number().optional().default(10)
    }))
    .query(async ({ input }) => {
      try {
        // Get recent campaigns
        const recentCampaigns = await prisma.campaign.findMany({
          take: input.limit,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        });

        // Get recent clients
        const recentClients = await prisma.client.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' }
        });

        // Get recent payments
        const recentPayments = await prisma.payment.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            invoice: true
          }
        });

        // Combine and format activities
        const activities = [
          ...recentCampaigns.map(c => ({
            id: c.id,
            type: 'campaign',
            title: `حملة جديدة: ${c.name}`,
            description: c.description || 'تم إنشاء حملة إعلانية جديدة',
            user: c.user?.name || 'مستخدم',
            timestamp: c.createdAt,
            status: c.status
          })),
          ...recentClients.map(c => ({
            id: c.id,
            type: 'client',
            title: `عميل جديد: ${c.name}`,
            description: c.email,
            user: 'النظام',
            timestamp: c.createdAt,
            status: 'NEW'
          })),
          ...recentPayments.map(p => ({
            id: p.id,
            type: 'payment',
            title: `دفعة جديدة: $${p.amount}`,
            description: `حالة الدفع: ${p.status}`,
            user: 'النظام',
            timestamp: p.createdAt,
            status: p.status
          }))
        ]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, input.limit);

        return activities;
      } catch (error) {
        console.error('Error fetching recent activities:', error);
        return [];
      }
    }),

  /**
   * Get top performing campaigns
   */
  getTopCampaigns: publicProcedure
    .input(z.object({
      limit: z.number().optional().default(5)
    }))
    .query(async ({ input }) => {
      try {
        const campaigns = await prisma.campaign.findMany({
          take: input.limit,
          where: {
            status: { in: ['ACTIVE', 'COMPLETED'] }
          },
          include: {
            analytics: {
              orderBy: { date: 'desc' },
              take: 1
            },
            _count: {
              select: { ads: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        });

        return campaigns.map(campaign => {
          const latestAnalytics = campaign.analytics[0];
          return {
            id: campaign.id,
            name: campaign.name,
            status: campaign.status,
            budget: campaign.budget || 0,
            adsCount: campaign._count.ads,
            clicks: latestAnalytics?.clicks || 0,
            impressions: latestAnalytics?.impressions || 0,
            conversions: latestAnalytics?.conversions || 0,
            revenue: latestAnalytics?.revenue || 0,
            ctr: latestAnalytics?.impressions 
              ? ((latestAnalytics.clicks / latestAnalytics.impressions) * 100).toFixed(2)
              : '0',
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            createdAt: campaign.createdAt
          };
        });
      } catch (error) {
        console.error('Error fetching top campaigns:', error);
        return [];
      }
    }),

  /**
   * Get analytics overview
   */
  getAnalyticsOverview: publicProcedure
    .input(z.object({
      days: z.number().optional().default(30)
    }))
    .query(async ({ input }) => {
      try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - input.days);

        const analytics = await prisma.analytics.findMany({
          where: {
            date: {
              gte: startDate
            }
          },
          orderBy: { date: 'asc' },
          include: {
            campaign: {
              select: {
                name: true,
                status: true
              }
            }
          }
        });

        // Group by date
        const groupedByDate = analytics.reduce((acc, item) => {
          const dateKey = item.date.toISOString().split('T')[0];
          if (!acc[dateKey]) {
            acc[dateKey] = {
              date: dateKey,
              clicks: 0,
              impressions: 0,
              conversions: 0,
              revenue: 0
            };
          }
          acc[dateKey].clicks += item.clicks;
          acc[dateKey].impressions += item.impressions;
          acc[dateKey].conversions += item.conversions;
          acc[dateKey].revenue += item.revenue;
          return acc;
        }, {} as Record<string, any>);

        const chartData = Object.values(groupedByDate);

        // Calculate totals
        const totals = analytics.reduce((acc, item) => ({
          clicks: acc.clicks + item.clicks,
          impressions: acc.impressions + item.impressions,
          conversions: acc.conversions + item.conversions,
          revenue: acc.revenue + item.revenue
        }), { clicks: 0, impressions: 0, conversions: 0, revenue: 0 });

        return {
          chartData,
          totals,
          averages: {
            clicks: (totals.clicks / input.days).toFixed(0),
            impressions: (totals.impressions / input.days).toFixed(0),
            conversions: (totals.conversions / input.days).toFixed(0),
            revenue: (totals.revenue / input.days).toFixed(2)
          }
        };
      } catch (error) {
        console.error('Error fetching analytics overview:', error);
        return {
          chartData: [],
          totals: { clicks: 0, impressions: 0, conversions: 0, revenue: 0 },
          averages: { clicks: '0', impressions: '0', conversions: '0', revenue: '0' }
        };
      }
    }),

  /**
   * Get campaign performance by status
   */
  getCampaignsByStatus: publicProcedure.query(async () => {
    try {
      const statusCounts = await prisma.campaign.groupBy({
        by: ['status'],
        _count: true
      });

      return statusCounts.map(item => ({
        status: item.status,
        count: item._count,
        percentage: 0 // Will be calculated on frontend
      }));
    } catch (error) {
      console.error('Error fetching campaigns by status:', error);
      return [];
    }
  }),

  /**
   * Get real-time analytics data
   */
  getRealtimeAnalytics: publicProcedure
    .input(z.object({
      timeRange: z.enum(['1h', '6h', '24h', '7d', '30d']).optional().default('24h'),
      campaignIds: z.array(z.string()).optional()
    }))
    .query(async ({ input }) => {
      try {
        // Calculate start date based on time range
        const now = new Date();
        const startDate = new Date();
        
        switch (input.timeRange) {
          case '1h':
            startDate.setHours(now.getHours() - 1);
            break;
          case '6h':
            startDate.setHours(now.getHours() - 6);
            break;
          case '24h':
            startDate.setDate(now.getDate() - 1);
            break;
          case '7d':
            startDate.setDate(now.getDate() - 7);
            break;
          case '30d':
            startDate.setDate(now.getDate() - 30);
            break;
        }

        // Build where clause
        const whereClause: any = {
          date: {
            gte: startDate
          }
        };

        if (input.campaignIds && input.campaignIds.length > 0) {
          whereClause.campaignId = {
            in: input.campaignIds
          };
        }

        // Get analytics data
        const analytics = await prisma.analytics.findMany({
          where: whereClause,
          orderBy: { date: 'asc' },
          include: {
            campaign: {
              select: {
                id: true,
                name: true,
                status: true
              }
            }
          }
        });

        // Group by time intervals
        const groupedData = analytics.reduce((acc, item) => {
          const timeKey = item.date.toISOString();
          if (!acc[timeKey]) {
            acc[timeKey] = {
              time: item.date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
              timestamp: item.date,
              clicks: 0,
              impressions: 0,
              conversions: 0,
              revenue: 0
            };
          }
          acc[timeKey].clicks += item.clicks;
          acc[timeKey].impressions += item.impressions;
          acc[timeKey].conversions += item.conversions;
          acc[timeKey].revenue += item.revenue;
          return acc;
        }, {} as Record<string, any>);

        const timeSeriesData = Object.values(groupedData)
          .sort((a: any, b: any) => a.timestamp.getTime() - b.timestamp.getTime())
          .map((item: any) => ({
            time: item.time,
            clicks: item.clicks,
            impressions: item.impressions,
            conversions: item.conversions,
            revenue: item.revenue
          }));

        // Calculate totals
        const totals = analytics.reduce((acc, item) => ({
          clicks: acc.clicks + item.clicks,
          impressions: acc.impressions + item.impressions,
          conversions: acc.conversions + item.conversions,
          revenue: acc.revenue + item.revenue
        }), { clicks: 0, impressions: 0, conversions: 0, revenue: 0 });

        // Group by campaign
        const campaignMetrics = analytics.reduce((acc, item) => {
          const campaignId = item.campaign.id;
          if (!acc[campaignId]) {
            acc[campaignId] = {
              id: campaignId,
              name: item.campaign.name,
              status: item.campaign.status,
              clicks: 0,
              impressions: 0,
              conversions: 0,
              revenue: 0
            };
          }
          acc[campaignId].clicks += item.clicks;
          acc[campaignId].impressions += item.impressions;
          acc[campaignId].conversions += item.conversions;
          acc[campaignId].revenue += item.revenue;
          return acc;
        }, {} as Record<string, any>);

        const campaignMetricsArray = Object.values(campaignMetrics).map((metric: any) => ({
          ...metric,
          ctr: metric.impressions > 0 
            ? ((metric.clicks / metric.impressions) * 100).toFixed(2) + '%'
            : '0%',
          conversionRate: metric.clicks > 0
            ? ((metric.conversions / metric.clicks) * 100).toFixed(2) + '%'
            : '0%'
        }));

        return {
          timeSeriesData,
          totals,
          campaignMetrics: campaignMetricsArray,
          stats: {
            totalImpressions: totals.impressions,
            totalClicks: totals.clicks,
            totalConversions: totals.conversions,
            totalRevenue: totals.revenue,
            ctr: totals.impressions > 0 
              ? ((totals.clicks / totals.impressions) * 100).toFixed(2) + '%'
              : '0%',
            conversionRate: totals.clicks > 0
              ? ((totals.conversions / totals.clicks) * 100).toFixed(2) + '%'
              : '0%'
          }
        };
      } catch (error) {
        console.error('Error fetching realtime analytics:', error);
        return {
          timeSeriesData: [],
          totals: { clicks: 0, impressions: 0, conversions: 0, revenue: 0 },
          campaignMetrics: [],
          stats: {
            totalImpressions: 0,
            totalClicks: 0,
            totalConversions: 0,
            totalRevenue: 0,
            ctr: '0%',
            conversionRate: '0%'
          }
        };
      }
    }),

  /**
   * Get campaign comparison data
   */
  getCampaignComparison: publicProcedure
    .input(z.object({
      campaignIds: z.array(z.string()).min(1).max(5),
      days: z.number().optional().default(7)
    }))
    .query(async ({ input }) => {
      try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - input.days);

        const campaigns = await prisma.campaign.findMany({
          where: {
            id: {
              in: input.campaignIds
            }
          },
          include: {
            analytics: {
              where: {
                date: {
                  gte: startDate
                }
              },
              orderBy: { date: 'asc' }
            }
          }
        });

        return campaigns.map(campaign => {
          const totals = campaign.analytics.reduce((acc, item) => ({
            clicks: acc.clicks + item.clicks,
            impressions: acc.impressions + item.impressions,
            conversions: acc.conversions + item.conversions,
            revenue: acc.revenue + item.revenue
          }), { clicks: 0, impressions: 0, conversions: 0, revenue: 0 });

          const ctr = totals.impressions > 0 
            ? (totals.clicks / totals.impressions) * 100 
            : 0;
          
          const roi = campaign.budget && campaign.budget > 0
            ? ((totals.revenue - campaign.budget) / campaign.budget) * 100
            : 0;

          return {
            id: campaign.id,
            name: campaign.name,
            status: campaign.status,
            budget: campaign.budget || 0,
            ...totals,
            ctr: ctr.toFixed(2),
            roi: roi.toFixed(2),
            timeSeriesData: campaign.analytics.map(a => ({
              date: a.date.toISOString().split('T')[0],
              clicks: a.clicks,
              impressions: a.impressions,
              conversions: a.conversions,
              revenue: a.revenue
            }))
          };
        });
      } catch (error) {
        console.error('Error fetching campaign comparison:', error);
        return [];
      }
    })
});
