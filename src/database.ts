import mongoose from "mongoose";
import { mongoDB } from "./config.ts";
import type { DeviceDataType, EnvDataModelsType, EnvDataType } from "./type.d.ts";
import { getLastOneHour } from "./utils.ts";

/**
 * 设备数据模型架构定义
 * 使用mongoose创建设备数据的Schema结构
 */
const DeviceDataSchema = new mongoose.Schema({
    deviceUUID: {
        type: "UUID",  // 设备UUID字段，类型为UUID
        required: true  // 该字段为必填项
    },
    deviceName: String,  // 设备名称字段，类型为字符串
})

/**
 * 根据DeviceDataSchema创建名为"DeviceData"的模型
 * 该模型将用于操作MongoDB中的设备数据集合
 */
const DeviceDataModel = mongoose.model("DeviceData", DeviceDataSchema)

const EnvDataSchema = new mongoose.Schema({
    temperature: Number,
    humidity: Number,
    pm25: Number,
    timestamp: {
        type: Number,
        required: true
    }
}, { timestamps: true })

let EnvDataModels: EnvDataModelsType = {}



/**
 * 创建与MongoDB数据库的连接
 * 这是一个异步函数，使用mongoose库连接到MongoDB数据库
 */
async function createConnection() {
    // 使用mongoose的connect方法建立连接
    // 传入数据库URL和认证信息
    await mongoose.connect(mongoDB.url, {
        // 数据库用户名
        user: mongoDB.user,
        // 数据库密码
        pass: mongoDB.password,
        // 要连接的数据库名称
        dbName: mongoDB.dbName,
        // 指定MongoDB认证的数据库来源
        authSource: mongoDB.authSource,
    })
}

async function closeConnection() {
    await mongoose.connection.close()
}

/**
 * 获取所有设备信息
 * @returns 返回设备数组，每个设备包含UUID和可选的设备名称
 */
async function getDevices() {
    // 从数据库中查询所有设备数据
    const _devices = await DeviceDataModel.find({})
    // 创建一个空数组用于存储处理后的设备数据
    const devices: Array<DeviceDataType> = []
    // 遍历查询到的设备数据
    _devices.forEach((item) => {
        // 创建一个新的设备对象，只包含deviceUUID
        const _device: DeviceDataType = {
            deviceUUID: item.deviceUUID.toString()
        }
        // 如果设备名称存在且不为null，则将其添加到设备对象中
        if (item.deviceName !== undefined && item.deviceName !== null) _device.deviceName = item.deviceName
        // 将处理后的设备对象添加到数组中
        devices.push(_device)
    })
    // 返回处理后的设备数组
    return devices
}

/**
 * 创建设备的异步函数
 * @param device - 设备数据对象，类型为DeviceDataType
 * @returns 无返回值
 */
async function createDevice(device: DeviceDataType) {
    // 使用DeviceDataModel创建设备数据实例
    const _device = await DeviceDataModel.create(device)
    // 保存设备数据到数据库
    await _device.save()
    // 重置环境数据模型对象
    EnvDataModels = {}
    // 更新环境数据模型
    await updateEnvDataModels()
}

/**
 * 更新环境数据模型函数
 * 该函数会获取所有设备，并为每个设备创建对应的环境数据模型
 */
async function updateEnvDataModels() {
    // 获取所有设备列表
    const devices = await getDevices()
    // 遍历每个设备，为其创建对应的环境数据模型
    devices.forEach(device => {
        // 使用设备的UUID作为模型名称，创建新的数据模型并存储到EnvDataModels对象中
        EnvDataModels[device.deviceUUID.toString()] = mongoose.model(device.deviceUUID.toString(), EnvDataSchema)
    })
}

async function createEnvData(envData: EnvDataType, deviceUUID: string) {
    const _envData = await EnvDataModels[deviceUUID].create(envData)
    await _envData.save()
}

/**
 * 获取指定设备过去一小时的环境数据
 * @param deviceUUID 设备的唯一标识符
 * @returns 返回包含过去一小时环境数据的数组
 */
async function getLastOneHourEnvDatas(deviceUUID: string) {
    const _envdatas: Array<EnvDataType> = await EnvDataModels[deviceUUID].find({ createdAt: { $gte: getLastOneHour() } }).sort({ createdAt: -1 })
    const envdatas: Array<EnvDataType> = []
    // 清除读取到的垃圾数据
    _envdatas.forEach(envdata => {
            const _envdata: EnvDataType = { timestamp: envdata.timestamp }
            if (envdata.temperature !== undefined)
                _envdata.temperature = envdata.temperature
            if (envdata.humidity !== undefined)
                _envdata.humidity = envdata.humidity
            if (envdata.pm25 !== undefined)
                _envdata.pm25 = envdata.pm25
            envdatas.push(_envdata)
        });
    return envdatas
}

/**
 * 检查指定UUID的设备是否可用
 * @param deviceUUID 设备的唯一标识符
 * @returns 返回布尔值，表示设备是否可用
 */
function isAvailableDevice(deviceUUID: string) {
    // 如果EnvDataModels对象中存在该deviceUUID对应的值，则返回true，否则返回false
    return EnvDataModels[deviceUUID] ? true : false
}

export { createConnection, updateEnvDataModels, createDevice, createEnvData, getLastOneHourEnvDatas, isAvailableDevice, getDevices, closeConnection }
