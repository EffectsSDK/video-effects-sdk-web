import { LowerThird, LtOptions } from "@/components/lower-third/lowerThird";
import { Options as sdkOptions } from '@/Options';
export declare class LtSlideBold extends LowerThird {
    private titleContainer;
    private subtitleContainer;
    private vertLineContainer;
    private titleRect;
    private rectFront;
    private rectBack;
    private titleFontSize;
    private titleTextMask;
    private titleRectMask;
    private animations;
    private isReady;
    private ltHeight;
    private smoothPower;
    constructor(sdkOptions: sdkOptions, options: LtOptions);
    render(): void;
    private createTitle;
    private createSubtitle;
    private createRectangles;
    private addShowFunction;
    private addHideFunction;
    destroy(): void;
}
