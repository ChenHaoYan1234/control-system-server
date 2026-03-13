use std::{env, path::Path};

use actix_web::{App, HttpServer};

use crate::config::{CONFIG, Config};

mod config;
mod database;
mod error;

#[actix_web::main]
// 这是一个异步主函数，用于启动应用程序并加载配置
async fn main() -> std::io::Result<()> {
    // 收集命令行参数到一个字符串向量中
    let args: Vec<String> = env::args().collect();
    // 使用第一个命令行参数作为配置文件的路径
    let config_file = Path::new(&args[1]);
    // 异步加载配置文件，并处理可能的结果
    match Config::load_file(config_file).await {
        // 如果配置加载成功
        Ok(config) => {
            // 将加载的配置设置为全局配置
            CONFIG.get_or_init(|| config);
            // 打印成功消息
            println!("Config loaded successfully");
            // 打印加载的配置内容
            println!("Config: {:?}", CONFIG.get().unwrap());
        }
        // 如果配置加载失败
        Err(e) => {
            // 打印错误信息到标准错误输出
            eprintln!("Error loading config file: {}", e);
            // 以非零状态码退出程序，表示错误
            std::process::exit(1);
        }
    }

    let config = &CONFIG.get().unwrap().server;

    // 创建数据库连接
    database::db::create_connection().await;

    HttpServer::new(|| App::new())
        .bind((config.host.clone(), config.port))?
        .run()
        .await
}
