import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  function cycle() {
    if (theme === 'system') setTheme('light')
    else if (theme === 'light') setTheme('dark')
    else setTheme('system')
  }

  return (
    <button onClick={cycle} className="p-2 rounded-xl hover:bg-muted transition-colors" title="Toggle theme">
      {theme === 'dark' ? <Moon size={19} /> : theme === 'light' ? <Sun size={19} /> : <Monitor size={19} />}
    </button>
  )
}
