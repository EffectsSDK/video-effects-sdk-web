import { SmoothNumber } from "@/utils/functions/smoothNumber";
import { Container } from "pixi.js";
import { Options as sdkOptions } from '@/Options';
interface AnimatedBoxOptions {
    text?: string;
    colorText?: number;
    colorTextHidden?: number;
    colorRect?: number;
    size: number;
    offsetX: number;
    isVisible: boolean;
    fontfamily: string | string[];
}
export declare class AnimatedBox {
    container: Container;
    height: number;
    width: number;
    textInAnimation: SmoothNumber;
    textOutAnimation: SmoothNumber;
    rectAnimation: SmoothNumber;
    hiddenMaskAnimation: SmoothNumber;
    private padding;
    private smoothPower;
    private startRectValue;
    private text;
    private hiddenMask;
    private rect;
    private hiddenContainer;
    private sdkOptions;
    constructor(sdkOptions: sdkOptions, options: AnimatedBoxOptions);
    textInAnimateFunction(): void;
    textOutAnimateFunction(): void;
    textResetFunction(): void;
    rectAnimateFunction(isForward: boolean): void;
    hiddenMaskAnimateFunction(isForward: boolean): void;
    destroy(): void;
    private addText;
    private addRect;
    private addHidden;
    private px;
}
export {};
