import { Ticker, TickerCallback } from "@/utils/worker-timers/ticker";
import { Container, Graphics } from "../Container";
import { Options as sdkOptions } from "@/Options";
import { Component } from "../component";
import { AspectRatio } from "@/engine/Renderer";
export interface LtOptions {
    position?: Position;
    offset?: LtOffsetOptions;
    color?: LtColorOptions;
    text?: LtTextOptions;
}
interface Position {
    x?: number;
    y?: number;
    placement?: Placement;
}
type Placement = "top-left" | "bottom-left" | "center" | "top-right" | "bottom-right" | "custom";
interface LtOffsetOptions {
    y?: number;
    x?: number;
}
interface LtColorOptions {
    primary?: number;
    secondary?: number;
    text?: number;
}
interface LtTextOptions {
    title?: string;
    subtitle?: string;
    maxLengthTitle?: number;
    maxLengthSubtitle?: number;
}
interface LtFonts {
    title: string[];
    subtitle: string[];
}
export declare abstract class LowerThird extends Component {
    ticker: Ticker;
    showFunction: TickerCallback;
    hideFunction: TickerCallback;
    protected container: Container;
    private fontLoader;
    fonts: LtFonts;
    isHideAnimationFinished: boolean;
    isShowing: boolean;
    isHiding: boolean;
    options: Required<LtOptions>;
    constructor(sdkOptions: sdkOptions, options?: LtOptions);
    render(): void;
    setOptions(options?: LtOptions, render?: boolean): void;
    showLowerThird(): void;
    hideLowerThird(): void;
    stopShowing(): void;
    stopHiding(): void;
    private setColor;
    private setOffset;
    private setPosition;
    private setText;
    offsetX(): number;
    offsetY(): number;
    strTrimAndEllipsis(str: string, maxLength: number): string;
    drawRectPrimary(x: number, y: number, width: number, height: number): Graphics;
    drawRectSecondary(x: number, y: number, width: number, height: number): Graphics;
    fontFamily(key: "title" | "subtitle"): string | string[];
    loadFont(key: "title" | "subtitle", fontURL: string): Promise<void>;
    get source(): Container;
    get geometry(): AspectRatio;
    destroy(): void;
}
export {};
