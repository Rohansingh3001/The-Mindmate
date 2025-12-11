import { useTheme } from "../../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeSwitcher;
