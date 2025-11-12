import { useTranslation } from 'react-i18next';

// Components
import Login from '@/components/auth/Login';
import Register from '@/components/auth/Register';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Hooks
import { useLoadingStore } from '@/store/loading';
import { useState } from 'react';

type Tab = 'login' | 'register';

export default function LoginPage() {
  // States
  const [activeTab, setActiveTab] = useState<Tab>('login');

  // Hooks
  const { t } = useTranslation();
  const { loading } = useLoadingStore();

  // Utilities
  const handleChangeTab = (v: Tab) => setActiveTab(v);

  // Render
  return (
    <main className='flex-1 container py-8 flex items-center justify-center'>
      <div className='w-full max-w-md'>
        <Tabs
          className='w-full'
          value={activeTab}
          onValueChange={(v: Tab) => handleChangeTab(v)}
        >
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger disabled={loading} value='login'>
              {t('auth.login')}
            </TabsTrigger>
            <TabsTrigger disabled={loading} value='register'>
              {t('auth.register')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value='login'>
            <Login />
          </TabsContent>
          <TabsContent value='register'>
            <Register onBackToLogin={() => setActiveTab('login')} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
