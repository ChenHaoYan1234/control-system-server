use mongodb::Collection;

use crate::database::models::{DeviceData, EnvData};

/// 应用程序状态结构体，用于存储和管理环境数据和设备数据
/// 实现了Clone trait，允许该结构体的实例被克隆
#[derive(Clone)]
pub struct AppStates {
    /// 环境数据集合，存储环境相关的数据
    pub env_data: Collection<EnvData>,
    /// 设备数据集合，存储设备相关的数据
    pub device_data: Collection<DeviceData>,
}
