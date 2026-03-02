import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Flex,
  Heading,
  IconButton,
  Select,
  Text,
  TextField,
  Tooltip,
} from '@radix-ui/themes';
import { useAppDispatch, useAppSelector } from '../../app/store';
import {
  fetchTasksThunk,
  createTaskThunk,
  updateTaskThunk,
  deleteTaskThunk,
} from './tasks.slice';
import { TaskStatus } from '../../types/enums';

interface TasksPanelProps {
  listId: string;
  listTitle: string;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'Новая',
  [TaskStatus.IN_PROGRESS]: 'В работе',
  [TaskStatus.DONE]: 'Готово',
};

const STATUS_COLORS: Record<TaskStatus, 'gray' | 'blue' | 'green'> = {
  [TaskStatus.TODO]: 'gray',
  [TaskStatus.IN_PROGRESS]: 'blue',
  [TaskStatus.DONE]: 'green',
};

export function TasksPanel({ listId, listTitle }: TasksPanelProps) {
  const dispatch = useAppDispatch();
  const { items: tasks, isLoading } = useAppSelector((s) => s.tasks);

  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    dispatch(fetchTasksThunk(listId));
  }, [dispatch, listId]);

  function handleCreate() {
    if (!newTitle.trim()) return;
    dispatch(createTaskThunk({ listId, title: newTitle.trim() }));
    setNewTitle('');
  }

  function handleStatusChange(taskId: string, status: TaskStatus) {
    dispatch(updateTaskThunk({ listId, taskId, payload: { status } }));
  }

  function handleDelete(taskId: string) {
    dispatch(deleteTaskThunk({ listId, taskId }));
  }

  return (
    <div className="tasks-panel">
      <div className="tasks-header">
        <Heading size="4">{listTitle}</Heading>
        <Text size="2" color="gray">
          {tasks.length} {taskWord(tasks.length)}
        </Text>
      </div>

      <div className="tasks-list">
        {isLoading && tasks.length === 0 && (
          <Text size="2" color="gray">
            Загрузка…
          </Text>
        )}

        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <Select.Root
              size="1"
              value={task.status}
              onValueChange={(val) => handleStatusChange(task.id, val as TaskStatus)}
            >
              <Select.Trigger variant="ghost">
                <Badge color={STATUS_COLORS[task.status]}>{STATUS_LABELS[task.status]}</Badge>
              </Select.Trigger>
              <Select.Content>
                <Select.Item value={TaskStatus.TODO}>{STATUS_LABELS[TaskStatus.TODO]}</Select.Item>
                <Select.Item value={TaskStatus.IN_PROGRESS}>
                  {STATUS_LABELS[TaskStatus.IN_PROGRESS]}
                </Select.Item>
                <Select.Item value={TaskStatus.DONE}>{STATUS_LABELS[TaskStatus.DONE]}</Select.Item>
              </Select.Content>
            </Select.Root>

            <Text
              size="2"
              className={`task-item-title ${task.status === TaskStatus.DONE ? 'done' : ''}`}
            >
              {task.title}
            </Text>

            <Tooltip content="Удалить">
              <IconButton size="1" variant="ghost" color="red" onClick={() => handleDelete(task.id)}>
                🗑
              </IconButton>
            </Tooltip>
          </div>
        ))}

        {!isLoading && tasks.length === 0 && (
          <div className="empty-state">
            <Text size="3" color="gray">
              Нет задач
            </Text>
            <Text size="2" color="gray">
              Добавьте первую задачу ниже
            </Text>
          </div>
        )}
      </div>

      {/* Create new task */}
      <Flex gap="2" p="4" style={{ borderTop: '1px solid var(--gray-6)' }}>
        <TextField.Root
          placeholder="Новая задача…"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCreate();
          }}
          style={{ flex: 1 }}
        />
        <Button onClick={handleCreate} disabled={!newTitle.trim()}>
          Добавить
        </Button>
      </Flex>
    </div>
  );
}

function taskWord(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) return 'задача';
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'задачи';
  return 'задач';
}
