import httpCreator from './'

const { HTTP, POST, uploadMultiple } = httpCreator( {} )

// API 接口
export const api = {
	// 1. 健康检查
	health: () => HTTP.get( '/health' ),

	// 2. 配置 LLM（大语言模型）
	config: ( data ) => POST( '/config', data ),

	// 3. 上传文件
	uploadFiles: ( files, onProgress ) => {
		if ( !files || ( Array.isArray( files ) && files.length === 0 ) ) {
			return Promise.reject( new Error( 'No files provided' ) )
		}
		const filesArray = Array.isArray( files ) ? files : [ files ]
		return uploadMultiple( '/upload-files', filesArray, onProgress )
	},

	// 4. 生成写作大纲（Plan）
	generatePlan: ( data ) => POST( '/generate-plan', data ),

	// 5. 生成大纲步骤素材（Material）
	generateMaterial: ( data ) => POST( '/generate-material', data ),

	// 6. 综合生成最终文章（Synthesize Article）
	synthesizeArticle: ( data ) => POST( '/synthesize-article', data ),
}
