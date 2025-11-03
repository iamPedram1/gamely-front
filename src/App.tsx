import { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Components
import AdminLayout from '@/components/admin/AdminLayout';
import NotificationProvider from '@/components/ui/notification';

// Context
import { ThemeProvider } from '@/contexts/ThemeContext';

// Utilities
import routes from '@/utilities/routes';

// Pages
import HomePage from '@/pages/HomePage';
import UserPage from '@/pages/UserPage';
import LoginPage from '@/pages/LoginPage';
import ProfilePage from '@/pages/ProfilePage';
import TagListPage from '@/pages/TagListPage';
import PostListPage from '@/pages/PostListPage';
import GameListPage from '@/pages/GameListPage';
import BlockListPage from '@/pages/BlockListPage';
import PostDetailPage from '@/pages/PostDetailPage';
import MutateTagPage from '@/pages/admin/MutateTagPage';
import MutatePostPage from '@/pages/admin/MutatePostPage';
import TagsListPage from '@/pages/admin/TagsListPage';
import MutateGamePage from '@/pages/admin/MutateGamePage';
import PostsListPage from '@/pages/admin/PostsListPage';
import GamesListPage from '@/pages/admin/GamesListPage';
import CategoryPostsPage from '@/pages/CategoryPostsPage';
import CategoriesPage from '@/pages/admin/CategoriesPage';
import RecoverPasswordPage from '@/pages/RecoverPasswordPage';
import ChangePasswordPage from '@/pages/ChangePasswordPage';
import CategoriesPagePublic from '@/pages/CategoriesPage';
import DashboardPage from '@/pages/admin/DashboardPage';
import UsersListPage from '@/pages/admin/UsersListPage';
import UserDetailPage from '@/pages/admin/UserDetailPage';
import CommentsListPage from '@/pages/admin/CommentsListPage';
import ReportsListPage from '@/pages/admin/ReportsListPage';
import ProfileFollowersPage from '@/pages/ProfileFollowersPage';
import ProfileFollowingPage from '@/pages/ProfileFollowingPage';
import UserFollowersPage from '@/pages/UserFollowersPage';
import UserFollowingPage from '@/pages/UserFollowingPage';
import CreatePostPage from '@/pages/CreatePostPage';
import GameDetailPage from '@/pages/GameDetailPage';
import UserPostsListPage from '@/pages/UserPostsListPage';
import UserReportsListPage from '@/pages/UserReportsListPage';

// Layout
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BanListPage from '@/pages/admin/BanListPage';

function App() {
  // Hooks
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  // Render
  return (
    <ThemeProvider defaultTheme='system' storageKey='game-blog-theme'>
      <Suspense
        fallback={
          <div className='min-h-screen flex items-center justify-center'>
            Loading...
          </div>
        }
      >
        {!isDashboard && <Header />}
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path={routes.posts.index} element={<PostListPage />} />
          <Route
            path={routes.posts.details(':id')}
            element={<PostDetailPage />}
          />
          <Route path={routes.games.index} element={<GameListPage />} />
          <Route
            path={routes.games.details(':slug')}
            element={<GameDetailPage />}
          />

          <Route path={routes.tags.index} element={<TagListPage />} />
          <Route
            path={routes.categories.index}
            element={<CategoriesPagePublic />}
          />
          <Route
            path={routes.categories.details(':id')}
            element={<CategoryPostsPage />}
          />
          <Route path={routes.login} element={<LoginPage />} />
          <Route path={routes.profile.index} element={<ProfilePage />} />
          <Route path={routes.profile.blockList} element={<BlockListPage />} />
          <Route
            path={routes.profile.followers}
            element={<ProfileFollowersPage />}
          />
          <Route
            path={routes.profile.followings}
            element={<ProfileFollowingPage />}
          />
          <Route
            path={routes.users.details(':username')}
            element={<UserPage />}
          />
          <Route
            path={routes.users.followers(':username')}
            element={<UserFollowersPage />}
          />
          <Route
            path={routes.users.followings(':username')}
            element={<UserFollowingPage />}
          />
          <Route
            path={routes.passwordRecovery}
            element={<RecoverPasswordPage />}
          />
          <Route
            path={`${routes.passwordRecovery}/:id`}
            element={<ChangePasswordPage />}
          />

          {/* Admin Routes */}
          <Route path='/dashboard' element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route
              path={routes.dashboard.posts.index}
              element={<PostsListPage />}
            />
            <Route
              path={routes.dashboard.posts.add}
              element={<MutatePostPage />}
            />
            <Route
              path={routes.dashboard.posts.edit(':id')}
              element={<MutatePostPage />}
            />
            <Route
              path={routes.dashboard.games.index}
              element={<GamesListPage />}
            />
            <Route
              path={routes.dashboard.games.add}
              element={<MutateGamePage />}
            />
            <Route
              path={routes.dashboard.games.edit(':id')}
              element={<MutateGamePage />}
            />
            <Route
              path={routes.dashboard.categories.index}
              element={<CategoriesPage />}
            />
            <Route
              path={routes.dashboard.tags.index}
              element={<TagsListPage />}
            />
            <Route
              path={routes.dashboard.tags.add}
              element={<MutateTagPage />}
            />
            <Route
              path={routes.dashboard.bans.index}
              element={<BanListPage />}
            />
            <Route
              path={routes.dashboard.tags.edit(':id')}
              element={<MutateTagPage />}
            />
            <Route
              path={routes.dashboard.users.index}
              element={<UsersListPage />}
            />
            <Route
              path={routes.dashboard.users.edit(':id')}
              element={<UserDetailPage />}
            />
            <Route
              path={routes.dashboard.comments}
              element={<CommentsListPage />}
            />
            <Route
              path={routes.dashboard.reports}
              element={<ReportsListPage />}
            />
          </Route>

          {/* User Routes */}
          <Route path='/my-posts' element={<UserPostsListPage />} />
          <Route path='/create-post' element={<CreatePostPage />} />
          <Route path='/my-reports' element={<UserReportsListPage />} />
        </Routes>
        {!isDashboard && <Footer />}
      </Suspense>
      <NotificationProvider />
    </ThemeProvider>
  );
}

export default App;
