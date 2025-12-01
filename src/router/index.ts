import Router from "@koa/router"
import { envdataGet, envdataPost } from "./envdata.ts"
import { deviceGet, deviceNameGet, devicePost, devicePut } from "./device.ts"
import { timestampGet } from "./timestamp.ts"
import { server_config } from "../config.ts"

/**
 * 创建一个新的路由实例
 */
const router = new Router({
    prefix: server_config.api_prefix // 设置路由前缀
})

router.get("/envdata", envdataGet) // 路由配置：GET请求到/envdata路径，使用envdataGet处理函数
router.post("/envdata", envdataPost) // 路由配置：POST请求到/envdata路径，使用envdataPost处理函数

router.get("/device", deviceGet) // 路由配置：GET请求到/device路径，使用deviceGet处理函数
router.get("/device/:deviceUUID", deviceNameGet) // 路由配置：GET请求到/device/:deviceUUID路径，使用deviceNameGet处理函数
router.post("/device", devicePost) // 路由配置：POST请求到/device路径，使用devicePost处理函数
router.put("/device", devicePut) // 路由配置：PUT请求到/device路径，使用devicePut处理函数

// 路由配置，处理GET请求到"/timestamp"路径
// 当访问该路径时，将调用timestampGet函数进行处理
router.get("/timestamp", timestampGet)

export default router
