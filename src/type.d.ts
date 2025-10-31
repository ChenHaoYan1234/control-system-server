import type mongoose from "mongoose"

/**
 * 环境数据类型定义
 * 包含温度、湿度、PM2.5等环境参数，以及时间戳
 */
declare type EnvDataType = {
    temperature?: number,  // 温度，可选字段
    humidity?: number,     // 湿度，可选字段
    pm25?: number,        // PM2.5数值，可选字段
    timestamp: number      // 时间戳，必填字段
}

/**
 * 设备数据类型定义
 * 包含设备唯一标识符和设备名称
 */
declare type DeviceDataType = {
    deviceUUID: string,    // 设备唯一标识符，必填字段
    deviceName?: string,   // 设备名称，可选字段
}

/**
 * 环境数据模型类型接口
 * 使用索引签名定义一个字符串到Mongoose模型的映射
 */
interface EnvDataModelsType {
    [key: string]: mongoose.Model  // 键为字符串，值为Mongoose模型
}

export {
    EnvDataType,
    DeviceDataType,
    EnvDataModelsType
}
