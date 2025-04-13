import { useThemeContext } from './context';

export function useTheme() {
  const { theme } = useThemeContext();
  return theme;
}
