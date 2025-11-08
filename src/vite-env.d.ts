/// <reference types="vite/client" />

// TownPass flutterObject type definitions
interface FlutterObject {
    postMessage: (message: string) => void;
    addEventListener: (event: string, handler: (event: MessageEvent) => void) => void;
    removeEventListener: (event: string, handler: (event: MessageEvent) => void) => void;
}

interface Window {
    flutterObject?: FlutterObject;
}
