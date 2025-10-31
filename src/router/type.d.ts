/**
 * 定义中间件类型，是一个无参数返回Promise<void>的函数类型
 */
declare type MiddlewareType = () => Promise<void>

/**
 * 环境数据请求体接口定义
 * 包含设备UUID、时间戳以及可选的环境参数
 */
interface EnvDataPostBody {
    deviceUUID: string,    // 设备唯一标识符
    timestamp: number,     // 数据采集时间戳
    temperature?: number,  // 可选：温度值
    humidity?: number,     // 可选：湿度值
    pm25?: number          // 可选：PM2.5值
}

/**
 * 设备数据请求体接口定义
 * 包含设备UUID和设备名称
 */
interface DeviceDataPostBody {
    deviceUUID: string,    // 设备唯一标识符
    deviceName: string,    // 设备名称
}

export { MiddlewareType, EnvDataPostBody, DeviceDataPostBody }
