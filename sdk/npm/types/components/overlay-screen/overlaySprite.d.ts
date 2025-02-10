import { Sprite, SpriteSource } from "pixi.js";
export declare class OverlaySprite {
    sprite: Sprite;
    ratio: number;
    constructor(source: SpriteSource, width?: number, height?: number);
    destroy(): void;
}
