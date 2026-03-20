import Koa from "koa"
import bodyParser from "@koa/bodyparser"
import { createConnection, updateEnvDataModels } from "./database.ts"
import router from "./router/index.ts"
import { config, load_file } from "./config.ts"
import cors from "@koa/cors"
import http from "http"

if (process.argv[2] != undefined) {
    load_file(process.argv[2])
} else {
    console.error("Please specify the configuration file path.")
    process.exit(1)
}

// 创建数据库连接
await createConnection()

// 更新环境数据模型
await updateEnvDataModels()

// 创建 Koa 应用实例
const app = new Koa()

app.use(cors({
    origin: config?.server.cors_origin,
    maxAge: 3600,
    credentials: true,
}))

// 使用 bodyParser 中间件解析请求体
app.use(bodyParser())

// 注册路由中间件
app.use(router.routes())
// 允许所有 HTTP 方法的请求
app.use(router.allowedMethods())

// 启动服务器，监听 8080 端口
http.createServer(app.callback()).listen(config?.server.port, config?.server.host, ()=>{
    console.log(`Server is running at http://${config?.server.host}:${config?.server.port}`)
})
