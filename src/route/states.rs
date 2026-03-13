use mongodb::Collection;

use crate::database::models::{DeviceData, EnvData};

#[derive(Clone)]
pub struct AppStates {
    pub env_data: Collection<EnvData>,
    pub device_data: Collection<DeviceData>,
}