import { LowerThird, LtOptions } from "@/components/lower-third/lowerThird";
import { Options as sdkOptions } from '@/Options';
export declare class LtDoubleSlideRect extends LowerThird {
    private titleContainer;
    private subtitleContainer;
    private rectFront;
    private rectBack;
    private animations;
    private isReady;
    private ltWidth;
    private ltHeight;
    private smoothPower;
    constructor(sdkOptions: sdkOptions, options: LtOptions);
    render(): void;
    private createSubtitle;
    private createTitle;
    private createRectangles;
    private addShowFunction;
    private addHideFunction;
    destroy(): void;
}
