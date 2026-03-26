use serde::{Deserialize, Serialize};

/**
 * 环境数据结构体，用于存储环境相关的监测数据
 * 使用Debug特征以便于调试和打印
 * 使用Serialize和Deserialize特征以便于序列化和反序列化操作
 */
#[derive(Debug, Serialize, Deserialize)]
pub struct EnvData {
    pub temperature: Option<f32>,    // 温度数据，使用Option类型表示可能不存在
    pub humidity: Option<f32>,       // 湿度数据，使用Option类型表示可能不存在
    pub pm25: Option<f32>,           // PM2.5浓度数据，使用Option类型表示可能不存在
    pub timestamp: u64,              // 时间戳，使用无符号64位整数表示
}

/**
 * 设备数据结构体，用于存储设备的基本信息
 * 使用Debug特征以便于调试和打印
 * 使用Serialize和Deserialize特征以便于序列化和反序列化操作
 */
#[derive(Debug, Serialize, Deserialize)]
pub struct DeviceData {
    pub id: String,  // 设备ID，使用字符串类型
    pub name: Option<String>, // 设备名称，使用字符串类型
}