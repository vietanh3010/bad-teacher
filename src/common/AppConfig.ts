

export default class AppConfig {
    static BASE_SOCKET_URL = import.meta.env.VITE_APP_BASE_SOCKET_URL;
    static WS_PATH = "/ws";
    static WS_PORT = 8000;
    static OCR_NAMESPACE = "/ocr";
    static CALL_NAMESPACE = "/call";
}