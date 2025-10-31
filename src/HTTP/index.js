import axios from 'axios';
import { getCookie } from 'cookies-next';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function httpCreator( { baseURL = '/api', timeout = 1000 * 60 * 1, headers = {} } ) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        credentials: 'include',
        ...headers,
    };
    const HTTP = axios.create( {
        baseURL,
        timeout,
        headers: defaultHeaders,
    } );

    // 请求拦截器
    HTTP.interceptors.request.use(
        config => {
            config.headers['Authorization'] = null;
            return config;
        },
        error => {
            return Promise.reject( error );
        }
    );

    // 响应拦截器
    HTTP.interceptors.response.use(
        response => {
            return response.data;
        },
        error => {
            console.log( 'response.error', error );

            const errorCodeStatus = error.response?.status;

            console.log( 'errorCodeStatus', errorCodeStatus );

            if ( errorCodeStatus > 400 && errorCodeStatus < 500 ) {
                console.log( 'api error: ', error );
                if ( errorCodeStatus === 401 ) {
                    // 未授权，跳转登录
                    console.log( '401 unauthorized, 清除用户数据并跳转登录页' );
                }
            } else {
            }

            // 显示错误信息
            let errorMessage = '请求失败';

            if (errorCodeStatus === 404) {
                errorMessage = '接口不存在，请检查 API 地址配置或后端服务是否运行';
            } else if (errorCodeStatus === 500) {
                errorMessage = error.response?.data?.message || error.response?.data?.msg || '服务器错误';
            } else if (errorCodeStatus) {
                errorMessage = error.response?.data?.message || error.response?.data?.msg || error.message || `请求失败 (${errorCodeStatus})`;
            } else if (error.message) {
                errorMessage = error.message;
            }

            // 只在客户端环境下显示消息提示，且确保消息不为空
            if (typeof window !== 'undefined' && Message?.error && errorMessage) {
                Message.error( errorMessage );
            }

            // return Promise.reject(error);
            return Promise.resolve( error );
        }
    );

    // 基础HTTP方法
    const GET = ( HTTP.get = ( url, config ) => HTTP.request( { ...config, method: 'GET', url } ) );
    const POST = ( HTTP.post = ( url, data, config ) => HTTP.request( { ...config, method: 'POST', url, data } ) );
    const PUT = ( HTTP.put = ( url, data, config ) => HTTP.request( { ...config, method: 'PUT', url, data } ) );
    const DEL = ( HTTP.del = ( url, config ) => HTTP.request( { ...config, method: 'DELETE', url } ) );
    // GET SSE (EventSource)
    const sseGet = ( HTTP.sseGet = ( url, callbacks ) => {
        const es = new EventSource( `${API_URL}${url}` );

        es.onmessage = event => {
            callbacks.onMessage?.( event.data );
        };

        es.onerror = err => {
            callbacks.onError?.( err );
            es.close();
        };

        return es; // 调用方可 es.close()
    } );

    // POST SSE (fetch + stream)
    const ssePost = ( HTTP.ssePost = async ( url, body, callbacks ) => {

        // sse 不能经过nextconfig的rewrites 否则无法逐步获取sse流
        const TargetUrl = `${API_URL}${url}`

        try {
            const res = await fetch( TargetUrl, {
                method: 'POST',
                headers: {
                    ...headers,
                },
                body: body ? JSON.stringify( body ) : undefined,
            } );

            // 处理错误响应
            if (!res.ok) {
                const errorText = await res.text();
                console.error('SSE request failed:', res.status, errorText);
                callbacks.onError?.( new Error( `HTTP ${res.status}: ${errorText}` ) );
                return;
            }

            if ( !res.body ) {
                callbacks.onError?.( new Error( 'SSE response body is null' ) );
                return;
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            while ( true ) {
                const { value, done } = await reader.read();

                const eventType = ["PING", "Message", "Error", "Done"]

                const chunk = decoder.decode( value );
                // console.log('Raw chunk:', chunk, chunk.split("\n").trim());
                chunk.split("\n\n").filter(line => line.trim() !== "").forEach(line => {
                    const eventData = {}
                    const lines = line.split("\n")
                    // console.log('length: ', lines.length)
                    lines.forEach(line => {
                        // console.log('line: ', line)
                        if(line.startsWith("id: ")) {
                            eventData.id = line.replace("id:", "").trim()
                        } else if(line.startsWith("event: ")) {
                            eventData.event = line.replace("event:", "").trim()
                        } else if(line.startsWith("data: ")) {
                            try {
                                eventData.data = JSON.parse(line.replace("data:", "").trim())
                            } catch (error) {
                                console.error("Parse error 请手动检查.", error);
                                // 只在客户端环境下显示消息提示
                                if (typeof window !== 'undefined' && Message?.error) {
                                    Message.error("Parse error 请手动检查.");
                                }
                            }
                        }
                    })
                    if(eventData.id && eventData.event && eventData.data) {
                        // console.log('eventData: ', eventData)
                        callbacks.onMessage?.(eventData)
                    }
                })

                if ( done ) {
                    callbacks.onComplete?.(done);
                    break;
                }
            }
        } catch (error) {
            console.error('SSE request error:', error);
            callbacks.onError?.(error);
        }
    } );

    // 文件上传方法（支持进度条）
    const upload = ( HTTP.upload = ( url, file, onProgress, config = {} ) => {
        const formData = new FormData();
        formData.append( 'file', file );

        return HTTP.request( {
            ...config,
            method: 'POST',
            url,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...config.headers,
            },
            onUploadProgress: progressEvent => {
                if ( onProgress && typeof onProgress === 'function' ) {
                    const percentCompleted = Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total );
                    onProgress( percentCompleted, progressEvent );
                }
            },
        } );
    } );

    // 多文件上传方法（支持进度条）
    const uploadMultiple = ( HTTP.uploadMultiple = ( url, files, onProgress, config = {} ) => {
        const formData = new FormData();
        files.forEach( ( file, index ) => {
            formData.append( `files[${ index }]`, file );
        } );

        return HTTP.request( {
            ...config,
            method: 'POST',
            url,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...config.headers,
            },
            onUploadProgress: progressEvent => {
                if ( onProgress && typeof onProgress === 'function' ) {
                    const percentCompleted = Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total );
                    onProgress( percentCompleted, progressEvent );
                }
            },
        } );
    } );

    return {
        axios,
        HTTP,
        GET,
        POST,
        PUT,
        DEL,
        sseGet,
        ssePost,
        upload,
        uploadMultiple,
    };
}
