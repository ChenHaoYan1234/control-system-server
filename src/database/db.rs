use mongodb::{Client, Database, options::ClientOptions};

use crate::config::CONFIG;

/// 创建MongoDB数据库连接的异步函数
/// 该函数根据配置信息构建连接字符串并尝试建立连接
pub async fn create_connection() -> Database {
    // 获取全局配置中的数据库配置部分
    let config = &CONFIG.get().unwrap().database;
    // 使用format宏构建MongoDB连接字符串
    // 包含协议、用户名、密码、主机和端口信息
    let url = format!(
        "{}://{}:{}@{}:{}/?authSource={}",
        config.protocol, config.user, config.password, config.host, config.port, config.auth_source
    );
    // 尝试解析连接字符串为客户端选项
    // 使用match处理解析结果，成功则继续，失败则打印错误并退出程序
    let mut client_options = match ClientOptions::parse(url).await {
        Ok(client_options) => client_options,
        Err(e) => {
            eprintln!("Failed to parse MongoDB connection string: {}", e);
            std::process::exit(1);
        }
    };

    client_options.app_name = Some(config.db_name.clone());

    let client = match Client::with_options(client_options) {
        Ok(client) => client,
        Err(e) => {
            eprintln!("Failed to connect to MongoDB: {}", e);
            std::process::exit(1);
        }
    };

    client.database(&config.db_name)
}
