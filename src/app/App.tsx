import { useAppSelector } from './store';
import { AuthPage } from '../features/auth/AuthPage';
import { MainLayout } from './MainLayout';
import { TitleBar } from './TitleBar';

function App() {
  const token = useAppSelector((s) => s.auth.token);

  return (
    <div className="app-root">
      <TitleBar />
      {token ? <MainLayout /> : <AuthPage />}
    </div>
  );
}

export default App;
