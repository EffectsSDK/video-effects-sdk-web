export type ErrorHandler = (n: ErrorObject) => void;
declare class _ErrorBus {
    private static _instance;
    static getInstance(): _ErrorBus;
    private constructor();
    messageLog: ErrorObject[];
    private subscribers;
    subscribe(handler: ErrorHandler): void;
    unsubscribe(handler: ErrorHandler): void;
    notify(error: ErrorObjectLight): void;
}
export declare const ErrorBus: _ErrorBus;
export interface ErrorObject {
    message: string;
    type: ErrorType;
    code?: ErrorCode;
    emitter?: ErrorEmitter;
    cause?: Error;
    data?: any;
}
type ErrorObjectLight = Omit<ErrorObject, "type"> & {
    type?: ErrorType;
};
export declare enum ErrorCode {
    GPU_DEVICE_LOST = 1001,
    APP_CREATION_ISSUE = 1002,
    GPU_UNCAPTUREDERROR = 1010,
    GPU_INFERENCE_INCONSISTENCY = 1011,
    CPU_INFERENCE_INCONSISTENCY = 1012,
    TEST_INFERENCE_PASSED = 1015,
    SESSION_INITIALIZATION_FAILED = 1020,
    SESSION_INITIALIZATION_ISSUE = 1021,
    LOADER_ISSUE = 1023,
    PRESET_ISSUE = 1024,
    SESSION_INITIALIZATION_SUCCESS = 3020,
    MODEL_INITIALIZATION_ISSUE = 1022,
    EFFECT_INITIALIZATION_ISSUE = 1025,
    EFFECT_INITIALIZATION_SUCCESS = 3021,
    NO_VIDEO_TRACK = 1030,
    INFERENCE_RUN_ISSUE = 1040,
    RENDERING_ISSUE = 1050,
    ENQUEUE_FRAME_ISSUE = 1060,
    READABLE_STREAM_ISSUE = 1061,
    CPU_FALLBACK = 3001
}
export declare enum ErrorType {
    INFO = "info",
    WARNING = "warning",
    ERROR = "error"
}
export declare enum ErrorEmitter {
    TSVB = "tsvb",
    EMULATOR = "emulator",
    COMPONENTS_SYSTEM = "components_system",
    SRTEAM_PROCESSOR = "stream_processor",
    ML_INFERENCE = "ml_inference",
    SESSION_MANAGER = "session_manager",
    SESSION_RUNNER = "session_runner",
    PRESET_INIT = "preset_init",
    RENDERER = "renderer",
    RECORDER = "recorder",
    WORKER_TIMERS = "worker_timers",
    ABSTRACT_EFFECT = "effects_loader",
    EFFECT_VIRTUAL_BACKGROUND = "effect_virtual_background",
    EFFECT_COLOR_CORRECTION = "effect_color_correction",
    EFFECT_COLOR_FILTER = "effect_color_filter",
    EFFECT_SMART_ZOOM = "effect_smart_zoom",
    EFFECT_LOW_LIGHT = "effect_low_light"
}
export {};
