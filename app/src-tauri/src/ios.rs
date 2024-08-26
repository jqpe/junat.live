use {
    objc::{msg_send, sel, sel_impl},
    tauri::{App, Manager},
};

/// Enable back/forward navigation using swipe gestures on iOS
pub fn enable_bf_navigation(app: &mut App) {
    let window = app
        .get_webview_window("main")
        .expect("error while getting main window");
    let _ = window.with_webview(|webview| unsafe {
        let () = msg_send![webview.inner(), setAllowsBackForwardNavigationGestures: true];
    });
}
