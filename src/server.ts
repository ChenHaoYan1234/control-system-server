import Koa from "koa"
import bodyParser from "koa-bodyparser"
import { createConnection, updateEnvDataModels } from "./database.ts"
import router from "./router/index.ts"
import { server_config } from "./config.ts"

// 创建数据库连接
await createConnection()

// 更新环境数据模型
await updateEnvDataModels()

// 创建 Koa 应用实例
const app = new Koa()

// 使用 bodyParser 中间件解析请求体
app.use(bodyParser())

// 注册路由中间件
app.use(router.routes())
// 允许所有 HTTP 方法的请求
app.use(router.allowedMethods())

// 启动服务器，监听 8080 端口
app.listen(server_config.port, () => {
    console.log("Server is running on http://localhost:8080.")
})
