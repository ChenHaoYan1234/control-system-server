use std::{env, path::Path};

use actix_cors::Cors;
use actix_web::{App, HttpServer, web};

use crate::{
    config::{CONFIG, Config},
    database::models::{DeviceData, EnvData},
    route::states::AppStates,
};

mod config;
mod database;
mod error;
mod route;

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
    let db = database::db::create_connection().await;

    // 从数据库获取两个集合：环境数据集合和设备数据集合
    let env_data = db.collection::<EnvData>("env_data");
    let device_data = db.collection::<DeviceData>("device_data");

    // 创建应用状态实例，包含环境数据和设备数据集合
    let appstates = AppStates {
        env_data,
        device_data,
    };

    // 创建HTTP服务器，配置应用数据并启动服务
    // 使用move闭包捕获appstates，使其在服务器生命周期内可用
    HttpServer::new(move || {
        let cors = match config.cors_origin.as_ref() {
            Some(cors_origin) => Cors::default()
                .allowed_origin(cors_origin)
                .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
                .allow_any_header()
                .supports_credentials()
                .max_age(3600),
            None => Cors::default(),
        };

        App::new()
            .wrap(cors)
            .app_data(web::Data::new(appstates.clone()))
    })
    // 绑定配置的主机和端口
    .bind((config.host.clone(), config.port))?
    .run()
    .await
}
