import Router from "@koa/router"
import { envdataGet, envdataPost } from "./envdata.ts"
import { deviceGet, devicePost, devicePut } from "./device.ts"

/**
 * 创建一个新的路由实例
 */
const router = new Router()

router.get("/envdata", envdataGet) // 路由配置：GET请求到/envdata路径，使用envdataGet处理函数
router.post("/envdata", envdataPost) // 路由配置：POST请求到/envdata路径，使用envdataPost处理函数

router.get("/device", deviceGet) // 路由配置：GET请求到/device路径，使用deviceGet处理函数
router.post("/device", devicePost) // 路由配置：POST请求到/device路径，使用devicePost处理函数
router.put("/device", devicePut) // 路由配置：PUT请求到/device路径，使用devicePut处理函数

export default router
