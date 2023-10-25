import { useTheme } from "next-themes";
import { UseThemeProps } from "next-themes/dist/types";

const useNextTheme = (): UseThemeProps => {
  const { theme, systemTheme, ...rest } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  return {
    ...rest,
    theme: currentTheme,
    systemTheme,
  };
};

export default useNextTheme;
