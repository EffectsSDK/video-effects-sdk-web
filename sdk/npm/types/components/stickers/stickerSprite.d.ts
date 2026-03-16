import Player from "apng-js/types/library/player";
import { Options as sdkOptions } from '@/Options';
import { MediaAssetLoader } from "@/utils/MediaAssetLoader";
export declare class Sprite {
    position: {
        x: number;
        y: number;
    };
    width: number;
    height: number;
    alpha: number;
}
interface StickerSpriteOptions {
    sprite: Sprite;
    id: string;
    player?: Player;
    canvas?: HTMLCanvasElement;
    mediaAsset?: MediaAssetLoader;
    size?: number;
    animationPhase?: "showing" | "static" | "hiding";
    shrink: number;
}
export declare class StickerSprite {
    private shrink;
    sprite: Sprite;
    id: string;
    player?: Player;
    canvas?: HTMLCanvasElement;
    mediaAsset?: MediaAssetLoader;
    alpha: number;
    height: number;
    width: number;
    animationPhase: "showing" | "static" | "hiding";
    private sourceRatio;
    private sdkOptions;
    constructor(sdkOptions: sdkOptions, options: StickerSpriteOptions);
    private isShowing;
    private isStatic;
    isHidingStop(): boolean;
    animateAlpha(speed: number): void;
    animateSize(speed: number): void;
    animatePosition(position: {
        x: number;
        y: number;
    }): void;
    reset(): void;
    setSpriteSize(size?: number): void;
    play(): void;
    stop(): void;
    destroy(): void;
}
export {};
