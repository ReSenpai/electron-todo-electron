import { useEffect, useState } from 'react';
import { useAppSelector } from './store';
import { AuthPage } from '../features/auth/AuthPage';
import { MainLayout } from './MainLayout';
import { TitleBar } from './TitleBar';

function App() {
  const token = useAppSelector((s) => s.auth.token);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    window.electronAPI?.getPlatform?.().then((p) => setIsMac(p === 'darwin'));
  }, []);

  return (
    <div className={`app-root ${isMac ? 'app-root--mac' : ''}`}>
      {!isMac && <TitleBar />}
      {token ? <MainLayout /> : <AuthPage />}
    </div>
  );
}

export default App;
