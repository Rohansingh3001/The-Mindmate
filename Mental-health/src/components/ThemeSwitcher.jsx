import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react"; // or any icon lib

const ThemeSwitcher = () => {
  const { theme, toggleTheme, resetToSystem } = useTheme();

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={toggleTheme}
        className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
      >
        {theme === "dark" ? (
          <>
            <Sun className="inline w-5 h-5 mr-2" /> Light Mode
          </>
        ) : (
          <>
            <Moon className="inline w-5 h-5 mr-2" /> Dark Mode
          </>
        )}
      </button>

      {/* Optional: Add System Reset Button */}
      <button
        onClick={resetToSystem}
        className="text-sm underline text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
      >
        Use System Theme
      </button>
    </div>
  );
};

export default ThemeSwitcher;
