import type { Context } from "koa";
import type { MiddlewareType } from "./type.js";

/**
 * 获取当前时间戳的中间件函数
 * @param ctx - Koa上下文对象，包含请求和响应信息
 * @param next - 下一个中间件函数
 */
async function timestampGet(ctx: Context, next: MiddlewareType) {
    ctx.body = {
        timestamp: Date.now() / 1000 // 转换为秒
    }
    await next()
}

export { timestampGet }
