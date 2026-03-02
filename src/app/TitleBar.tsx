import { Flex, IconButton, Text } from '@radix-ui/themes';
import { Cross2Icon, MinusIcon, SquareIcon, SunIcon, MoonIcon } from '@radix-ui/react-icons';
import { useTheme } from './ThemeContext';

export function TitleBar() {
  const { appearance, toggleTheme } = useTheme();

  function handleMinimize() {
    window.electronAPI?.minimize?.();
  }

  function handleMaximize() {
    window.electronAPI?.maximize?.();
  }

  function handleClose() {
    window.electronAPI?.close?.();
  }

  return (
    <div className="title-bar">
      <Flex align="center" gap="2" className="title-bar-drag">
        <Text size="2" weight="medium" color="gray">
          todo-desktop
        </Text>
      </Flex>

      <Flex gap="1" className="title-bar-controls">
        <IconButton
          size="1"
          variant="ghost"
          color="gray"
          onClick={toggleTheme}
          className="title-bar-btn"
          title={appearance === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
        >
          {appearance === 'dark' ? <SunIcon /> : <MoonIcon />}
        </IconButton>
        <IconButton
          size="1"
          variant="ghost"
          color="gray"
          onClick={handleMinimize}
          className="title-bar-btn"
        >
          <MinusIcon />
        </IconButton>
        <IconButton
          size="1"
          variant="ghost"
          color="gray"
          onClick={handleMaximize}
          className="title-bar-btn"
        >
          <SquareIcon />
        </IconButton>
        <IconButton
          size="1"
          variant="ghost"
          color="red"
          onClick={handleClose}
          className="title-bar-btn title-bar-close"
        >
          <Cross2Icon />
        </IconButton>
      </Flex>
    </div>
  );
}
