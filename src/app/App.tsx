import { useAppSelector } from './store';
import { AuthPage } from '../features/auth/AuthPage';
import { MainLayout } from './MainLayout';

function App() {
  const token = useAppSelector((s) => s.auth.token);

  if (!token) {
    return <AuthPage />;
  }

  return <MainLayout />;
}

export default App;
