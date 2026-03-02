import { useEffect, useState } from 'react';
import {
  AlertDialog,
  Button,
  Dialog,
  Flex,
  IconButton,
  Text,
  TextField,
  Tooltip,
} from '@radix-ui/themes';
import { useAppDispatch, useAppSelector } from '../../app/store';
import {
  fetchListsThunk,
  createListThunk,
  updateListThunk,
  deleteListThunk,
} from './lists.slice';

interface SidebarProps {
  selectedListId: string | null;
  onSelectList: (id: string) => void;
}

export function Sidebar({ selectedListId, onSelectList }: SidebarProps) {
  const dispatch = useAppDispatch();
  const { items: lists, isLoading } = useAppSelector((s) => s.lists);

  const [newTitle, setNewTitle] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    dispatch(fetchListsThunk());
  }, [dispatch]);

  function handleCreate() {
    if (!newTitle.trim()) return;
    dispatch(createListThunk(newTitle.trim()));
    setNewTitle('');
  }

  function handleUpdate() {
    if (!editId || !editTitle.trim()) return;
    dispatch(updateListThunk({ id: editId, title: editTitle.trim() }));
    setEditId(null);
    setEditTitle('');
  }

  function handleDelete(id: string) {
    dispatch(deleteListThunk(id));
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Text size="3" weight="bold">
          Списки
        </Text>
      </div>

      <div className="sidebar-lists">
        {isLoading && lists.length === 0 && (
          <Text size="2" color="gray">
            Загрузка…
          </Text>
        )}

        {lists.map((list) => (
          <div
            key={list.id}
            className={`list-item ${selectedListId === list.id ? 'active' : ''}`}
            onClick={() => onSelectList(list.id)}
          >
            <Text size="2" truncate>
              {list.title}
            </Text>

            <Flex gap="1" onClick={(e) => e.stopPropagation()}>
              {/* Edit button */}
              <Dialog.Root
                open={editId === list.id}
                onOpenChange={(open) => {
                  if (open) {
                    setEditId(list.id);
                    setEditTitle(list.title);
                  } else {
                    setEditId(null);
                  }
                }}
              >
                <Tooltip content="Переименовать">
                  <Dialog.Trigger>
                    <IconButton size="1" variant="ghost">
                      ✏️
                    </IconButton>
                  </Dialog.Trigger>
                </Tooltip>
                <Dialog.Content maxWidth="400px">
                  <Dialog.Title>Переименовать список</Dialog.Title>
                  <Flex direction="column" gap="3" mt="3">
                    <TextField.Root
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleUpdate();
                      }}
                    />
                    <Flex gap="2" justify="end">
                      <Dialog.Close>
                        <Button variant="soft" color="gray">
                          Отмена
                        </Button>
                      </Dialog.Close>
                      <Dialog.Close>
                        <Button onClick={handleUpdate}>Сохранить</Button>
                      </Dialog.Close>
                    </Flex>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>

              {/* Delete button */}
              <AlertDialog.Root>
                <Tooltip content="Удалить">
                  <AlertDialog.Trigger>
                    <IconButton size="1" variant="ghost" color="red">
                      🗑
                    </IconButton>
                  </AlertDialog.Trigger>
                </Tooltip>
                <AlertDialog.Content maxWidth="400px">
                  <AlertDialog.Title>Удалить список?</AlertDialog.Title>
                  <AlertDialog.Description>
                    Список «{list.title}» и все его задачи будут удалены. Это действие необратимо.
                  </AlertDialog.Description>
                  <Flex gap="2" justify="end" mt="4">
                    <AlertDialog.Cancel>
                      <Button variant="soft" color="gray">
                        Отмена
                      </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                      <Button color="red" onClick={() => handleDelete(list.id)}>
                        Удалить
                      </Button>
                    </AlertDialog.Action>
                  </Flex>
                </AlertDialog.Content>
              </AlertDialog.Root>
            </Flex>
          </div>
        ))}
      </div>

      {/* Create new list */}
      <div className="sidebar-footer">
        <Flex gap="2">
          <TextField.Root
            placeholder="Новый список…"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate();
            }}
            style={{ flex: 1 }}
          />
          <Button size="2" onClick={handleCreate} disabled={!newTitle.trim()}>
            +
          </Button>
        </Flex>
      </div>
    </div>
  );
}
