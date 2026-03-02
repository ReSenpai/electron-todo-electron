import { useEffect, useState } from 'react';
import { Flex, Spinner, Text } from '@radix-ui/themes';
import { useAppDispatch, useAppSelector } from './store';
import { restoreSessionThunk } from '../features/auth/auth.slice';
import { AuthPage } from '../features/auth/AuthPage';
import { MainLayout } from './MainLayout';
import { TitleBar } from './TitleBar';

function App() {
  const dispatch = useAppDispatch();
  const { token, isInitialized } = useAppSelector((s) => s.auth);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    window.electronAPI?.getPlatform?.().then((p) => setIsMac(p === 'darwin'));
    dispatch(restoreSessionThunk());
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div className={`app-root ${isMac ? 'app-root--mac' : ''}`}>
        {!isMac && <TitleBar />}
        <Flex align="center" justify="center" style={{ flex: 1 }}>
          <Flex direction="column" align="center" gap="3">
            <Spinner size="3" />
            <Text size="2" color="gray">Загрузка…</Text>
          </Flex>
        </Flex>
      </div>
    );
  }

  return (
    <div className={`app-root ${isMac ? 'app-root--mac' : ''}`}>
      {!isMac && <TitleBar />}
      {token ? <MainLayout /> : <AuthPage />}
    </div>
  );
}

export default App;
