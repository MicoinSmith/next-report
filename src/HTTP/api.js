import httpCreator from './'

const { HTTP, POST, upload, uploadMultiple } = httpCreator( {} )

// API 接口
export const api = {
	// 1. 健康检查
	health: () => HTTP.get( '/health' ),

	// 2. 配置 LLM（大语言模型）
	config: ( data ) => POST( '/config', data ),

	// 3. 上传单文件
	uploadFile: ( file, onProgress ) => upload( '/upload-files', file, onProgress ),

	// 4. 上传文件
	uploadFiles: ( files, onProgress ) => uploadMultiple( '/upload-files', files, onProgress ),

	// 5. 生成写作大纲（Plan）
	generatePlan: ( data ) => POST( '/generate-plan', data ),

	// 5. 生成大纲步骤素材（Material）
	generateMaterial: ( data ) => POST( '/generate-material', data ),

	// 6. 综合生成最终文章（Synthesize Article）
	synthesizeArticle: ( data ) => POST( '/synthesize-article', data ),
}
