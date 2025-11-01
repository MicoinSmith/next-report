import { Sun, Moon, Circle } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Menu } from "@/components/ui";

export default function Header() {
	const { theme, setTheme, mounted } = useTheme();

	const getThemeByCurrentTheme = () => {
		const time = new Date().getHours();
		if (time >= 6 && time < 18) {
			return "light";
		} else {
			return "dark";
		}
	}

	// 在服务端渲染时使用默认值，避免水合错误
	const displayTheme = mounted ? theme : "light";

	return (
		<div className={`h-12 flex items-center justify-between px-4 py-2 border-b ${displayTheme === "dark" ? "border-neutral-600" : "border-gray-200"}`}>
			<h2 className="text-sm font-semibold">Markdown Editor - AI</h2>
			<Menu>
				<Menu.Trigger className="cursor-pointer focus-visible:outline-none focus-visible:ring-0">
					{displayTheme === "light" ? <Sun size={16} className="text-yellow-500" /> : displayTheme === "dark" ? <Moon size={16} className="text-blue-500" /> : <Circle size={16} className="text-gray-500" />}
				</Menu.Trigger>
				<Menu.Content className="!w-30 !min-w-30">
					<Menu.Item
						className="p-2 flex items-center gap-2 cursor-pointer"
						onSelect={() => {
							setTheme("light");
						}}
					>
						<Sun size={16} className={displayTheme === "light" ? "text-yellow-500" : "text-gray-500"} />
						<span>亮色</span>
					</Menu.Item>
					<Menu.Item
						className="p-2 flex items-center gap-2 cursor-pointer"
						onSelect={() => {
							setTheme("dark");
						}}
					>
						<Moon size={16} className={displayTheme === "dark" ? "text-blue-500" : "text-gray-500"} />
						<span>暗色</span>
					</Menu.Item>
					<Menu.Item
						className="p-2 flex items-center gap-2 cursor-pointer"
						onSelect={() => {
							setTheme(getThemeByCurrentTheme());
						}}
					>
						<Circle size={16} className={displayTheme === "system" ? "text-gray-500" : "text-gray-500"} />
						<span>跟随系统</span>
					</Menu.Item>
				</Menu.Content>
			</Menu>
		</div>
	)
}