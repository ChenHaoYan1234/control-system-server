use actix_web::{HttpResponse, Responder, web};

use crate::{database::db::get_devices, route::states::AppStates};

async fn device_get(data: web::Data<AppStates>) -> impl Responder {
    let devices = get_devices(&data.device_data).await;
    let devices_json = serde_json::to_string(&devices).unwrap();
    HttpResponse::Ok().body(format!(
        "{{\"message\": \"OK\", \"devices\": {}",
        devices_json
    ))
}

pub fn device(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/").route(web::get().to(device_get)));
}
