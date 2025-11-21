import { Component } from "@/components/component";
import { Options as sdkOptions } from "@/Options";
export interface StickerOptions {
    capacity: number;
    ratio: number;
    position: ComponentPosition;
    duration: number;
    animationSpeed: number;
    size: number;
    id?: string;
    sticker?: AppendSticker;
}
interface AppendSticker {
    url: string;
    promise: any;
    silenceMode?: boolean;
}
export declare class Stickers extends Component {
    options: StickerOptions;
    private spriteStore;
    private activeID;
    private activeSticker;
    private timerId;
    private ticker;
    private loadSuccesssFunc?;
    private loadErrorFunc?;
    constructor(sdkOptions: sdkOptions, options?: Partial<StickerOptions>);
    show(): void;
    hide(): void;
    onLoadSucccess(f?: Function): void;
    onLoadError(f?: Function): void;
    setOptions(options: Partial<StickerOptions>): Promise<void>;
    private selectSticker;
    private loadSticker;
    private animateSticker;
    private updateSpritePosition;
    private addSticker;
    private calcPosition;
    destroy(): void;
}
export {};
