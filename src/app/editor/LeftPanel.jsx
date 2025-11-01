import { useState } from "react";
import { Edit, FileText, Search } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import FilesTree from "./FilesTree";
import { Button, Tabs, Input } from "@/components/ui";

export default ({ onGenerate, updateFilesList }) => {
	const { theme, setTheme, mounted } = useTheme(); // 现在可以访问主题，用于将来扩展功能
	const [activeTab, setActiveTab] = useState( "文件列表" );

	return (
		<div className={`w-[280px] shrink-0 h-full border-r ${theme === "dark" ? "border-neutral-600" : "border-gray-200"} flex flex-col`}>
			<div className="flex-1 overflow-y-auto px-4 py-2">
				<Tabs defaultValue="文件列表" onValueChange={ setActiveTab } indicatorBasis="trigger">
					<Tabs.List align="center">
						<Tabs.Trigger value="文件列表" className="flex items-center gap-2 text-md">
							<FileText size={ 16 } />
						</Tabs.Trigger>
						<Tabs.Trigger value="编辑">
							<Edit size={ 16 } />
						</Tabs.Trigger>
						<Tabs.Trigger value="网络搜索" className="flex items-center gap-2 text-md">
							<Search size={ 16 } />
						</Tabs.Trigger>
					</Tabs.List>
					<div className="mt-4">
						<Tabs.Pane value="文件列表">
							<FilesTree updateFilesList={ updateFilesList } />
						</Tabs.Pane>
						<Tabs.Pane value="编辑">
							<div className="dark:border-neutral-800 pt-2">
								<div className="space-y-3 flex flex-col gap-1">
									<Button variant="outline" size="default" onClick={() => onGenerate('generatePlan')}>
										生成章节树
									</Button>
									<Button variant="outline" size="default" disabled={true} onClick={() => onGenerate('generateMaterial')}>
										批量生成
									</Button>
									<Button variant="outline" size="default" disabled={true} onClick={() => onGenerate('synthesizeArticle')}>
										一键整篇插入
									</Button>
								</div>
							</div>
						</Tabs.Pane>
						<Tabs.Pane value="网络搜索">
							<div className="flex flex-col gap-2">
								<label className="text-sm text-neutral-500">联网搜索</label>
								<div className={`flex items-center gap-2 border rounded-md p-1 pr-2 mt-2 ${theme === "dark" ? "border-neutral-800" : "border-gray-200"}`}>
									<Input variant="ghost" size="default" className="w-full !px-2 !py-0" placeholder="关键词 / 语言 / 结果数" />
									<Search size={20} className={`text-neutral-500 cursor-pointer ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"}`} />
								</div>
							</div>
						</Tabs.Pane>
					</div>
				</Tabs>
			</div>
		</div>
	);
}