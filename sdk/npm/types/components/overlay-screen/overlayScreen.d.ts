import { Component } from "@/components/component";
import { Options as sdkOptions } from "@/Options";
interface PromiseContainer {
    resolve: Function;
    reject: Function;
}
export interface OverlayScreenOptions {
    url?: string;
    promise?: PromiseContainer;
}
export declare class OverlayScreen extends Component {
    options: OverlayScreenOptions;
    private defaultOverlaySprite;
    private loadedOverlaySprite;
    private resource;
    private isVideo;
    private currentURL;
    private processedURL;
    constructor(sdkOptions: sdkOptions, options?: OverlayScreenOptions);
    render(): void;
    show(): void;
    hide(): void;
    private initOverlayFromUrl;
    setOptions(o: OverlayScreenOptions): Promise<void>;
    private setOverlayImage;
    private loadImage;
    private switchVideoTexture;
}
export {};
