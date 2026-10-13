import { useState, useEffect } from 'react';
import { getDemoUser, getPlan } from '../../lib/storage';
import { supabase } from '../../lib/supabase';
import AuthenticatedSidebar from '../../components/ui/AuthenticatedSidebar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import UserContextMenu from '../../components/ui/UserContextMenu';
import WelcomeSection from './components/WelcomeSection';
import QuickActionCard from './components/QuickActionCard';
import AnalysisHistoryTable from './components/AnalysisHistoryTable';
import MarketTrendsSnapshot from './components/MarketTrendsSnapshot';
import UserStatistics from './components/UserStatistics';

const UserDashboard = () => {
  const [userData, setUserData] = useState({
    firstName: getDemoUser().name,
    lastName: '',
    subscriptionTier: getPlan().tier
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserData({
          firstName: user.user_metadata?.first_name || 'User',
          lastName: user.user_metadata?.last_name || '',
          subscriptionTier: 'Free' // Keep as default for now
        });
      }
    };
    fetchUser();
  }, []);

  const userName = `${userData.firstName} ${userData.lastName}`.trim();
  const subscriptionTier = userData.subscriptionTier;

  const quickActions = [
    {
      title: "Start New Analysis",
      description: "Analyze a new Mumbai location with AI-powered insights for your restaurant venture",
      icon: "PlusCircle",
      actionText: "Begin Analysis",
      route: "/new-analysis",
      variant: "primary"
    },
    {
      title: "View Market Trends",
      description: "Explore current Mumbai restaurant market trends and seasonal patterns",
      icon: "TrendingUp",
      actionText: "View Trends",
      route: "/user-dashboard#market-trends",
      variant: "secondary"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedSidebar />
      <div className="lg:ml-[280px] min-h-screen">
        <header className="sticky top-0 z-40 bg-card border-b border-border shadow-warm-sm">
          <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-4">
            <NavigationBreadcrumbs />
            <UserContextMenu />
          </div>
        </header>

        <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            <WelcomeSection userName={userName} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {quickActions?.map((action, index) => (
                <QuickActionCard
                  key={index}
                  title={action?.title}
                  description={action?.description}
                  icon={action?.icon}
                  actionText={action?.actionText}
                  route={action?.route}
                  variant={action?.variant}
                />
              ))}
            </div>

            <AnalysisHistoryTable />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
              <div className="xl:col-span-2">
                <MarketTrendsSnapshot />
              </div>
              <div className="xl:col-span-1">
                <UserStatistics subscriptionTier={subscriptionTier} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
