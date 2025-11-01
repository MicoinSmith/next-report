import { Sun, Moon, Circle } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Menu } from "@/components/ui";

export default function Header() {
	const { theme, setTheme, mounted } = useTheme();

	// 在客户端水合之前不渲染正确的图标
	if (!mounted) {
		return (
			<div className="h-12 flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-neutral-800">
				<h2 className="text-sm font-semibold">Markdown Editor - AI</h2>
				<Menu>
					<Menu.Trigger>
						<Circle size={16} className="text-gray-500" />
					</Menu.Trigger>
				</Menu>
			</div>
		);
	}

	const getThemeByCurrentTheme = () => {
		const time = new Date().getHours();
		if (time >= 6 && time < 18) {
			return "light";
		} else {
			return "dark";
		}
	}

	return (
		<div className={`h-12 flex items-center justify-between px-4 py-2 border-b ${theme === "dark" ? "border-neutral-600" : "border-gray-200"}`}>
			<h2 className="text-sm font-semibold">Markdown Editor - AI</h2>
			<Menu>
				<Menu.Trigger className="cursor-pointer focus-visible:outline-none focus-visible:ring-0">
					{theme === "light" ? <Sun size={16} className="text-yellow-500" /> : theme === "dark" ? <Moon size={16} className="text-blue-500" /> : <Circle size={16} className="text-gray-500" />}
				</Menu.Trigger>
				<Menu.Content className="!w-30 !min-w-30">
					<Menu.Item
						className="p-2 flex items-center gap-2 cursor-pointer"
						onSelect={() => {
							setTheme("light");
						}}
					>
						<Sun size={16} className={theme === "light" ? "text-yellow-500" : "text-gray-500"} />
						<span>亮色</span>
					</Menu.Item>
					<Menu.Item
						className="p-2 flex items-center gap-2 cursor-pointer"
						onSelect={() => {
							setTheme("dark");
						}}
					>
						<Moon size={16} className={theme === "dark" ? "text-blue-500" : "text-gray-500"} />
						<span>暗色</span>
					</Menu.Item>
					<Menu.Item
						className="p-2 flex items-center gap-2 cursor-pointer"
						onSelect={() => {
							setTheme(getThemeByCurrentTheme());
						}}
					>
						<Circle size={16} className={theme === "system" ? "text-gray-500" : "text-gray-500"} />
						<span>跟随系统</span>
					</Menu.Item>
				</Menu.Content>
			</Menu>
		</div>
	)
}