import type { Context } from "koa";
import type { DeviceDataGetResponse, DeviceDataPostBody, DeviceDataPutBody, MiddlewareType } from "./type.d.ts";
import { createDevice, getDeviceNameByUUID, getDevices, isAvailableDevice, updateDeviceName } from "../database.ts";
import { isAvailableUUID } from "../utils.ts";

/**
 * 处理获取设备列表的异步中间件函数
 * @param ctx - 上下文对象，包含请求和响应信息
 * @param next - 下一个中间件函数
 */
async function deviceGet(ctx: Context, next: MiddlewareType) {
    console.log("GET /device")  // 记录请求路径的日志
    ctx.response.status = 200  // 设置响应状态码为200
    const _devices = await getDevices()  // 获取设备列表数据
    const devices: DeviceDataGetResponse[] = []

    _devices.forEach((device) => {
        devices.push({
            deviceUUID: device.deviceUUID,
            deviceName: device.deviceName ? device.deviceName : device.deviceUUID,
        })
    })

    ctx.response.body = devices  // 将设备列表设置为响应体
    await next()  // 执行下一个中间件
}


/**
 * 根据设备UUID获取设备名称的异步处理函数
 * @param ctx - 上下文对象，包含请求和响应信息
 * @param next - 中间件函数，用于传递控制权到下一个中间件
 */
async function deviceNameGet(ctx: Context, next: MiddlewareType) {
    // 打印请求日志，显示访问的设备UUID
    console.log(`GET /device/${ctx.params.deviceUUID}`)
    if (!isAvailableUUID(ctx.params.deviceUUID)) {
        // 如果设备UUID无效，返回400状态码和错误信息
        ctx.response.status = 400
        ctx.response.body = { message: "deviceUUID is invalid" }
    } else if (!isAvailableDevice(ctx.params.deviceUUID)) {
        // 如果设备不可用，返回404状态码和错误信息
        ctx.response.status = 404
        ctx.response.body = {
            message: "deviceUUID not found"
        }
    } else {
        // 将UUID转换为小写后查询设备名称
        const device = await getDeviceNameByUUID(ctx.params.deviceUUID.toLowerCase())
        if (!device) {
            // 如果查询不到设备，返回404状态码和错误信息
            ctx.response.status = 404
            ctx.response.body = {
                message: "deviceUUID not found"
            }
        } else {
            // 查询成功，返回200状态码和设备信息
            ctx.response.status = 200
            ctx.response.body = {
                deviceUUID: device.deviceUUID,
                // 如果设备名称存在则返回名称，否则返回UUID
                deviceName: device.deviceName ? device.deviceName : device.deviceUUID
            }
        }
    }
    // 执行下一个中间件
    await next()
}

/**
 * 处理设备注册请求的异步函数
 * @param ctx - 上下文对象，包含请求和响应信息
 * @param next - 中间件函数，用于将控制权传递给下一个中间件
 */
async function devicePost(ctx: Context, next: MiddlewareType) {
    // 记录请求日志
    console.log("POST /device")
    // 获取请求体并转换为DeviceDataPostBody类型
    const body = ctx.request.body as DeviceDataPostBody
    body.deviceUUID = body.deviceUUID.toLowerCase()
    // 检查deviceUUID是否存在或为空
    if (!body.deviceUUID) {
        // 如果deviceUUID不存在或为空，返回400错误状态码
        ctx.response.status = 400
        // 设置错误响应体
        ctx.response.body = {
            message: "deviceUUID is required"
        }
    } else if (!isAvailableUUID(body.deviceUUID)) {
        // 如果deviceUUID格式不正确，返回400错误状态码
        ctx.response.status = 400
        ctx.response.body = { message: "deviceUUID is invalid" }
    } else if (isAvailableDevice(body.deviceUUID)) {
        ctx.response.status = 409
        ctx.response.body = {
            message: "deviceUUID is already in use"
        }
    } else {
        // 如果deviceUUID有效，则创建设备
        body.deviceUUID = body.deviceUUID.toLowerCase()
        await createDevice(body)
        // 返回201状态码表示资源创建成功
        ctx.response.status = 201
        // 设置成功响应体
        ctx.response.body = {
            message: "device created"
        }
    }
    // 等待下一个中间件或处理函数执行完成
    await next()
}

/**
 * 处理设备信息更新的异步中间件函数
 * @param ctx - 上下文对象，包含请求和响应信息
 * @param next - 下一个中间件函数
 */
async function devicePut(ctx: Context, next: MiddlewareType) {
    // 打印日志，记录PUT请求路径
    console.log("PUT /device")
    // 获取请求体并断言为DeviceDataPutBody类型
    const body = ctx.request.body as DeviceDataPutBody
    // 检查请求体中是否包含必要的设备UUID和设备名称
    if (!body.deviceUUID || !body.deviceName) {
        // 如果缺少必要参数，返回400状态码和错误信息
        ctx.response.status = 400
        ctx.response.body = {
            message: "deviceUUID or deviceName are required"
        }
    } else if (!isAvailableDevice(body.deviceUUID)) {
        // 检查设备UUID是否存在，如果不存在则返回404状态码和错误信息
        ctx.response.status = 404
        ctx.response.body = {
            message: "deviceUUID not found"
        }
    } else {
        // 如果参数有效且设备存在，则更新设备名称
        await updateDeviceName(body.deviceUUID, body.deviceName)
        // 返回200状态码，表示设备名称更新成功
        ctx.response.status = 200
        ctx.response.body = {
            message: "device name updated"
        }
    }

    // 调用下一个中间件函数
    await next()
}

export { deviceGet, devicePost, devicePut, deviceNameGet }
