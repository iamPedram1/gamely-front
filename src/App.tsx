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
import LoginPage from '@/pages/LoginPage';
import TagListPage from '@/pages/TagListPage';
import PostListPage from '@/pages/PostListPage';
import GameListPage from '@/pages/GameListPage';
import MutateTagPage from '@/pages/admin/MutateTagPage';
import PostDetailPage from '@/pages/PostDetailPage';
import MutatePostPage from '@/pages/admin/MutatePostPage';
import TagsListPage from '@/pages/admin/TagsListPage';
import MutateGamePage from '@/pages/admin/MutateGamePage';
import PostsListPage from '@/pages/admin/PostsListPage';
import GamesListPage from '@/pages/admin/GamesListPage';
import CategoryPostsPage from '@/pages/CategoryPostsPage';
import CategoriesPage from '@/pages/admin/CategoriesPage';
import RecoverPasswordPage from '@/pages/RecoverPasswordPage';
import ChangePasswordPage from '@/pages/ChangePasswordPage';
import UsersListPage from '@/pages/admin/UsersListPage';
import UserDetailPage from '@/pages/admin/UserDetailPage';
import CommentsListPage from '@/pages/admin/CommentsListPage';
import ProfilePage from '@/pages/ProfilePage';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

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
          <Route path={routes.tags.index} element={<TagListPage />} />
          <Route
            path={routes.categories.details(':id')}
            element={<CategoryPostsPage />}
          />
          <Route path={routes.login} element={<LoginPage />} />
          <Route path={routes.profile.index} element={<ProfilePage />} />
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
          </Route>
        </Routes>
        {!isDashboard && <Footer />}
      </Suspense>
      <NotificationProvider />
    </ThemeProvider>
  );
}

export default App;
