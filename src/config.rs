use std::{fs::File, path::Path, sync::OnceLock};

use serde::{Deserialize, Serialize};

use crate::error::ConfigError;

// 导入必要的序列化和反序列化特性，以及Debug特性用于调试输出
#[derive(Serialize, Deserialize, Debug)]
pub struct ServerConfig {
    // 服务器主机名，使用字符串表示
    pub host: String,
    // 服务器端口号，使用无符号16位整数
    pub port: u16,
    // CORS跨域资源共享的来源，使用Option<String>表示可能不存在
    pub cors_origin: Option<String>,
}

// 导入必要的序列化和反序列化特性，以及Debug特性用于调试输出
#[derive(Serialize, Deserialize, Debug)]
pub struct DatabaseConfig {
    // 数据库连接URL
    pub protocol: String,
    pub host: String,
    pub port: i16,
    // 数据库用户名
    pub user: String,
    // 数据库密码
    pub password: String,
    // 数据库名称
    pub db_name: String,
    // 认证来源
    pub auth_source: String,
}

// 导入必要的序列化和反序列化特性，以及Debug特性用于调试输出
#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    // 服务器配置
    pub server: ServerConfig,
    // 数据库配置
    pub database: DatabaseConfig,
}

// 为Config实现相关方法
impl Config {
    // 从文件加载配置的方法
    // 参数: path - 配置文件的路径
    // 返回值: Result<Config, ConfigError> - 成功时返回Config结构体，失败时返回ConfigError
    pub async fn load_file(path: &Path) -> Result<Config, ConfigError> {
        // 打开指定路径的文件
        let f = File::open(path)?;
        // 从文件读取内容并反序列化为Config结构体
        let config: Config = serde_json::from_reader(f)?;
        // 返回解析后的配置
        Ok(config)
    }
}

// 全局静态变量，用于存储配置信息
pub static CONFIG: OnceLock<Config> = OnceLock::new();
