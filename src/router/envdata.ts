import type { Context } from "koa"
import type { MiddlewareType, EnvDataPostBody } from "./type.js"
import { createEnvData, getLastOneHourEnvDatas, isAvailableDevice } from "../database.ts"
import { buildEnvData } from "../utils.ts"

/**
 * 获取环境数据的异步处理函数
 * @param ctx - Koa上下文对象，包含请求和响应信息
 * @param next - 中间件函数，用于控制流程继续执行
 */
async function envdataGet(ctx: Context, next: MiddlewareType) {
    // 打印请求日志，包含设备UUID，用于调试和监控
    console.log(`GET /envdata?deviceUUID=${ctx.query.deviceUUID}`)
    // 检查deviceUUID参数是否存在或为空，确保请求参数有效性
    if (ctx.query.deviceUUID === undefined || ctx.query.deviceUUID === "") {
        // 如果参数无效，返回400状态码和错误信息，表示客户端请求错误
        ctx.response.status = 400
        ctx.response.body = { error: "deviceUUID is required" }
    } else if (isAvailableDevice(ctx.query.deviceUUID as string) === false) {
        // 如果设备UUID不存在，返回404状态码和错误信息，表示资源未找到
        ctx.response.status = 404
        ctx.response.body = { error: "deviceUUID is not found" }
    } else {
        // 参数有效且设备存在，返回200状态码和最近一小时的环境数据
        ctx.response.status = 200
        ctx.response.body = await getLastOneHourEnvDatas(ctx.query.deviceUUID as string)
    }
    // 执行下一个中间件函数，完成请求处理流程
    await next()
}

/**
 * 处理环境数据POST请求的异步中间件函数
 * @param ctx - 上下文对象，包含请求和响应信息
 * @param next - 中间件函数，用于将控制权传递给下一个中间件
 */
async function envdataPost(ctx: Context, next: MiddlewareType) {
    // 从请求体中获取数据并转换为EnvDataPostBody类型
    const body = ctx.request.body as EnvDataPostBody
    // 打印请求日志，记录POST请求到/envdata端点
    console.log(`POST /envdata`)
    // 检查deviceUUID是否存在
    if (body.deviceUUID === undefined || body.deviceUUID === "") {
        // 如果deviceUUID不存在，返回400错误，表示请求缺少必要参数
        ctx.response.status = 400
        ctx.response.body = { error: "deviceUUID is required" }
    } else if (isAvailableDevice(body.deviceUUID) === false) {
        // 如果deviceUUID不存在于可用设备列表中，返回404错误，表示设备未找到
        ctx.response.status = 404
        ctx.response.body = { error: "deviceUUID is not found" }
    } else if (body.timestamp === undefined) {
        // 如果timestamp不存在，返回400错误，表示请求缺少时间戳参数
        ctx.response.status = 400
        ctx.response.body = { error: "timestamp is required" }
    } else {
        // 如果所有必要参数都存在，构建环境数据对象
        const envdata = buildEnvData(body)
        // 将环境数据保存到数据库，使用deviceUUID关联设备
        await createEnvData(envdata, body.deviceUUID)
        // 返回201状态码，表示资源创建成功
        ctx.response.status = 201
        ctx.response.body = { message: "ok" }
    }
    // 执行下一个中间件
    await next()
}

export { envdataGet, envdataPost }
