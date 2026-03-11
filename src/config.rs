use std::{fs::File, path::Path};

use serde::{Deserialize, Serialize};

use crate::error::ConfigError;

// 导入必要的序列化和反序列化特性，以及Debug特性用于调试输出
#[derive(Serialize, Deserialize, Debug)]
pub struct ServerConfig {
    // 服务器端口号，使用无符号16位整数
    port: u16,
    // CORS跨域资源共享的来源，使用Option<String>表示可能不存在
    cors_origin: Option<String>,
}

// 导入必要的序列化和反序列化特性，以及Debug特性用于调试输出
#[derive(Serialize, Deserialize, Debug)]
pub struct DatabaseConfig {
    // 数据库连接URL
    url: String,
    // 数据库用户名
    user: String,
    // 数据库密码
    password: String,
    // 数据库名称
    db_name: String,
    // 认证来源
    auth_source: String,
}

// 导入必要的序列化和反序列化特性，以及Debug特性用于调试输出
#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    // 服务器配置
    server: ServerConfig,
    // 数据库配置
    database: DatabaseConfig,
}

// 为Config实现相关方法
impl Config {
    // 从文件加载配置的方法
    // 参数: path - 配置文件的路径
    // 返回值: Result<Config, ConfigError> - 成功时返回Config结构体，失败时返回ConfigError
    pub fn load_file(path: &Path) -> Result<Config, ConfigError> {
        // 打开指定路径的文件
        let f = File::open(path)?;
        // 从文件读取内容并反序列化为Config结构体
        let config: Config = serde_json::from_reader(f)?;
        // 返回解析后的配置
        Ok(config)
    }
}

// 全局静态变量，用于存储配置信息
// 使用Option<Config>表示配置可能不存在
// 使用unsafe关键字表示访问此变量需要unsafe代码块
pub static mut CONFIG: Option<Config> = None;
