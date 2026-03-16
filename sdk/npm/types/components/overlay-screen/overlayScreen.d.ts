import { Component } from "@/components/component";
import { Options as sdkOptions } from "@/Options";
import { TextureSource } from "@/engine/Texture";
import { AspectRatio } from "@/engine/Renderer";
interface PromiseContainer {
    resolve: Function;
    reject: Function;
}
export interface OverlayScreenOptions {
    url?: string;
    promise?: PromiseContainer;
}
export declare class OverlayScreen extends Component {
    private assetLoader;
    private currentURL;
    private processedURL;
    constructor(sdkOptions: sdkOptions, options?: OverlayScreenOptions);
    render(): void;
    show(): void;
    hide(): void;
    private initOverlayFromUrl;
    setOptions(o?: OverlayScreenOptions): void;
    get source(): TextureSource | null;
    get geometry(): AspectRatio;
    get isOpaque(): boolean;
    private loadImage;
    private switchVideoTexture;
    destroy(): void;
}
export {};
