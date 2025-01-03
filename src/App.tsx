import { useEffect } from 'react';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { supabase } from './lib/supabase';
import { useAuthStore } from './store/authStore';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const { user, setUser, loading, setLoading } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? { ...session.user, email: session.user.email ?? '' } : null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user? { ...session.user, email: session.user.email ?? '' } : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      {user ? <Dashboard /> : <Auth />}
      <Analytics />
    </>
  );
}

export default App;