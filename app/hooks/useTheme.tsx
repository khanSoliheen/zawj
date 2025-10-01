import React from 'react';

import { dark, light } from '../constants';
import { ITheme, IThemeProvider } from '../constants/types';

export const ThemeContext = React.createContext({
  theme: dark,
  setTheme: () => { },
});

export const ThemeProvider = ({
  children,
  theme = dark,
  setTheme = () => { },
}: IThemeProvider) => {
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default function useTheme(): ITheme {
  const { theme } = React.useContext(ThemeContext);
  return theme;
}
