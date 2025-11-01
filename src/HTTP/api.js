import httpCreator from './'

const { HTTP, POST, GET, uploadMultiple } = httpCreator( {} )

// API 接口
export const api = {
	// 1. 健康检查
	health: () => HTTP.get( '/health' ),

	// 2. 配置 LLM（大语言模型）
	config: ( data ) => POST( '/config', data ),

	// 3. 上传单文件
	uploadFile: ( file, onProgress ) => uploadMultiple( '/upload-files', [ file ], onProgress ),

	// 4. 上传多个文件
	uploadFiles: ( files, onProgress ) => uploadMultiple( '/upload-files', files, onProgress ),

	// 5. 列出文件
	listFiles: ({ include_deleted = false }) => GET( '/list-files', { include_deleted } ),

	// 6. 创建文件
	createFile: ( data ) => POST( '/create-file', data ),

	// 7. 删除文件
	deleteFile: ( fileId ) => POST( `/delete-file/${fileId}` ),

	// 8. 在线搜索
	onlineSearch: ( data ) => POST( '/online-search', data ),

	// 9. 研究主题
	researchTopic: ( data ) => POST( '/research-topic', data ),

	// 10. 生成写作大纲（Plan）
	generatePlan: ( data ) => POST( '/generate-plan', data ),

	// 11. 生成大纲步骤素材（Material）
	generateMaterial: ( data ) => POST( '/generate-material', data ),

	// 12. 综合生成最终文章（Synthesize Article）
	synthesizeArticle: ( data ) => POST( '/synthesize-article', data ),
}
