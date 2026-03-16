import { Rect } from "@/engine/utils";
import { TextCanvas, TextStyleInput } from "@/utils/canvas-text";
import { MediaAssetLoader } from "@/utils/MediaAssetLoader";
export declare class Container {
    readonly uid: number;
    position: {
        x: number;
        y: number;
    };
    visible: boolean;
    mask?: Container;
    private _parent;
    private _children;
    get width(): number;
    set width(v: number);
    get height(): number;
    set height(v: number);
    get children(): readonly Container[];
    addChild(child?: Container): void;
    removeChild(child?: Container): void;
    resolveX(relativeTo: Container): number;
    resolveY(relativeTo: Container): number;
    get resolvedX(): number;
    get resolvedY(): number;
    destroy(): void;
}
export declare class Sprite extends Container {
    private _width;
    private _height;
    get width(): number;
    set width(v: number);
    get height(): number;
    set height(v: number);
}
export declare enum PrimitiveType {
    roundedRect = 1,
    rect = 2
}
export declare class Primitive {
    readonly type: PrimitiveType;
    constructor(type: PrimitiveType);
}
export declare class ShapeRect extends Primitive {
    fill: number;
    rect: Rect;
    constructor(type: PrimitiveType, rect: Rect);
}
export declare class ShapeRoundRect extends ShapeRect {
    radii: number;
    constructor(type: PrimitiveType, rect: Rect);
}
export declare class Graphics extends Container {
    private _currentFill;
    private _primitives;
    private _w;
    private _h;
    get width(): number;
    set width(_: number);
    get height(): number;
    set height(_: number);
    beginFill(fill?: number): Graphics;
    drawRoundedRect(x: number, y: number, width: number, height: number, radii: number): Graphics;
    drawRect(x: number, y: number, width: number, height: number): Graphics;
    endFill(): Graphics;
    get primitives(): readonly Primitive[];
    private addPrimitive;
}
export declare class Text extends Sprite {
    private _text;
    private _style?;
    private _canvas?;
    constructor(text?: string, style?: TextStyleInput);
    get frame(): TextCanvas;
}
export declare class MediaAssetSprite extends Sprite {
    readonly mediaAsset: MediaAssetLoader;
    private _cacheId;
    get cacheId(): number;
    incrementCacheId(): void;
    destroy(): void;
}
