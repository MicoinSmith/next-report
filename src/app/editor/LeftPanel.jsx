import { useState } from "react";
import Tabs from "@/components/ui/Tabs";
import { FileText, Search } from "lucide-react";
import FilesTree from "./FilesTree";

export default () => {
	const [activeTab, setActiveTab] = useState("文件列表");
	return (
		<div className="w-[280px] shrink-0 px-4 py-2 border-r dark:border-neutral-800 flex flex-col justify-between">
			<div className="space-y-4">
				<Tabs defaultValue="文件列表" onValueChange={setActiveTab} indicatorBasis="trigger">
					<Tabs.List>
						<Tabs.Trigger value="文件列表" className="flex items-center gap-2 text-md">
							<FileText size={16} />
							<span>文件列表</span>
						</Tabs.Trigger>
						<Tabs.Trigger value="网络搜索" className="flex items-center gap-2 text-md">
							<Search size={16} />
							<span>联网搜索</span>
						</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Pane value="文件列表">
						<FilesTree />
					</Tabs.Pane>
					<Tabs.Pane value="网络搜索">
						<input className="w-full rounded-md border p-2 text-sm dark:border-neutral-800" placeholder="关键词 / 语言 / 结果数" />
					</Tabs.Pane>
				</Tabs>
			</div>

			<div className="dark:border-neutral-800 pt-4">
				<h2 className="mb-2 mt-6 text-sm font-semibold">生成大纲</h2>
				<div className="space-y-2">
					<button className="w-full rounded-md border px-3 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900 cursor-pointer">
						生成章节树（占位）
					</button>
					<button className="w-full rounded-md border px-3 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900 cursor-pointer">
						批量生成（占位）
					</button>
					<button className="w-full rounded-md border px-3 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900 cursor-pointer">
						一键整篇插入（占位）
					</button>
				</div>
			</div>
		</div>
	);
}