import type { Context } from "koa";
import type { DeviceDataPostBody, MiddlewareType } from "./type.d.ts";
import { createDevice, getDevices } from "../database.ts";

/**
 * 处理设备GET请求的异步中间件函数
 * @param ctx - 上下文对象，包含请求和响应信息
 * @param next - 下一个中间件函数
 */
async function deviceGet(ctx: Context, next: MiddlewareType) {
    console.log("GET /device")  // 记录请求路径的日志
    ctx.response.status = 200  // 设置响应状态码为200
    const devices = await getDevices()  // 获取设备列表数据
    ctx.response.body = devices  // 将设备列表设置为响应体
    await next()  // 执行下一个中间件
}

/**
 * 处理设备POST请求的异步函数
 * @param ctx - 上下文对象，包含请求和响应信息
 * @param next - 中间件函数，用于将控制权传递给下一个中间件
 */
async function devicePost(ctx: Context, next: MiddlewareType) {
    // 记录请求日志
    console.log("POST /device")
    // 获取请求体并转换为DeviceDataPostBody类型
    const body = ctx.request.body as DeviceDataPostBody
    // 检查deviceUUID是否存在或为空
    if (body.deviceUUID === undefined || body.deviceUUID === ""){
        // 如果deviceUUID不存在或为空，返回400错误状态码
        ctx.response.status = 400
        // 设置错误响应体
        ctx.response.body = {
            message: "deviceUUID is required"
        }
    }
    else {
        // 如果deviceUUID有效，则创建设备
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

export { deviceGet, devicePost }
