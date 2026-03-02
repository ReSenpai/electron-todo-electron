import { useState } from 'react';
import { Button, Flex, Text } from '@radix-ui/themes';
import { useAppDispatch, useAppSelector } from './store';
import { logoutThunk } from '../features/auth/auth.slice';
import { Sidebar } from '../features/lists/Sidebar';
import { TasksPanel } from '../features/tasks/TasksPanel';

export function MainLayout() {
  const dispatch = useAppDispatch();
  const lists = useAppSelector((s) => s.lists.items);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const selectedList = lists.find((l) => l.id === selectedListId) ?? null;

  return (
    <div className="main-layout">
      <Sidebar selectedListId={selectedListId} onSelectList={setSelectedListId} />

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

        <Flex
          justify="end"
          p="2"
          style={{ position: 'absolute', top: 8, right: 16 }}
        >
          <Button
            size="1"
            variant="ghost"
            color="gray"
            onClick={() => dispatch(logoutThunk())}
          >
            Выйти
          </Button>
        </Flex>
      </div>
    </div>
  );
}
