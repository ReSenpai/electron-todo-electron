import { useState } from 'react';
import { Button, Flex, IconButton, Text, Tooltip } from '@radix-ui/themes';
import { ExitIcon, SunIcon, MoonIcon } from '@radix-ui/react-icons';
import { useAppDispatch, useAppSelector } from './store';
import { useTheme } from './ThemeContext';
import { logoutThunk } from '../features/auth/auth.slice';
import { Sidebar } from '../features/lists/Sidebar';
import { TasksPanel } from '../features/tasks/TasksPanel';

export function MainLayout() {
  const dispatch = useAppDispatch();
  const lists = useAppSelector((s) => s.lists.items);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const { appearance, toggleTheme } = useTheme();

  const selectedList = lists.find((l) => l.id === selectedListId) ?? null;

  return (
    <div className="main-layout">
      <Sidebar selectedListId={selectedListId} onSelectList={setSelectedListId} />

      <div className="content-area">
        <Flex
          className="content-toolbar"
          align="center"
          justify="end"
          gap="2"
          px="3"
        >
          <Tooltip content={appearance === 'dark' ? 'Светлая тема' : 'Тёмная тема'}>
            <IconButton
              size="1"
              variant="ghost"
              color="gray"
              onClick={toggleTheme}
            >
              {appearance === 'dark' ? <SunIcon /> : <MoonIcon />}
            </IconButton>
          </Tooltip>
          <Button
            size="1"
            variant="ghost"
            color="gray"
            onClick={() => dispatch(logoutThunk())}
          >
            <ExitIcon /> Выйти
          </Button>
        </Flex>

        <div className="tasks-panel">
          {selectedList ? (
            <TasksPanel listId={selectedList.id} listTitle={selectedList.title} />
          ) : (
            <div className="empty-state">
              <Text size="4" color="gray">
                Выберите список
              </Text>
              <Text size="2" color="gray">
                или создайте новый в боковой панели
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
