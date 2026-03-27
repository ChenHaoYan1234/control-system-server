use actix_web::{HttpResponse, Responder, web};
use uuid::Uuid;

use crate::{
    database::db::{get_device_by_id, get_devices},
    route::states::AppStates,
};

async fn device_get(data: web::Data<AppStates>) -> impl Responder {
    let devices = get_devices(&data.device_data).await;
    let devices_json = serde_json::to_string(&devices).unwrap();
    HttpResponse::Ok().body(format!(
        "{{\"message\": \"OK\", \"devices\": {}}}",
        devices_json
    ))
}

async fn device_get_by_id(
    path: web::Path<(String,)>,
    data: web::Data<AppStates>,
) -> impl Responder {
    let uuid = path.into_inner().0;
    if uuid.parse::<Uuid>().is_err() {
        return HttpResponse::BadRequest().body("{\"message\": \"invalid device UUID\"}");
    }
    let response = match get_device_by_id(&data.device_data, &uuid.to_lowercase()).await {
        Some(device) => HttpResponse::Ok().body(format!(
            "{{deviceUUID: \"{}\", deviceName: \"{}\"}}",
            device.id,
            device.name.unwrap_or(device.id.clone())
        )),
        None => HttpResponse::NotFound().body("{\"message\": \"device not found\"}"),
    };
    response
}

pub fn device(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/").route(web::get().to(device_get)));
    cfg.service(web::resource("/{device_id}").route(web::get().to(device_get_by_id)));
}
