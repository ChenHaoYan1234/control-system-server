use actix_web::{HttpResponse, web};

async fn timestamp_get() -> HttpResponse {
    HttpResponse::Ok().body(format!(
        "{{\"timestamp\":{}}}",
        chrono::Utc::now().timestamp()
    ))
}

pub fn timestamp(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/").route(web::get().to(timestamp_get)));
}
