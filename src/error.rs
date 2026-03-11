use std::fmt;

/// 自定义的配置错误类型枚举，用于表示配置文件处理过程中可能出现的错误
/// 使用 #[derive(Debug)] 使其可以调试打印
#[derive(Debug)]
pub enum ConfigError {
    /// IO 错误变体，用于包装底层 std::io::Error
    IoError(std::io::Error),
    /// 解析错误变体，用于包装 serde_json::Error
    ParsingError(serde_json::Error),
}

/// 实现 From<std::io::Error> 特性，允许将 std::io::Error 自动转换为 ConfigError
impl From<std::io::Error> for ConfigError {
    /// 转换函数，将 std::io::Error 转换为 ConfigError::IoError
    fn from(value: std::io::Error) -> Self {
        ConfigError::IoError(value)
    }
}

/// 实现 From<serde_json::Error> 特性，允许将 serde_json::Error 自动转换为 ConfigError
impl From<serde_json::Error> for ConfigError {
    /// 转换函数，将 serde_json::Error 转换为 ConfigError::ParsingError
    fn from(value: serde_json::Error) -> Self {
        ConfigError::ParsingError(value)
    }
}

/// 实现 fmt::Display 特性，为 ConfigError 提供用户友好的错误信息显示
impl fmt::Display for ConfigError {
    /// 格式化函数，根据错误类型生成相应的错误信息
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            // 处理 IO 错误变体，添加 "IO error: " 前缀
            ConfigError::IoError(e) => write!(f, "IO error: {}", e),
            // 处理解析错误变体，添加 "Parsing error: " 前缀
            ConfigError::ParsingError(e) => write!(f, "Parsing error: {}", e),
        }
    }
}
