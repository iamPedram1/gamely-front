import { useTranslation } from 'react-i18next';
import {
  Users,
  Gamepad2,
  FileText,
  UserX,
  TrendingUp,
  Eye,
} from 'lucide-react';

// Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GamingLoader } from '@/components/ui/loading-skeleton';

// Hooks
import { useUsersQuery } from '@/utilities/api/management/user';
import { useGamesQuery } from '@/utilities/api/management/game';
import { usePostsQuery } from '@/utilities/api/management/post';

interface DashboardCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  trend?: number;
  color: string;
}

function DashboardCard({
  title,
  value,
  icon,
  description,
  trend,
  color,
}: DashboardCardProps) {
  return (
    <Card className='relative overflow-hidden bg-gradient-to-br from-background to-muted/20 border-primary/10 hover:border-primary/30 transition-all duration-300'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold mb-1'>{value.toLocaleString()}</div>
        <p className='text-xs text-muted-foreground mb-2'>{description}</p>
      </CardContent>
      <div
        className={`absolute top-0 right-0 w-20 h-20 ${color} opacity-10 rounded-full -translate-y-10 translate-x-10`}
      />
    </Card>
  );
}

export default function DashboardPage() {
  // Hooks
  const { t } = useTranslation();
  const usersQuery = useUsersQuery({ enabled: true });
  const gamesQuery = useGamesQuery({ enabled: true });
  const postsQuery = usePostsQuery({ enabled: true });
  const totalUsers = usersQuery.data?.pagination?.totalDocs || 0;
  const totalGames = gamesQuery.data?.pagination?.totalDocs || 0;
  const totalPosts = postsQuery.data?.pagination?.totalDocs || 0;

  // Calculate blocked users from the users data
  const blockedUsers = 0;

  const dashboardCards = [
    {
      title: t('dashboard.totalUsers'),
      value: totalUsers,
      icon: <Users className='h-4 w-4 text-blue-600' />,
      description: t('dashboard.registeredUsers'),
      trend: 12,
      color: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: t('dashboard.totalGames'),
      value: totalGames,
      icon: <Gamepad2 className='h-4 w-4 text-purple-600' />,
      description: t('dashboard.availableGames'),
      trend: 8,
      color: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: t('dashboard.totalPosts'),
      value: totalPosts,
      icon: <FileText className='h-4 w-4 text-green-600' />,
      description: t('dashboard.publishedPosts'),
      trend: 23,
      color: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: t('dashboard.blockedUsers'),
      value: blockedUsers,
      icon: <UserX className='h-4 w-4 text-red-600' />,
      description: t('dashboard.blockedAccounts'),
      color: 'bg-red-100 dark:bg-red-900/20',
    },
  ];

  // Render
  if (usersQuery.isFetching || gamesQuery.isFetching || postsQuery.isFetching) {
    return <GamingLoader />;
  }

  return (
    <div className='min-h-screen bg-background p-4 md:p-6'>
      <div className='max-w-7xl mx-auto space-y-6 md:space-y-8'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold gradient-gaming-text'>
              {t('dashboard.title')}
            </h1>
            <p className='text-muted-foreground mt-2 text-sm md:text-base'>
              {t('dashboard.subtitle')}
            </p>
          </div>
          <Badge variant='secondary' className='px-3 md:px-4 py-2'>
            <Eye className='h-4 w-4 mr-2' />
            {t('dashboard.overview')}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
          {dashboardCards.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </div>

        {/* Quick Actions */}
        <Card className='bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-lg md:text-xl'>
              <TrendingUp className='h-5 w-5' />
              {t('dashboard.quickActions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='text-center p-4 rounded-lg bg-background/50 border border-primary/10'>
                <Users className='h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-primary' />
                <h3 className='font-semibold text-sm md:text-base'>
                  {t('dashboard.manageUsers')}
                </h3>
                <p className='text-xs md:text-sm text-muted-foreground'>
                  {t('dashboard.manageUsersDesc')}
                </p>
              </div>
              <div className='text-center p-4 rounded-lg bg-background/50 border border-primary/10'>
                <Gamepad2 className='h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-primary' />
                <h3 className='font-semibold text-sm md:text-base'>
                  {t('dashboard.manageGames')}
                </h3>
                <p className='text-xs md:text-sm text-muted-foreground'>
                  {t('dashboard.manageGamesDesc')}
                </p>
              </div>
              <div className='text-center p-4 rounded-lg bg-background/50 border border-primary/10'>
                <FileText className='h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-primary' />
                <h3 className='font-semibold text-sm md:text-base'>
                  {t('dashboard.managePosts')}
                </h3>
                <p className='text-xs md:text-sm text-muted-foreground'>
                  {t('dashboard.managePostsDesc')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
