import axios from 'axios';
import { getCookie } from 'cookies-next';
import { showToast } from '@/lib/toast';
import { createLoginUrl } from '@/lib/redirect';

const COZE_API_URL = process.env.NEXT_PUBLIC_COZE_API_URL;

export default function httpCreator( { baseURL = '/baseApi', timeout = 1000 * 60 * 1, headers = {} } ) {
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

    // 检查用户信息是否存在
    const checkUserInfo = () => {
        const userInfo = localStorage.getItem( 'userInfo' );
        const token = getCookie( 'SA-TOKEN' );

        if ( !userInfo || !token ) {
            console.log( '用户信息或token不存在，跳转登录页' );
            // 清除所有相关数据
            localStorage.removeItem( 'userInfo' );

            // 跳转登录页
            const loginUrl = createLoginUrl();
            window.location.href = loginUrl;
            return false;
        }

        // 验证userInfo是否为有效的JSON
        const parsedUserInfo = JSON.parse( userInfo );
        if ( !parsedUserInfo.id || !parsedUserInfo.userAccount ) {
            console.log( '用户信息格式无效，跳转登录页' );
            localStorage.removeItem( 'userInfo' );

            const loginUrl = createLoginUrl();
            window.location.href = loginUrl;
            return false;
        }

        return true;
    };

    // 请求拦截器
    HTTP.interceptors.request.use(
        config => {
            const currentToken = getCookie( 'SA-TOKEN' );
            if ( currentToken ) {
                config.headers['token'] = currentToken;
                // config.headers['SA-TOKEN'] = currentToken;
                // config.headers = {
                // 	...config.headers,
                // 	...headers
                // }
            }
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
                    localStorage.removeItem( 'userInfo' );

                    const loginUrl = createLoginUrl();
                    console.log( '跳转登录页，当前页面:', window.location.href );
                    window.location.href = loginUrl;
                }
            } else {
                // 检查是否存在userInfo
                // if (!checkUserInfo() && window.location.pathname !== '/login') {
                // 	return Promise.reject(new Error('用户未登录'));
                // }
            }

            // 显示错误信息
            const errorMessage =
                error.response?.data?.message || error.response?.data?.msg || error.message || '请求失败';
            showToast.error( errorMessage );

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
        const es = new EventSource( baseURL + url );

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
        // const TargetUrl = `${baseURL}${url}`
        const TargetUrl = `${COZE_API_URL}/v1${url}`

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
                                new Error("Parse error 请手动检查.", JSON.parse(line.replace("data:", "").trim()))
                                showToast.error("Parse error 请手动检查.")
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
