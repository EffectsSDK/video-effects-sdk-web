declare type AbsoluteDuration = `${number}ms` | `${number}s`;

declare type AnimatableProperty = PositionalProperty | ScalarProperty | ColorProperty;

/**
 * How a phase's animation ended, passed to {@link AnimationPhase.onComplete}:
 *  - `"show"`        -> finished playing forward as a show.
 *  - `"hide"`        -> finished as a hide (an authored hide played forward,
 *                       or the implicit hide that replays `show` backwards).
 *  - `"interrupted"` -> cut short before reaching its end (a new show/hide
 *                       took over, or the overlay was torn down).
 */
declare type AnimationEnd = "show" | "hide" | "interrupted";

/**
 * Animation phase. Rules (applied to both `show` and `hide`):
 *
 *  - **Unique target property.** At most one tween per (target node, property)
 *    pair in a phase. A second one is a load-time error.
 *  - **Target must exist.** `target` must resolve to a node `id` in the tree
 *    at load time, otherwise the overlay fails to register.
 *  - **Empty tween is a no-op.** A tween with neither explicit `from` nor
 *    `to` and whose implicit values coincide silently does nothing.
 *  - **`duration: 0` is allowed.** Instant snap to `to` at `delay` time;
 *    property then stays at `to` for the rest of the phase.
 *  - **Settle to base on phase end.** When the phase finishes, every
 *    tweened property snaps to the node's declared base value from
 *    `OverlayDefinition` - even if the tween's explicit `to` was
 *    different. The base value (mutated by `patch()`) is the canonical
 *    resting state; `to` is only a trajectory target during the phase.
 *  - **Patch during phase.** Calls to `patch()` that land while a tween is
 *    in flight do **not** retarget the tween - neither its explicit nor
 *    implicit `to` is re-resolved. The patched base takes effect at the
 *    phase-end settle (see above) and on the next phase.
 */
declare interface AnimationPhase {
    /** Total length of the phase. Relative tweens are fractions of this. */
    duration: AbsoluteDuration;
    tweens: Tween[];
    /**
     * Called when the phase's animation ends. The argument reports how it ended - `"show"`, `"hide"`, or
     * `"interrupted"` (see {@link AnimationEnd}). Because an omitted `hide`
     * replays the `show` phase backwards, a `show` phase's `onComplete` fires
     * with `"hide"` when that reverse finishes, and with `"interrupted"` if a
     * `show` is cut short by a `hide` (then again when the hide ends).
     */
    onComplete?: (reason: AnimationEnd) => void;
}

declare interface AppendSticker {
    url: string;
    promise: any;
    silenceMode?: boolean;
}

/**
 * Options accepted by `loadAvatars` to configure the avatars effect.
 *
 * @public
 */
export declare interface AvatarsConfig {
    /** URL of the avatar `.glb` model to load. */
    modelUrl: string;
    /** Three.js core and GLTFLoader (URLs or pre-loaded modules). */
    threeJs: ThreeJS;
    /** How much larger the avatar appears relative to the detected face. Default: 1.75. */
    faceScaleFactor: number;
    /**
     * Optional overrides for the MediaPipe face-landmarker resources. Any
     * field left unset falls back to the SDK's default CDN URLs.
     */
    faceLandmarker: Partial<FaceLandmarkerConfig>;
}

export declare interface BackgroundOptions {
    type?: string;
}

export declare type BackgroundSource = string | MediaStream | ImageBitmap | MediaStreamTrack | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas;

/**
 * Position is set by picking a field from the inset family (`left`/`right`
 * for X, `top`/`bottom` for Y) or by using `centerX`/`centerY` to centre.
 * The chosen field also acts as the anchor - setting `right` means
 * "right-anchored, distance from parent's right edge".
 *
 * Both insets on the same axis may be set simultaneously: `left: "10px",
 * right: "20px"` anchors both edges and **derives the size** on that
 * axis from the parent - `width = parent - left - right`. In this
 * dual-inset mode the derived size wins over any explicit `width` (or
 * `height` for `top`+`bottom`); `min/max` clamping still applies to the
 * derived result.
 *
 * `centerX`/`centerY` is mutually exclusive with the inset fields on its
 * axis - when an inset is set, `centerX` is ignored.
 *
 * Default if nothing is set: `left: 0` / `top: 0`.
 */
declare interface BaseNode {
    /** Required if the node needs to be targeted by animations or runtime
     *  setters. `"frame"` is reserved - used by positional tweens as
     *  `relativeTo: "frame"` to reference the video frame. */
    id?: string;
    /** Distance from parent's left edge to this node's left edge. */
    left?: Length;
    /** Distance from parent's right edge to this node's right edge. */
    right?: Length;
    /** Horizontal offset from the centre of the parent. `0` = perfectly centred. */
    centerX?: Length;
    /** Distance from parent's top edge to this node's top edge. */
    top?: Length;
    /** Distance from parent's bottom edge to this node's bottom edge. */
    bottom?: Length;
    /** Vertical offset from the centre of the parent. `0` = perfectly centred. */
    centerY?: Length;
    width?: Length;
    height?: Length;
    /**
     * Lower bound for the node's computed width. Clamps the laid-out size
     * from below - applies to both auto-sized nodes (hugged size lifted to
     * `minWidth`) and explicit-sized nodes (if `width < minWidth`, wins
     * `minWidth`, same as CSS).
     */
    minWidth?: Length;
    /** Lower bound for the node's computed height. See `minWidth`. */
    minHeight?: Length;
    maxWidth?: Length;
    maxHeight?: Length;
    /** 0..1, default 1. */
    alpha?: number;
    /** Id of a `RectNode` with `isMask: true` whose bounds clip this node.
     *  The mask rect may live anywhere in the tree; it is resolved by id at
     *  parse time. Only rects may be used as masks. */
    mask?: string;
    /** Default true. */
    visible?: boolean;
    /**
     * Reserves space on each side of the node by inflating its bounding box.
     * Lives on the child rather than as container-level padding, so the
     * parent needs no declaration to give one of its children breathing room.
     *
     *  - In an **auto-sized parent** the parent hugs `child + margin`, so
     *    margin effectively enlarges the parent. This drives the
     *    "background plate" pattern: in an auto-sized group, put an
     *    omitted-size `Rect` next to a `Text` with `margin: "10px"` -- the
     *    group hugs text plus margin, the rect autofills the group, and
     *    the text sits visually inset 10 px inside the plate.
     *  - In an **explicit-sized parent** the parent's size is fixed, so
     *    margin only shifts this node's own placement inward.
     *  - In a **`StackNode`** margin is added to the child's flow slot on
     *    both sides and compounds with `gap`: two adjacent children with
     *    `margin: "10px"` separated by `gap: "5px"` produce a 25 px visual
     *    gap (10 + 5 + 10).
     */
    margin?: Padding;
}

declare interface BaseTween {
    /** Node id to animate. */
    target: string;
    /** Default 0. */
    delay?: Duration;
    /** Default: fills the remaining phase time after `delay`. */
    duration?: Duration;
    /** Default "linear". */
    easing?: Easing;
}

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

declare type Color = number;

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
    /**
     * Optional notifier for the LUT load triggered by this config. Its `resolve`
     * is called once the LUT is loaded and applied; its `reject` is called if the
     * load fails or the effect is destroyed mid-load.
     */
    promise?: PromiseContainer;
}

/** Properties whose values are `Color` numbers (0xRRGGBB). */
declare type ColorProperty = "fill";

/**
 * Tween for a colour property (currently `fill` on `RectNode`).
 * Channels (R, G, B) interpolate independently.
 */
declare interface ColorTween extends BaseTween {
    property: ColorProperty;
    /** Default: the property's current value when the tween starts. */
    from?: Color;
    /** Default: the node's declared (base) value for the property. */
    to?: Color;
}

/** Construct a vertical (column) `StackNode`. */
declare function columnStack(args: Omit<StackNode, "type" | "direction" | "children">, children?: Node_2[]): StackNode;

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
    custom_overlay: typeof CustomOverlay;
};

export declare interface Coord {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export declare class CustomOverlay extends Component {
    setOptions(options?: CustomOverlayOptions & {
        [key: string]: any;
    }): void;
    show(): void;
    hide(): void;
    patch(nodeId: string, patch: NodePatch): void;
}

export declare interface CustomOverlayOptions {
    definition: OverlayDefinition;
}

/**
 * A `Duration` is either absolute (string) or a fraction of the surrounding
 * `AnimationPhase.duration` (plain number, 0..1).
 */
declare type Duration = AbsoluteDuration | number;

declare type Easing = "linear" | "ease-out-sine" | "ease-out-quint" | "ease-out-cubic" | "ease-in-sine" | "ease-in-quint" | "ease-in-cubic";

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
    RENDER_CONTEXT_REBUILD_FAILED = 1063,
    SOFTWARE_RENDERER_SKIPPED = 1064
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
    EFFECT_LOW_LIGHT = "effect_low_light",
    EFFECT_AVATARS = "effect_avatars"
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

/**
 * URLs of the MediaPipe Tasks Vision resources that power face detection for
 * the avatars effect. The runtime loads them inside a Web Worker, so the
 * `mediapipe` module must be reachable from the worker context.
 *
 * @public
 */
export declare interface FaceLandmarkerConfig {
    /**
     * URL of the MediaPipe Tasks Vision ESM module. Loaded by the worker via
     * dynamic `import()` — must point to a module that exports `FaceLandmarker`
     * and `FilesetResolver`. Default: `@mediapipe/tasks-vision@0.10.35` from
     * the jsDelivr CDN.
     */
    mediapipe: string;
    /** MediaPipe WASM base URL. Default: `@mediapipe/tasks-vision@0.10.35/wasm` from the jsDelivr CDN. */
    wasm: string;
    /** MediaPipe face landmarker model URL. Default: `face_landmarker.task` (float16, v1) from Google Storage. */
    model: string;
}

declare type FontWeight = "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "normal" | "bold";

export declare type FrameFormat = "RGBX" | "I420";

/**
 * Construct a `GroupNode`. Children are passed as an array so the `[]`
 * visually delimits the subtree from the props block.
 */
declare function group(args: Omit<GroupNode, "type" | "children">, children?: Node_2[]): GroupNode;

/**
 * Structural container.
 *
 * Sizing:
 *  - If `width`/`height` is set, the group has that size; children do not
 *    affect it.
 *  - If `width`/`height` is omitted, the group hugs the bounding box of
 *    its children **including each child's `margin`**. A child sized as a
 *    fraction/percent of that same axis (a plain `number` or `"N%"`) does
 *    **not** contribute to the hug - that would be circular - so the group
 *    sizes from its `"Npx"` and intrinsic children (Text, or an
 *    omitted-size Rect). The fraction then resolves against the group's
 *    final size at layout, so e.g. a `width: 1` rect fills the
 *    text-hugged group (a background plate) without inflating it.
 *
 * `GroupNode` has no container-level padding: use `margin` on the child
 * that needs breathing room. This keeps the "background plate" pattern
 * unambiguous - an omitted-size `Rect` always fills the group's full
 * border-box, and margin on its sibling controls how far the content
 * sits inside that plate.
 */
declare interface GroupNode extends BaseNode {
    type: "group";
    children: Node_2[];
}

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

/**
 * Geometry length.
 *  - plain `number` -> fraction of the parent dimension (0..1)
 *  - `"N%"`         -> same, written the CSS way
 *  - `"Npx"`        -> design pixels, scaled with `OverlayDefinition.designWidth`
 */
declare type Length = number | `${number}%` | LengthPx;

/**
 * Geometry length in pixels.
 *  - `"Npx"`        -> design pixels, scaled with `OverlayDefinition.designWidth`
 */
declare type LengthPx = `${number}px`;

/**
 * Effects that can be added to the pipeline at runtime via {@link tsvb.loadEffect}.
 * For the Avatars effect use {@link tsvb.loadAvatars} instead.
 */
export declare type LoadableEffect = 'virtual_background' | 'smart_zoom' | 'low_light' | 'color_correction';

/**
 * Base class for the built-in lower thirds. Each subclass supplies an
 * {@link OverlayDefinition} (via {@link buildDefinition}) and its font URLs;
 * the shared custom-overlay engine ({@link OverlayRuntime}) does the layout and
 * animation. Animation is frame-driven through {@link willDraw}, exactly like
 * `CustomOverlay`.
 */
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

/**
 * Construct a mask `RectNode` (`isMask: true`). Mask rects have no fill and
 * are referenced by another node's `mask` field to clip its rendering.
 */
declare function maskRect(args: Omit<RectNode, "type" | "isMask" | "fill">): RectNode;

export declare type Metrics = {
    fps: number;
    segmentationInferenceTime: number;
    fullFrameDrawTime: number;
};

declare type Node_2 = GroupNode | StackNode | TextNode | RectNode;

/**
 * Patch payload for `CustomOverlay.patch`. Lists every field that may be
 * mutated on a live node - a loose union covering all node kinds. At
 * runtime the overlay validates that each provided field is applicable
 * to the addressed node (e.g. `text` on a non-`TextNode` throws).
 *
 * Not patchable:
 *  - `id`, `type` - immutable identity.
 *  - `children` - tree structure is fixed; remove and re-add the
 *    overlay if you need a different layout.
 *  - `mask` / `isMask` - mask wiring is structural. Patch the referenced
 *    rect's dimensions like any other node to animate the clip.
 */
declare type NodePatch = Partial<{
    left: Length;
    right: Length;
    centerX: Length;
    top: Length;
    bottom: Length;
    centerY: Length;
    width: Length;
    height: Length;
    minWidth: Length;
    minHeight: Length;
    maxWidth: Length;
    maxHeight: Length;
    alpha: number;
    visible: boolean;
    margin: Padding;
    gap: LengthPx;
    align: "start" | "center" | "end" | "stretch";
    direction: "row" | "column";
    text: string;
    style: Partial<TextStyle>;
    fill: Color;
    cornerRadius: number;
}>;

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
    custom_overlay: CustomOverlayOptions;
}

export declare namespace overlay {
    export {
        text,
        rect,
        maskRect,
        group,
        rowStack,
        columnStack,
        pad,
        AnimatableProperty,
        AnimationEnd,
        AnimationPhase,
        AbsoluteDuration,
        BaseNode,
        Color,
        Duration,
        Easing,
        FontWeight,
        GroupNode,
        Length,
        Node_2 as Node,
        NodePatch,
        OverlayDefinition,
        Padding,
        PositionalProperty,
        PositionalTween,
        RectNode,
        ScalarProperty,
        ScalarTween,
        StackNode,
        TextNode,
        TextStyle,
        Tween,
        TweenPositionValue,
        TweenReference,
        PaddingSides
    }
}

declare interface OverlayDefinition {
    /**
     * Tree root. Must be a structural container - `GroupNode` or `StackNode`.
     * Position the root inside the video frame using its own inset fields
     * (`left`/`right`/`top`/`bottom`/`centerX`/`centerY`) - the root's
     * "parent" is the frame.
     */
    root: GroupNode | StackNode;
    /**
     * Frame width (in design pixels) the overlay is authored against.
     * A length of `"40px"` resolves to `40 * frameWidth / designWidth`
     * device pixels at render time, so the overlay scales proportionally
     * with the actual frame width.
     *
     * Default `1280` - matches a typical 720p design comp. Set to `1920`
     * if you author against 1080p, or any other reference width that
     * matches your design tooling.
     */
    designWidth?: number;
    /** Optional show animation. If absent, the overlay appears instantly. */
    show?: AnimationPhase;
    /**
     * Optional hide animation.
     *  - **Absent** -> the `show` phase is played backwards (its progress runs
     *    `1 -> 0`). Because it is the same curve run in reverse, the easing is
     *    mirrored too: an `ease-out` entrance becomes an `ease-in`-feel exit.
     *    Interrupting a running `show` with `hide` (or vice versa) flips the
     *    direction and retraces from the current point.
     *  - **Present** -> played forward as authored, as its own independent
     *    timeline.
     */
    hide?: AnimationPhase;
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

/**
 * Padding / margin shorthand. Accepts numbers in design pixels and returns
 * a {@link Padding} suitable for `node.margin` (or any other `Padding`
 * field).
 *
 * - `pad(16)` — all four sides 16px.
 * - `pad(10, 16)` — CSS-style shorthand: vertical 10px, horizontal 16px.
 * - `pad({ left: 40 })` — per-side; only the specified sides are emitted.
 */
declare function pad(all: number): Padding;

declare function pad(vertical: number, horizontal: number): Padding;

declare function pad(sides: PaddingSides): Padding;

/**
 * Padding around an auto-sized container. Scalar applies to all sides;
 * object form allows per-side values.
 */
declare type Padding = LengthPx | {
    top?: LengthPx;
    right?: LengthPx;
    bottom?: LengthPx;
    left?: LengthPx;
};

/** Per-side padding shape accepted by {@link pad}. */
declare type PaddingSides = {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
};

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

/** Properties whose values use `Length` semantics (fraction of parent vs. px). */
declare type PositionalProperty = "left" | "right" | "centerX" | "top" | "bottom" | "centerY" | "width" | "height";

/**
 * Tween for a positional property. `from`/`to` use `Length` semantics:
 *  - `0`        -> flush against the anchored edge (e.g. for `right`, the
 *                 node's right edge sits on the parent's right edge).
 *  - `1`        -> one full parent dimension away from that edge inwards
 *                 (for `right: 1`, the node's right edge sits at the
 *                 parent's left edge - fully off-screen to the left).
 *  - `-1`       -> one full parent dimension away outwards
 *                 (for `right: -1`, the node is fully off-screen right).
 *  - `"50%"`    -> 50 % of the relevant dimension.
 *  - `"40px"`   -> design pixels, scaled with `OverlayDefinition.designWidth`.
 *
 * Use the object form `{ value, relativeTo }` to place the property's
 * edge at an absolute coordinate inside a reference node's box.
 * `relativeTo: "frame"` uses the video frame; any other string is a
 * node id. `value` is multiplied by the reference's dimension on the
 * tween's axis and added to its leading edge - so the meaning of the
 * number does **not** depend on which positional field is animated:
 *  - `0`        -> reference's leading (left / top) edge.
 *  - `1`        -> reference's trailing (right / bottom) edge.
 *  - `-1`       -> one full reference-size before the leading edge.
 *  - `"50%"`    -> middle of the reference.
 * Resolved once at tween start. Mixing a `relativeTo` endpoint with a
 * plain `Length` endpoint leaves the plain side as "no override": it
 * falls through to the default (`from` -> current edge, `to` -> snapshot
 * base edge).
 */
declare interface PositionalTween extends BaseTween {
    property: PositionalProperty;
    /** Default: the property's current value when the tween starts. If the
     *  property is not declared on the node, defaults to the value that
     *  reproduces the node's resting position (see `to`). */
    from?: TweenPositionValue;
    /** Default: the node's declared (base) value for the property. If the
     *  property is not declared on the node (e.g. animating `right` on a
     *  `left`-anchored node), it defaults to the value that lands the node at
     *  its resting position - so the tween settles visually identical to the
     *  base layout instead of snapping to `0`. */
    to?: TweenPositionValue;
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

/**
 * Construct a `RectNode`. The fill colour is positional; other props go in
 * the optional second argument.
 */
declare function rect(fill: number, args?: Omit<RectNode, "type" | "fill">): RectNode;

/**
 * Rectangle primitive.
 *
 * Sizing:
 *  - If `width`/`height` is set, that size is used.
 *  - If `width`/`height` is omitted, the rect fills its parent. Combined
 *    with an auto-sized group and a sibling that carries `margin`, this
 *    is the "background plate" pattern: the group hugs content + margin,
 *    and the rect stretches to the group's border-box.
 */
declare interface RectNode extends BaseNode {
    type: "rect";
    fill?: Color;
    /** px at the `designWidth` base. */
    cornerRadius?: number;
    /** When true, this rect is invisible at render time and is intended to
     *  be referenced by another node's `mask` field as a sprite-mask source.
     *  The rect participates in layout exactly like any other rect - only
     *  its visual draw is suppressed. Only rects may be used as masks. */
    isMask?: boolean;
}

export declare type ResizeSettings = {
    width: number;
    height: number;
};

/** Construct a horizontal (row) `StackNode`. */
declare function rowStack(args: Omit<StackNode, "type" | "direction" | "children">, children?: Node_2[]): StackNode;

/** Properties whose values are plain numbers (no notion of parent units). */
declare type ScalarProperty = "alpha";

/**
 * Tween for a scalar property. `from`/`to` are raw numbers in the
 * property's own units (alpha 0..1).
 */
declare interface ScalarTween extends BaseTween {
    property: ScalarProperty;
    /** Default: the property's current value when the tween starts. */
    from?: number;
    /** Default: the node's declared (base) value for the property. */
    to?: number;
}

/**
 * Error type that is thrown by the SDK.
 *
 * It exposes readable details about the failure through its `code`,
 * `emitter`, `data` and `errorCause` fields, so it can be inspected and handled.
 *
 * Catch the rejection and narrow it with `instanceof`:
 * ```ts
 * try {
 *   await sdk.loadEffect('virtual_background');
 * } catch (e) {
 *   if (e instanceof SdkError) {
 *     // Inspect e.code / e.emitter / e.data and handle the failure
 *   }
 * }
 * ```
 */
export declare class SdkError extends Error {
    /** Failure code identifying the specific failure. */
    readonly code?: ErrorCode;
    /** SDK module that produced the error. */
    readonly emitter?: ErrorEmitter;
    /** The underlying error that caused this one, when available. */
    readonly errorCause?: Error;
    /** Extra context about the failure (model URL, HTTP status, etc.). */
    readonly data?: any;
}

export declare interface SDKTracks {
    sdkAudioTrack?: MediaStreamTrack;
    sdkVideoTrack?: MediaStreamTrack;
}

export declare interface SharpnessConfig {
    power: number;
}

export declare type SingleKey<K> = [K] extends (K extends Keys ? [K] : never) ? K : never;

/**
 * Linear layout container - lays its children sequentially along
 * `direction` (`row` = left -> right, `column` = top -> bottom) with `gap`
 * between them.
 *
 * Sizing:
 *  - If `width`/`height` is set on the relevant axis, that size is used.
 *  - If omitted on the **flow axis**, the stack hugs the sum of children
 *    sizes (including their `margin`) + gaps on that axis.
 *  - If omitted on the **cross axis**, the stack hugs the maximum of
 *    children sizes (including their `margin`) on that axis.
 *  - The fractional-`Length` rule applies per-axis: a child's fractional
 *    `width`/`height` on an auto-sized axis does not contribute to the
 *    stack's hug there (it would be circular) and resolves against the
 *    stack's final size at layout; the hug comes from `"Npx"`/intrinsic
 *    children.
 *
 * Positioning of stacked children (unified with `GroupNode`'s slot
 * model - every child sits in a slot in the parent's inner area):
 *  - The stack flow distribution gives each child a slot whose flow
 *    extent matches its allocation and whose cross extent is the
 *    stack's full inner cross span. Inside that slot, size and position
 *    follow the same rules as for a group child: insets, explicit
 *    `width`/`height`, `centerX`/`centerY`, and `min/max` clamping. The
 *    only stack-specific extras are `align` (default cross positioning
 *    when no centre/inset is set) and the autofill rule on the cross
 *    axis (see below).
 *  - **Size on each axis**, in priority order:
 *      1. Dual inset on the axis -> `fillSize - a - b` (fillSize = slot
 *         size minus the child's margin on the axis).
 *      2. Explicit `width`/`height` -> as declared.
 *      3. Single inset on the axis with autofill -> `fillSize - inset`.
 *      4. Autofill (no inset, no explicit) -> `fillSize`.
 *      5. Intrinsic.
 *    Autofill applies to: rect children always; non-rect children only
 *    when nothing pins the axis - no inset and no `centerX`/`centerY`
 *    on it (on the cross axis `align: stretch` is additionally
 *    required). A single inset anchors a non-rect at its intrinsic
 *    size - exactly as in a group - while a rect still autofills from
 *    the anchor.
 *    `min/max` constraints do not change the regime - they clamp the
 *    autofilled size like any other computed size. So a rect
 *    with no `height` and `centerY: 0` autofills the cross slot (and
 *    `centerY: 0` is moot since the fill already centres it); the same
 *    rect with `height: "8px"` and `centerY: 0` is 8px tall and centred.
 *  - **Position on each axis**, in priority order:
 *      1. Leading inset (`left`/`top`) -> `fillStart + inset`.
 *      2. Trailing inset alone -> `fillEnd - inset - size`.
 *      3. `centerX`/`centerY` -> `fillStart + (fillSize - size)/2 + value`.
 *      4. Cross axis with no positional field -> `align`.
 *      5. Otherwise -> `fillStart`.
 *    Insets and `centerX`/`centerY` resolve against the **slot's size**
 *    (both the anchor and the fraction's multiplier live in the slot);
 *    explicit dims and `min/max` resolve against the **stack's inner
 *    size**.
 *  - **Negative single inset on rect autofill**: `left: "-4px"` with no
 *    `width` autofills `fillSize - (-4) = fillSize + 4` and anchors at
 *    `fillStart + (-4)` - the rect extends 4px past the leading slot
 *    edge while still reaching the trailing edge. Same idea on any
 *    axis. If a single inset places the child fully outside the slot,
 *    autofill collapses to size 0.
 *  - **`align`** still controls cross positioning for children with no
 *    cross-axis positional field. `stretch` (the default) is the
 *    autofill trigger for non-rect children. Per-child align overrides
 *    are not supported.
 *  - Positional **tweens** target `def[prop]` so they inherit the same
 *    rules. A `{ property: "centerY", from: -1 }` on a row-stack child
 *    animates the cross centre offset (slot-relative). A `{ property:
 *    "top", from: "30px" }` on a row-stack child shifts the autofill
 *    range / single-inset anchor over time.
 */
declare interface StackNode extends BaseNode {
    type: "stack";
    direction: "row" | "column";
    children: Node_2[];
    /** Space between adjacent children along the flow axis. Default 0. */
    gap?: LengthPx;
    /** Cross-axis alignment of every child within its slot. Default "stretch". */
    align?: "start" | "center" | "end" | "stretch";
}

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
 * Construct a `TextNode`. The text content is positional since it is the
 * defining attribute; everything else (id, style, margin, mask, ...) goes in
 * the optional second argument.
 */
declare function text(text: string, args?: Omit<TextNode, "type" | "text">): TextNode;

declare interface TextNode extends BaseNode {
    type: "text";
    text: string;
    style?: TextStyle;
}

declare interface TextStyle {
    fontFamily?: string | string[];
    /** px at the `designWidth` base; scaled by the renderer. */
    fontSize?: number;
    fontWeight?: FontWeight;
    fontStyle?: "normal" | "italic";
    fill?: Color;
    letterSpacing?: number;
    lineHeight?: number;
    align?: "left" | "center" | "right";
    wordWrap?: boolean;
    breakWords?: boolean;
}

/**
 * Three.js dependencies used by the avatars effect: the THREE core and the
 * GLTFLoader add-on. Each entry accepts either a module URL (loaded
 * dynamically) or a pre-imported module.
 *
 * @public
 */
export declare interface ThreeJS {
    /** THREE.js URL or module. Default: `three@0.183.2` from the jsDelivr CDN. */
    THREE: any;
    /** GLTFLoader URL or module. Default: `three@0.183.2/examples/jsm/loaders/GLTFLoader.js` from the jsDelivr CDN. */
    GLTFLoader: any;
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
     * Check the minimal requirements for SDK.
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
     * Dynamically load an effect and add it to the processing pipeline.
     *
     * Only needed for an effect you excluded from the `effects` config option:
     * such effects are not loaded during initialization, and their public methods
     * (e.g. `setBlur`, `enableSmartZoom`) do nothing until the effect is loaded.
     * Effects that are in `effects` (which by default includes all of them) are
     * already loaded, so calling this for them is a harmless no-op.
     *
     * Must be called after the SDK is ready (i.e. after `onReady` has fired).
     *
     * The model is authenticated against the session server as part of the load.
     *
     * For the Avatars effect use {@link loadAvatars} instead.
     *
     * @param type - the effect to load.
     * @returns A promise that resolves when the effect is ready to start.
     *
     * @example
     * ```js
     * import { tsvb, SdkError } from 'effects-sdk';
     *
     * try {
     *   await sdk.loadEffect('virtual_background');
     *   sdk.setBlur(0.6);
     * } catch (e) {
     *   if (e instanceof SdkError) {
     *     console.error('loadEffect failed:', e.code, e.message);
     *   } else if (e.name === 'AbortError') {
     *     // The load was superseded by destroy()/useStream() — usually ignorable.
     *   }
     * }
     * ```
     */
    loadEffect(type: LoadableEffect): Promise<void>;
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
     * Switch the execution provider for an ML model at runtime.
     *
     * Currently only `model: 'segmentation'` with `provider: 'wasm'`
     * (WebGPU -> CPU) is supported.
     *
     * @param options - which model to switch and the target execution provider
     *
     * @example
     * ```js
     * await sdk.setProvider({ model: 'segmentation', provider: 'wasm' });
     * ```
     */
    setProvider(options: {
        model: 'segmentation';
        provider: 'wasm';
    }): Promise<void>;
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
     * Enable the Avatars effect.
     * Call `loadAvatars()` first to supply the avatar model.
     */
    enableAvatars(): boolean;
    /**
     * Disable the Avatars effect.
     */
    disableAvatars(): boolean;
    /**
     * Load the resources required by the Avatars effect and the GLB avatar model if provided.
     *
     * Accepts either a model URL string or a partial config object. Config fields are merged
     * over previously stored values. If neither argument supplies a `modelUrl`,
     * the URL most recently provided is used (preloads resources only).
     *
     * Must be called after the SDK is ready (i.e. after `onReady` has fired).
     *
     * Resolves when resources is initialized and the effect is ready to render.
     *
     * @example
     * ```typescript
     * import * as THREE from 'three';
     * import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
     *
     * await sdk.loadAvatars({
     *   modelUrl: 'https://example.com/avatar.glb',
     *   threeJs: { THREE, GLTFLoader }, // Optional
     * });
     * sdk.enableAvatars();
     * ```
     */
    loadAvatars(input?: string | Partial<AvatarsConfig>): Promise<void>;
    /**
     * Cancel any in-flight loading and release resources held by the
     * Avatars effect. The configured model URL is preserved.
     */
    unloadAvatars(): void;
    /**
     * Update runtime-tunable Avatars options that do not require reloading
     * resources.
     */
    setAvatarsOptions(options: {
        faceScaleFactor?: number;
    }): void;
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
     * Set color-filter config.
     *
     * Pass a {@link ColorFilterConfig.promise} to be notified when the LUT load
     * triggered by this call settles: it resolves on success and rejects on
     * failure (or if the effect is destroyed mid-load).
     *
     * Returns `false` when the color-filter effect is not available. In that case
     * the config is not applied and the supplied `promise` is never settled, so
     * guard against it when wrapping the call in a promise:
     *
     * ```ts
     * function applyColorFilter(sdk, config) {
     *   return new Promise((resolve, reject) => {
     *     const applied = sdk.setColorFilterConfig({
     *       ...config,
     *       promise: { resolve, reject },
     *     });
     *     if (!applied) reject(new Error("color-filter effect is not available"));
     *   });
     * }
     * ```
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
    /**
     * Register a callback invoked every time a LUT is successfully loaded and
     * applied to the color-filter effect.
     *
     * @deprecated Prefer the per-call {@link ColorFilterConfig.promise} passed to
     * {@link setColorFilterConfig}. This callback is not invoked when a load fails,
     * whereas the promise also surfaces failures via rejection.
     *
     * @param f - called with the loaded LUT id; pass `undefined` to clear.
     */
    onColorFilterSuccess(f?: (id: string) => void): void;
    /**
     * Register a callback invoked once the low-light effect is ready and starts
     * being applied to the video.
     *
     * The callback is one-shot: it fires a single time and is then cleared.
     *
     * @remarks It is not invoked unless the low-light effect is enabled — the
     * effect becomes ready only while it is active. It also does not report
     * failures.
     *
     * @param f - called once when the effect becomes active; pass `undefined` to clear.
     */
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

declare type Tween = PositionalTween | ScalarTween | ColorTween;

/**
 * Positional tween endpoint. Either a plain `Length` (interpreted against
 * the animated node's immediate parent, like static fields) or an object
 * form that takes dimensions from a different reference node.
 *
 * With `relativeTo`, the `value` is multiplied by the reference node's
 * dimension on the tween's axis (`width` for x-axis properties, `height`
 * for y). Resolved **once at tween start** - later resizes of the
 * reference do not retarget an in-flight tween.
 */
declare type TweenPositionValue = Length | {
    value: Length;
    relativeTo: TweenReference;
};

/**
 * Reference for resolving a positional tween value. `"frame"` is reserved
 * and means the video frame - useful for slide-in entrances that should
 * start one frame-width away from the edge regardless of the immediate
 * parent's size. Any other string is a node `id` somewhere in the tree;
 * `id: "frame"` on a node is rejected at parse time.
 */
declare type TweenReference = "frame" | string;

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
