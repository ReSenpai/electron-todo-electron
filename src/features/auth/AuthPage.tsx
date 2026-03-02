import { useState } from 'react';
import { Box, Button, Card, Flex, Heading, Tabs, Text, TextField } from '@radix-ui/themes';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { loginThunk, registerThunk } from './auth.slice';

export function AuthPage() {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  function handleSubmit(mode: 'login' | 'register') {
    if (!email.trim() || !password.trim()) return;
    const thunk = mode === 'login' ? loginThunk : registerThunk;
    dispatch(thunk({ email: email.trim(), password }));
  }

  return (
    <div className="auth-page">
      <Card className="auth-card" size="3">
        <Tabs.Root defaultValue="login" onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
          <Tabs.List>
            <Tabs.Trigger value="login">Вход</Tabs.Trigger>
            <Tabs.Trigger value="register">Регистрация</Tabs.Trigger>
          </Tabs.List>

          <Box pt="4">
            <Flex direction="column" gap="3">
              <Heading size="4" align="center">
                todo-desktop
              </Heading>

              <TextField.Root
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField.Root
                placeholder="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit(activeTab);
                }}
              />

              {error && (
                <Text color="red" size="2">
                  {error}
                </Text>
              )}

              <Tabs.Content value="login">
                <Button
                  onClick={() => handleSubmit('login')}
                  loading={isLoading}
                  style={{ width: '100%' }}
                >
                  Войти
                </Button>
              </Tabs.Content>

              <Tabs.Content value="register">
                <Button
                  onClick={() => handleSubmit('register')}
                  loading={isLoading}
                  style={{ width: '100%' }}
                >
                  Зарегистрироваться
                </Button>
              </Tabs.Content>
            </Flex>
          </Box>
        </Tabs.Root>
      </Card>
    </div>
  );
}
