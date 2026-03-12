use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct EnvData {
    pub temperature: Option<f32>,
    pub humidity: Option<f32>,
    pub pm25: Option<f32>,
    pub timestamp: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DeviceData {
    pub id: String,
    pub name: String,
}