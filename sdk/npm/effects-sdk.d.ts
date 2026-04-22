declare interface AppendSticker {
    url: string;
    promise: any;
    silenceMode?: boolean;
}

export declare interface BackgroundOptions {
    type?: string;
}

export declare type BackgroundSource = string | MediaStream | ImageBitmap | MediaStreamTrack | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas;

/**
 * @inline
 */
export declare type ChromaKeySettings = {
    /** A number from 0 to 1. Controls how close a color must be to the key color to be removed. */
    threshold: number;
    /** A number from 0 to 1. Controls the softness of the edge between keyed and unkeyed pixels. */
    softness: number;
    /**  A number from 0 to 1. Removes green tint caused by color spill. */
    detint: number;
    /** A color in the format 0x00ff00. The base color to be keyed out. */
    keyColor: number;
};

export declare type ClassType<A extends Keys> = Extract<Tuples<Keys>, [A, any]>[1];

/**
 * Configuration for the Color Correction effect.
 *
 * All fields are optional when passed through `setConfig`; only provided
 * fields are updated.
 */
export declare interface ColorCorrectionConfig {
    /**
     * Enables fully automatic color correction.
     *
     * When `true`, the effect analyzes each frame and automatically drives
     * white balance, contrast and exposure. When `false`, only the manual
     * parameters are applied.
     *
     * @default true
     */
    autoMode: boolean;
    /**
     * Overall strength of the automatic correction.
     *
     * Controls power of auto-driven correction (exposure, contrast
     * and white balance strength).
     *
     * Range: [0, 1].
     *
     * @default 1
     */
    power: number;
    /**
     * Strength of the automatic white balance correction.
     *
     * `0` disables auto white balance; any value greater than `0` enables it
     * and controls how strongly the correction is applied.
     *
     * Ignored when `autoMode` is `true` (in that case white balance is already
     * controlled by auto mode together with contrast and exposure). When
     * `autoMode` is `false`, this value turns on auto white balance without
     * affecting contrast or exposure.
     *
     * Range: [0, 1].
     *
     * @default 0
     */
    whiteBalance: number;
    /**
     * Manual exposure adjustment.
     *
     * Negative values darken the image, positive values brighten it.
     * Applied only when auto correction is not driving exposure.
     *
     * Range: [-1, 1].
     *
     * @default 0
     */
    exposure: number;
    /**
     * Manual color temperature adjustment (cool to warm).
     *
     * Negative values shift the image toward cool, positive values toward warm.
     *
     * Range: [-1, 1].
     *
     * @default 0
     */
    temperature: number;
    /**
     * Manual tint adjustment.
     *
     * Range: [-1, 1].
     *
     * @default 0
     */
    tint: number;
    /**
     * Manual vibrance adjustment.
     *
     * Range: [-1, 1].
     *
     * @default 0
     */
    vibrance: number;
    /**
     * Manual local-contrast adjustment.
     *
     * Applied only when auto correction is not driving contrast.
     *
     * Range: [-1, 1].
     *
     * @default 0
     */
    contrast: number;
    /**
     * Minimum interval (in milliseconds) between two automatic analyses of
     * the frame. Larger values reduce CPU/GPU load but slow down the reaction
     * to scene changes. Only relevant when `autoMode` or `whiteBalance` is
     * enabled.
     *
     * Range: [0, 5000].
     *
     * @default 200
     */
    updatePeriod: number;
    /**
     * Developer feature: enables or disables the color-correction shader pass.
     *
     * Intended for debugging and A/B comparisons rather than end-user configuration.
     *
     * Range: [0, 1].
     *
     * @default 1
     */
    filterPart: number;
}

export declare interface ColorFilterConfig {
    part: number;
    power: number;
    lut: File | string;
    capacity: number;
    promise?: PromiseContainer;
}

declare abstract class Component {
    setOptions(options?: Options): void;
    show(): void;
    hide(): void;
    onLoaded(f: Function): void;
    onBeforeShow(f: Function): void;
    onAfterShow(f: Function): void;
    onBeforeHide(f: Function): void;
    onAfterHide(f: Function): void;
    isVisible(): boolean;
    getOptions(): Options;
}

export declare interface ComponentArguments<K extends Keys> {
    component: SingleKey<K>;
    options?: K extends OptionsKeys ? Partial<OptionsMap[K]> : never;
}

declare type ComponentPlacement = "top-left" | "bottom-left" | "center" | "top-right" | "bottom-right" | "custom";

declare interface ComponentPosition {
    x: number;
    y: number;
    placement: ComponentPlacement;
}

export declare type ComponentsMap = typeof componentsMap;

export declare const componentsMap: {
    overlay_screen: typeof OverlayScreen;
    watermark: typeof Watermark;
    lowerthird_1: typeof LtLeftTextbox;
    lowerthird_2: typeof LtHorizontalMirror;
    lowerthird_3: typeof LtSlideBold;
    lowerthird_4: typeof LtDoubleSlideRect;
    lowerthird_5: typeof LtTwoSlideRects;
    stickers: typeof Stickers;
};

export declare interface Coord {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

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
    CPU_FALLBACK = 3001,
    RENDER_CONTEXT_LOST = 3030,
    RENDER_CONTEXT_RESTORED = 3031,
    RENDER_CONTEXT_REBUILT = 3032,
    OUTPUT_STREAM_INVALIDATED = 1062,
    RENDER_CONTEXT_REBUILD_FAILED = 1063
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

export declare interface ErrorObject {
    message: string;
    type: ErrorType;
    code?: ErrorCode;
    emitter?: ErrorEmitter;
    cause?: Error;
    data?: any;
}

export declare enum ErrorType {
    INFO = "info",
    WARNING = "warning",
    ERROR = "error"
}

export declare class FaceCombiner {
    setID(id: number): void;
    getID(): number;
    checkSame(coord: Coord): boolean;
    getRect(): {
        x1: number;
        y1: number;
        width: number;
        height: number;
    };
    getCoord(): {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    };
    getSquare(): number;
    getCenter(): {
        x: number;
        y: number;
    };
    isEqual(sample: FaceCombiner, accuracity: number, canvasHeight?: number, canvasWidth?: number): boolean;
    setCoord(coord: Coord): void;
}

export declare type FrameFormat = "RGBX" | "I420";

export declare interface IRecorder {
    start(): boolean;
    stop(): boolean;
    pause(): boolean;
    resume(): boolean;
    getRecord(): Promise<Blob | undefined>;
    setAudioTracks(tracks: MediaStreamTrack[]): void;
    setVideoTrack(track: MediaStreamTrack): void;
    setSDKVideoTrack(track: MediaStreamTrack): void;
    setMimeType(mimeType: string): void;
    isActive(): boolean;
    onStart(f: () => void): void;
    getDuration(): number;
    getSDKTracks(): SDKTracks;
    destroy(): void;
}

export declare type Keys = keyof ComponentsMap;

export declare enum LayoutMode {
    SEGMENTATION = "segmentation",
    FULL = "full",
    HIDE = "hide",
    TRANSPARENT = "transparent",
    CIRCLE = "circle"
}

declare abstract class LowerThird extends Component {
    setOptions(options?: LtOptions, render?: boolean): void;
    showLowerThird(): void;
    hideLowerThird(): void;
}

export declare interface LowLightConfig {
    power: number;
}

declare interface LtColorOptions {
    primary?: number;
    secondary?: number;
    text?: number;
}

declare class LtDoubleSlideRect extends LowerThird {
}

declare class LtHorizontalMirror extends LowerThird {
}

declare class LtLeftTextbox extends LowerThird {
}

declare interface LtOffsetOptions {
    y?: number;
    x?: number;
}

export declare interface LtOptions {
    position?: Position;
    offset?: LtOffsetOptions;
    color?: LtColorOptions;
    text?: LtTextOptions;
}

declare class LtSlideBold extends LowerThird {
}

declare interface LtTextOptions {
    title?: string;
    subtitle?: string;
    maxLengthTitle?: number;
    maxLengthSubtitle?: number;
}

declare class LtTwoSlideRects extends LowerThird {
}

export declare type Metrics = {
    fps: number;
    segmentationInferenceTime: number;
    fullFrameDrawTime: number;
};

declare type Options = {
    [key: string]: any;
};

export declare type OptionsKeys = keyof OptionsMap;

export declare interface OptionsMap {
    overlay_screen: OverlayScreenOptions;
    watermark: WatermarkOptions;
    lowerthird_1: LtOptions;
    lowerthird_2: LtOptions;
    lowerthird_3: LtOptions;
    lowerthird_4: LtOptions;
    lowerthird_5: LtOptions;
    stickers: StickerOptions;
}

declare class OverlayScreen extends Component {
    show(): void;
    hide(): void;
    setOptions(o?: OverlayScreenOptions): void;
}

export declare interface OverlayScreenOptions {
    url?: string;
    promise?: PromiseContainer;
}

declare type Placement = "top-left" | "bottom-left" | "center" | "top-right" | "bottom-right" | "custom";

/**
 * @inline
 */
export declare type PortraitLightingOptions = {
    LightStrength: number;
    /**  A number from 0 to 1. Refers to strength of lighting for portrait. */
    BgDarkStrength: number;
};

declare interface Position {
    x?: number;
    y?: number;
    placement?: Placement;
}

export declare enum PresetType {
    SPEED = "speed",
    BALANCED = "balanced",
    QUALITY = "quality",
    LIGHTNING = "lightning"
}

export declare interface PromiseContainer {
    resolve: Function;
    reject: Function;
}

export declare type ResizeSettings = {
    width: number;
    height: number;
};

export declare interface SDKTracks {
    sdkAudioTrack: MediaStreamTrack;
    sdkVideoTrack: MediaStreamTrack;
}

export declare interface SharpnessConfig {
    power: number;
}

export declare type SingleKey<K> = [K] extends (K extends Keys ? [K] : never) ? K : never;

export declare interface StickerOptions {
    capacity: number;
    ratio: number;
    position: ComponentPosition;
    duration: number;
    animationSpeed: number;
    size: number;
    id?: string;
    sticker?: AppendSticker;
}

declare class Stickers extends Component {
    options: StickerOptions;
    show(): void;
    hide(): void;
    onLoadSucccess(f?: Function): void;
    onLoadError(f?: Function): void;
    setOptions(options: Partial<StickerOptions>): Promise<void>;
}

/**
 * Main SDK entry point. Wraps the pipeline (inference, renderer, effects, output)
 * and exposes the public API for creating, configuring, and consuming the
 * processed MediaStream.
 */
export declare class tsvb {
    #private;
    components: any;
    recorder: IRecorder;
    /**
     * Initiation of main SDK instance.
     *
     * @param customer_id - the unique customer identifier provided by SDK vendor.
     */
    constructor(customer_id: string, inference?: any);
    getSnapshot(): Promise<ImageBitmap>;
    /**
     * Check the minimal requirements for SDK
     */
    isSupported(): boolean;
    /**
     * @deprecated moved cache_models configuration to config + add seperate function to clear cache
     * Set the cache_models configuration to true. This can also be configured using sdk.config({ cache_models: true | false }).
     * The model will be cached during the first load to local storage.
     * This will speed up all subsequent initializations of effects using ML models.
     *
     *  @param clear - pass true to delete cached models
     *
     */
    cache(clear?: boolean): Promise<void>;
    clearModelCache(): Promise<void>;
    /**
     * Initialize all ML resources (models and inference objects).
     * The initial configurations are obtained from sdk.config().
     */
    preload(): Promise<void>;
    /**
     * Ability to configure sdk execution environment
     *
     *
     * @param config - configuration object
     *
     * @example
     * General configuration options
     *
     * ```json
     * config = {
     *    api_url: 'url', // Enable custom URL configuration for SDK authentication, suitable for on-premises solutions.
     *    model_url: 'url', // Custom URL for the segmentation model; in most cases, this parameter does not require configuration.
     *    sdk_url: 'url',  // This parameter specifies the URL to the SDK folder for cases where you host the model files yourself.
     *    effects: ['virtual_background', 'smart_zoom', 'low_light', 'color_correction'], // List of effects which should be loaded at initializatin
     *    preset: 'balanced', // You can set the default segmentation preset to one of the following options: quality, balanced, speed, or lightning.
     *    proxy: true/false, // The configuration specifies whether segmentation should operate in a separate worker thread (not in the main UI thread), with the default value set to true.
     *    provider: wasm/webgpu/auto, // Allow users to select where to execute the segmentation. In auto mode, the SDK will verify the availability of a GPU. If a GPU is not available, it will automatically fall back to using WASM
     *    stats: true/false, // To enable or disable the sending of statistics.
     *    cache_models: true/false, // To cache models locally, this will speed up the load time. By default is true
     *    test_inference: true/false, // False by default. If set to true, the SDK will test inference consistency on the WebGPU backend.
     *    models: {
     *        'colorcorrector': 'url', // The feature allows for the provision of a custom model name; if left empty, the feature will be disabled.
     *        'facedetector': 'url', // The feature allows for the provision of a custom model name; if left empty, the feature will be disabled.
     *    },
     *    wasmPaths: { // Currently, WASM files are loaded from the same directory where the SDK is placed, but custom URLs are also supported (for example, you can load them from CDNs).
     *        'ort-wasm.wasm': 'url',
     *        'ort-wasm-simd.wasm': 'url',
     *        'ort-wasm-threaded.wasm': 'url',
     *        'ort-wasm-simd-threaded.wasm': 'url'
     *    }
     * }
     *```
     *
     * @example
     * Example of how to change default segmentation preset
     * ```json
     * config = {
     *    preset: 'lightning'
     * }
     *```
     *
     * @example
     * Example of how to disable colorcorrection and facedetection
     * ```json
     * config = {
     *    effects: ['virtual_background']
     * }
     *```
     *
     *
     * * @example
     * Example of how to hot models on custom domain
     * ```json
     * config = {
     *    sdk_url: 'https://domain.com/sdk/'  // in this derectory should be subfolder models with all required models
     * }
     *```
     *
     */
    config(config: any): void;
    /**
     * Initialize the frame processor for processing individual video frames.
     * This method sets up the rendering pipeline and effect processor without requiring a MediaStream.
     * It creates the necessary components (Renderer, EffectProcessor) and loads all configured effects.
     * If the frame processor is already initialized, this method returns immediately.
     *
     * Use this method when you want to process individual VideoFrame objects directly via processFrame(),
     * rather than processing an entire MediaStream via useStream().
     *
     * **IMPORTANT - Mode Isolation:**
     * - This method is mutually exclusive with useStream()
     * - Calling initFrameProcessor() will automatically destroy any active stream processor
     * - You cannot use processFrame() and useStream() simultaneously
     * - Choose one mode: either frame-by-frame processing OR stream processing
     *
     * @returns {Promise<void>} A promise that resolves when initialization is complete and all effects are loaded.
     */
    initFrameProcessor(): Promise<void>;
    /**
     * Process a single VideoFrame through the effects pipeline.
     * This method allows for frame-by-frame processing without requiring a MediaStream.
     * The frame processor must be initialized via initFrameProcessor() before calling this method.
     *
     * All enabled effects (virtual background, color correction, smart zoom, etc.) will be applied
     * to the input frame, and a new processed VideoFrame will be returned.
     *
     * **IMPORTANT - Mode Isolation:**
     * - This method cannot be used simultaneously with useStream()
     * - You must choose one mode: either processFrame() for frame-by-frame processing OR useStream() for MediaStream processing
     * - Calling useStream() will destroy the frame processor and disable this method
     *
     * **Important:** The input VideoFrame is consumed by this method. You should not use it after passing
     * it to processFrame(). The SDK automatically closes the input frame even if processing fails.
     *
     * **Backpressure Control:** The SDK can handle up to 2 frames in-flight simultaneously:
     * - One frame actively being rendered/processed
     * - One frame in preparation/queued
     *
     * It's recommended to track in-flight frames and drop incoming frames when the limit is reached
     * to prevent memory buildup and maintain smooth performance.
     *
     * @param videoFrame - The input VideoFrame to process. This frame will be consumed by the processing pipeline.
     * @returns A promise that resolves to the processed VideoFrame with all effects applied.
     * @throws Throws an error if the Frame Processor is not initialized. Call initFrameProcessor() first.
     *
     * @example
     * Basic usage:
     * ```typescript
     * await sdk.initFrameProcessor();
     * const processedFrame = await sdk.processFrame(inputFrame);
     * ```
     *
     * @example
     * Recommended pattern with backpressure control:
     * ```typescript
     * let stats = { inFlight: 0, droppedFrames: 0 };
     *
     * // In your frame callback:
     * // Drop frames if too many in-flight (backpressure control)
     * if (stats.inFlight >= 2) {
     *   stats.droppedFrames++;
     *   inputFrame.close();
     *   continue;
     * }
     *
     * stats.inFlight++;
     *
     * sdk.processFrame(inputFrame)
     *   .then(outputFrame => {
     *     // Draw output frame to canvas
     *     ctx.drawImage(outputFrame, 0, 0);
     *
     *     // Close the output frame
     *     outputFrame.close();
     *   })
     *   .catch(err => {
     *     console.error('Frame processing failed:', err);
     *     // Note: inputFrame is already closed by SDK even on error
     *   })
     *   .finally(() => {
     *     // Decrement in-flight counter (inputFrame already closed by SDK)
     *     stats.inFlight--;
     *   });
     * ```
     */
    processFrame(videoFrame: VideoFrame): Promise<VideoFrame>;
    /**
     * Get Customer ID provided by vendor.
     */
    getCustomerId(): string;
    /**
     * Set the MediaStream object which will be the source of the video frames for processing.
     *
     * **IMPORTANT - Mode Isolation:**
     * - This method is mutually exclusive with processFrame()
     * - Calling useStream() will automatically destroy any active frame processor
     * - You cannot use useStream() and processFrame() simultaneously
     * - Choose one mode: either MediaStream processing OR frame-by-frame processing
     *
     * @param stream - the source MediaStream object.
     * @param resize - optional resize settings to apply custom output dimensions.
     */
    useStream(stream: MediaStream, resize?: ResizeSettings): void;
    /**
     * Set the segmentation mode. Segmentation mode allow to choose combination of quality and speed of segmentation. Balanced mode is enabled by default.
     *
     * @param preset - in string format. The values could be quality, balanced, speed, lightning.
     */
    setSegmentationPreset(preset: PresetType): Promise<boolean>;
    /**
     * Return current active segmentation mode.
     *
     */
    getSegmentationPreset(): PresetType;
    /**
     * Set the background color for background 'color' mode.
     *
     * @param color - in hexadecimal format.
     */
    setBackgroundColor(color: number): void;
    /**
     * Get the output MediaStream object for further processing.
     *
     */
    getStream(): MediaStream | null;
    /**
     * Set the canvas where will be rendered the processed frames.
     *
     * @param canvas - the HTMLCanvasElement object.
     */
    toCanvas(canvas: HTMLCanvasElement | null): void;
    /**
     * Show fps on the stream.
     *
     */
    setFpsLimit(limit: number): boolean;
    /**
     * Return Metrics for processing
     * fps - the current actual FPS (limited by source fps)
     * segmentationInferenceTime - inference time for segmentation
     * fullFrameDrawTime - time for applying all effects (including ML processing) and drawing the final frame
     *
     */
    getMetrics(): Metrics;
    /**
     * Show fps on the stream.
     *
     */
    showFps(): boolean;
    /**
     * Hide fps and other stats on the stream.
     *
     */
    hideFps(): boolean;
    /**
     * Freeze the stream
     */
    freeze(): boolean;
    /**
     * Unfreeze the stream
     */
    unfreeze(): boolean;
    /**
     * Enable portrait lighting effect.
     * This will brighten the subject and create a professional portrait look with smooth edges.
     *
     */
    enablePortraitLighting(): boolean;
    /**
     * Disable portrait lighting effect.
     *
     */
    disablePortraitLighting(): boolean;
    /**
     * Set portrait lighting options.
     *
     * @param options - Portrait lighting configuration:
     *   - `LightStrength` - number from 0 to 1. Controls the strength of lighting for the portrait.
     *     Higher values create brighter, more dramatic lighting.
     *   - `BgDarkStrength` - number from 0 to 1. Controls the strength of background darkening.
     *     Higher values make the background darker.
     */
    setPortraitLightingOptions(options: PortraitLightingOptions): boolean;
    /**
     * Enable beautification effect.
     *
     */
    enableBeautification(): boolean;
    /**
     * Disable beautification effect.
     *
     */
    disableBeautification(): boolean;
    /**
     * @deprecated with updated models don't need anymore
     * Control boundary mode smooth or strong.
     * Default value is strong mode.
     *
     * @param mode - the boundary mode, can be smooth or strong
     */
    setBoundaryMode(mode: string): boolean;
    /**
     * Control background fit/fill mode.
     * Default value is fill mode.
     *
     * @param mode - the background fit mode, can be fit of fill
     */
    setBackgroundFitMode(mode: string): boolean;
    /**
     * Enable the classic chroma key algorithm.
     *
     */
    enableChromaKey(): boolean;
    /**
     * Disable the classic chroma key algorithm.
     *
     */
    disableChromaKey(): boolean;
    /**
     * Set chroma key parameters.
     * @param setting - Partial settings for chroma keying.
     * @returns True if the settings were applied successfully.
     */
    setChromaKeySettings(setting: Partial<ChromaKeySettings>): boolean;
    /**
     * @deprecated Due to the update of segmentation models, there is no need for such a function. It will be removed in future versions.
     */
    setBoundaryLevel(level: number): boolean;
    /**
     * Control face beautification level.
     *
     * @param level - could be from 0 to 1. Higher number -> more visible effect of beautification.
     */
    setBeautificationLevel(level: number): boolean;
    /**
     * Enable blur of the background and set the power of blur.
     *
     * @param power - of the blur, can be a number from 0 to 1. Higher number -> better blur. This value could affect the performance (CPU/GPU, FPS)
     */
    setBlur(power: number): boolean;
    /**
     * Disable blur of the background.
     *
     */
    clearBlur(): boolean;
    /**
     * Set media source of the background. Video sources will be played automatically from the beginning.
     *
     * @param url - the link to image/video of the server or one of the following objects: MediaStream, MediaStreamTrack, HTMLVideoElement, ImageBitmap, Canvas.
     * @param options - optional settings. Use `options.type` to specify the MIME type of the media (e.g. `"video/mp4"`, `"image/gif"`); applies only when `url` is a link. If not provided, the SDK will attempt to detect it automatically.
     */
    setBackground(url: BackgroundSource, options?: BackgroundOptions): boolean;
    /**
     * Disable background effect. As a background will be shown original video.
     *
     */
    clearBackground(): boolean;
    /**
     * Enable Frame Skipping - segmentation will be running on every second frame, this will increase FPS but brings some motion trail
     *
     */
    enableFrameSkipping(): boolean;
    /**
     * Disable Frame Skipping - segmentation will be running on every video frame.
     * FrameSkipping disabled by default.
     */
    disableFrameSkipping(): boolean;
    /**
     * Set the layout. Useful for presentations.
     *
     * @param mode - could be the one of the following: center, left-bottom, right-bottom
     */
    setLayout(mode: string): boolean;
    /**
     * Set the layout mode. You can disable segmentation and show full camera frame or hide camera frame.
     *
     * @param mode - could be the one of the following: 'segmentation' | 'full' | 'hide' | 'transparent'
     * Segmentation - Process the segmentation and display the selected background.
     * Full - Show the full original frame without segmentation.
     * Hide - Hide the original frame completely (only the background will be visible).
     * Transparent - Process the segmentation and return the segmented person with a transparent background.
     */
    setLayoutMode(mode: LayoutMode): boolean;
    /**
     * Set the layout with custom params
     *
     * @param persent - objects with the custom params
     *
     * @example
     * ```json
     * persent = {
     *    xOffset?: number, // horizontal offset relative to center, value can be a number from -1 to 1
     *    yOffset?: number, // vertical offset relative to center, value can be a number from -1 to 1
     *    size?: number, mask size percentage// value can be a number from 0 to 1   *
     * }
     *```
     */
    setCustomLayout(persent: {
        xOffset?: number;
        yOffset?: number;
        size?: number;
    }): boolean;
    /**
     * Set the face-area proportion.
     * Used by the smart-zoom effect to calculate frame scale value
     *
     * @param value - can be a number from 0.01 to 1 (default = 0.1)
     */
    setFaceArea(value: number): boolean;
    /**
     * Set the face detector accuracy.
     *
     * @param value - can be a number from 0.2 to 1 (default 0.75)
     */
    setFaceDetectorAccuracy(value: number): boolean;
    /**
     * Get the detected faces squares. Works only if SmartZoom is enabled.
     * To get detected faces without applying SmartZoom effects, just use setFaceArea with the minimal parameter.
     *
     */
    getDetectedFaces(): FaceCombiner[];
    /**
     * Set count of the smart-zoom smoothing.
     * The more steps, the higher the smoothing
     *
     * @param steps - can be a number from 0.01 to 1 (default 0.2)
     */
    setSmartZoomSmoothing(steps: number): boolean;
    /**
     * Set sensitivity for the smart-zoom rection.
     * The set value means the difference between the new and old face-params for the smartzoom reaction
     *
     * @param value - can be a number from 0 to 1 (default 0.05)
     */
    setSmartZoomSensitivity(value: number): boolean;
    /**
     * Set period in ms for face detector reaction.
     *
     * @param value - can be a number from 0 to 1000 (default 100)
     */
    setSmartZoomPerod(value: number): boolean;
    /**
     * Switch face-square-drawing mode.
     *
     * @param isOn - is a boolean argument (default false)
     */
    switchDrawFaceSquare(isOn: boolean): boolean;
    /**
     * Switch preface-square-drawing mode.
     * Draw face square before processing
     *
     * @param isOn - is a boolean argument (default false)
     */
    switchDrawPreFaceSquare(isOn: boolean): boolean;
    /**
     * Enable smart-zoom effect.
     */
    enableSmartZoom(): boolean;
    /**
     * Disable smart-zoom effect.
     */
    disableSmartZoom(): boolean;
    /**
     * Enable color-correction effect.
     */
    enableColorCorrector(): boolean;
    /**
     * Disable color-corrector effect.
     */
    disableColorCorrector(): boolean;
    /**
     * Enable Mirroring Effect.
     */
    enableMirroring(): boolean;
    /**
     * Disable Mirroring Effect.
     */
    disableMirroring(): boolean;
    /**
     * Enable Noise Suppression Effect.
     */
    enableNoiseSuppression(): boolean;
    /**
     * Disable Noise Suppression Effect.
     */
    disableNoiseSuppression(): boolean;
    /**
     * Enable color-filter effect.
     */
    enableColorFilter(): boolean;
    /**
     * Disable color-filter effect.
     */
    disableColorFilter(): boolean;
    /**
     * set color-filter config.
     */
    setColorFilterConfig(config: Partial<ColorFilterConfig>): boolean;
    /**
     * Set filter part for the color correction (dev feature).
     *
     * @param value - can be a number from 0 to 1 (default 1)
     */
    setFilterPart(value: number): boolean;
    /**
     * Set time in ms between frame analyses.
     *
     * @param value - can be a number from 0 to 5000 (default 200)
     */
    setColorCorrectorPeriod(value: number): boolean;
    /**
     * Set power of color correction.
     *
     * @param value - can be a number from 0 to 1 (default 1)
     */
    setColorCorrectorPower(value: number): boolean;
    /**
     * Set color correction's config.
     *
     * Only provided fields are updated.
     *
     * @example
     * ```
     * tsvb.setColorCorrectorConfig({
     *   autoMode: boolean,       // enables auto white balance, contrast and exposure
     *   power: [0, 1],           // drives strength of auto correction
     *   whiteBalance: [0, 1],    // 0 disables, >0 enables; ignored when autoMode is enabled
     *   exposure: [-1, 1],       // ignored when autoMode is enabled
     *   temperature: [-1, 1],    // cool to warm shift
     *   tint: [-1, 1],           // manual tint adjustment
     *   vibrance: [-1, 1],       // saturation boost, weighted to low-saturation pixels
     *   contrast: [-1, 1],       // ignored when autoMode is enabled
     *   updatePeriod: [0, 5000], // ms between auto-correction analyses
     *   filterPart: [0, 1],      // dev feature
     * });
     * ```
     */
    setColorCorrectorConfig(config: Partial<ColorCorrectionConfig>): boolean;
    /**
     * Enable LowLight effect.
     */
    enableLowLightEffect(): boolean;
    /**
     * Disable LowLight effect.
     */
    disableLowLightEffect(): boolean;
    /**
     * Set LowLight effect config.
     *
     * @param config - LowLight effect config.
     */
    setLowLightEffectConfig(config: Partial<LowLightConfig>): boolean;
    /**
     * Set LowLight effect power.
     *
     * @param value - number from 0 to 1 (default 1)
     */
    setLowLightEffectPower(value: number): boolean;
    /**
     * Enable Sharpness effect.
     */
    enableSharpnessEffect(): boolean;
    /**
     * Disable Sharpness effect.
     */
    disableSharpnessEffect(): boolean;
    /**
     * Set Sharpness effect config.
     *
     * @param config - Sharpness effect config.
     */
    setSharpnessEffectConfig(config: Partial<SharpnessConfig>): boolean;
    /**
     * Clear output stream.
     *
     */
    clear(): boolean;
    /**
     * Run the processing of frames.
     */
    run(): boolean;
    /**
     * Stop applying all effects. The original frames will be bypassed to the output stream.
     */
    stop(): boolean;
    /** @ignore */
    enablePipelineSkipping(): void;
    /** @ignore */
    disablePipelineSkipping(): void;
    createComponent<K extends Keys>(arg: K extends OptionsKeys ? ComponentArguments<K> : Omit<ComponentArguments<K>, "options">): ClassType<K>;
    addComponent<K extends Keys>(c: ClassType<K>, id: string): void;
    /**
     * @deprecated renamed to setCustomResolution
     */
    setOutputResolution(size: ResizeSettings): void;
    /**
     * @deprecated renamed to clearCustomResolution
     */
    clearOutputResolution(): void;
    setCustomResolution(size: ResizeSettings): void;
    clearCustomResolution(): void;
    /**
     * The default frame format is RGBA. Using this method, you can change the frame format to I420.
     */
    setOutputFrameFormat(format: FrameFormat): void;
    /**
     * A callback is fired when the SDK is ready for frame processing. Effects configuration should only be applied after this callback has been triggered.
     */
    set onReady(f: Function);
    /**
     * pass onError callback to ErrorBus
     *
     * @param handler - callback function that takes ErrorObject as its first argument.
     */
    onError(handler: (e: ErrorObject) => void): void;
    getLatestErrors(): ErrorObject[];
    emulateError(code: ErrorCode): void;
    set onFrame(f: Function | undefined);
    onChangeInputResolution(f?: () => void): void;
    /** @ignore */
    onAuthRequest(f?: (url: string, payload: Object) => Promise<string>): void;
    onColorFilterSuccess(f?: (id: string) => void): void;
    onLowLightSuccess(f?: () => void): void;
    onBackgroundSuccess(f?: () => void): void;
    /**
     * Destroy SDK instance and cleanup all resources including WebGL contexts.
     * This method should be called when you're done with the SDK instance to prevent memory leaks.
     * After calling destroy(), you should create a new SDK instance if you need to use it again.
     */
    destroy(withInference?: boolean): Promise<boolean>;
}

export declare type Tuples<T> = T extends Keys ? [T, InstanceType<ComponentsMap[T]>] : never;

declare class Watermark extends Component {
    setOptions(options?: WatermarkOptions): void;
    clear(): void;
}

export declare interface WatermarkOptions {
    url: string;
    position: ComponentPosition;
    size: number;
}

export { }
