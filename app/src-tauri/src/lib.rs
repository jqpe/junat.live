#[cfg(target_os = "ios")]
pub mod ios;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_geolocation::init())
        .setup(|app| {
            #[cfg(target_os = "ios")]
            ios::enable_bf_navigation(app);

            #[cfg(not(target_os = "ios"))]
            let _app = app;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
