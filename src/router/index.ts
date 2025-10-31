import Router from "koa-router"
import { envdataGet, envdataPost } from "./envdata.ts"
import { deviceGet, devicePost } from "./device.ts"

/**
 * 创建一个新的路由实例
 */
const router = new Router()

/**
 * 定义获取环境数据的GET请求路由
 * 当访问/envdata路径且使用GET方法时，将调用envdataGet处理函数
 */
router.get("/envdata", envdataGet)
/**
 * 定义添加环境数据的POST请求路由
 * 当访问/envdata路径且使用POST方法时，将调用envdataPost处理函数
 */
router.post("/envdata", envdataPost)

/**
 * 定义获取设备信息的GET请求路由
 * 当访问/device路径且使用GET方法时，将调用deviceGet处理函数
 */
router.get("/device", deviceGet)
/**
 * 定义添加设备信息的POST请求路由
 * 当访问/device路径且使用POST方法时，将调用devicePost处理函数
 */
router.post("/device", devicePost)

export default router
