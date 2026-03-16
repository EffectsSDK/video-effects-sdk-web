import { Options as sdkOptions } from '../Options';
import { TextureSource } from "@/engine/Texture";
import { Rect } from "@/engine/utils";
import { AspectRatio } from "@/engine/Renderer";
import { Container } from "./Container";
export type ComponentFrame = ImageBitmap | HTMLImageElement | HTMLVideoElement;
export interface ComponentGeometry {
    aspectRatio: AspectRatio;
    coord?: Rect;
}
type Options = {
    [key: string]: any;
};
export declare abstract class Component {
    protected options: Options;
    protected sdkOptions: sdkOptions;
    private visible;
    private afterShowFunction;
    private beforeShowFunction;
    private beforeHideFunction;
    private afterHideFunction;
    protected onLoadedFunction: Function | null;
    constructor(sdkOptions: sdkOptions, options?: Options);
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
    destroy(): void;
    px(value: number): number;
    render(): void;
    abstract get source(): TextureSource | Container | null;
    abstract get geometry(): AspectRatio | ComponentGeometry;
    get isOpaque(): boolean;
    get alpha(): number | null;
}
export declare const componentsProxyHandler: ProxyHandler<any>;
export {};
