import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import TagListPage from '@/pages/TagListPage';
import PostListPage from '@/pages/PostListPage';
import GameListPage from '@/pages/GameListPage';
import AddTagPage from '@/pages/admin/AddTagPage';
import PostDetailPage from '@/pages/PostDetailPage';
import AddPostPage from '@/pages/admin/AddPostPage';
import TagsListPage from '@/pages/admin/TagsListPage';
import MutateGamePage from '@/pages/admin/MutateGamePage';
import PostsListPage from '@/pages/admin/PostsListPage';
import GamesListPage from '@/pages/admin/GamesListPage';
import AdminLayout from '@/components/admin/AdminLayout';
import CategoryPostsPage from '@/pages/CategoryPostsPage';
import CategoriesPage from '@/pages/admin/CategoriesPage';

// Components
import NotificationProvider from '@/components/ui/notification';

function App() {
  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <ThemeProvider defaultTheme='system' storageKey='game-blog-theme'>
        <Suspense
          fallback={
            <div className='min-h-screen flex items-center justify-center'>
              Loading...
            </div>
          }
        >
          <>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/posts' element={<PostListPage />} />
              <Route path='/post/:slug' element={<PostDetailPage />} />
              <Route path='/games' element={<GameListPage />} />
              <Route path='/tags' element={<TagListPage />} />
              <Route path='/category/:slug' element={<CategoryPostsPage />} />
              <Route path='/login' element={<LoginPage />} />

              {/* Admin Routes */}
              <Route path='/dashboard' element={<AdminLayout />}>
                <Route path='posts' element={<PostsListPage />} />
                <Route path='posts/add' element={<AddPostPage />} />
                <Route path='posts/:id' element={<AddPostPage />} />
                <Route path='games' element={<GamesListPage />} />
                <Route path='games/add' element={<MutateGamePage />} />
                <Route path='games/:id' element={<MutateGamePage />} />
                <Route path='categories' element={<CategoriesPage />} />
                <Route path='tags' element={<TagsListPage />} />
                <Route path='tags/add' element={<AddTagPage />} />
                <Route path='tags/:id' element={<AddTagPage />} />
              </Route>
            </Routes>
            <NotificationProvider />
          </>
        </Suspense>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
