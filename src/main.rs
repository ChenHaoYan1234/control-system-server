use std::{env, path::Path};

mod config;
mod error;

fn main() {
    let args: Vec<String> = env::args().collect();
    let config_file = Path::new(&args[1]);
    match config::Config::load_file(config_file) {
        Ok(config) => unsafe {
            config::CONFIG = Some(config);
        },
        Err(e) => {
            eprintln!("Error loading config file: {}", e);
            std::process::exit(1);
        }
    }
}
