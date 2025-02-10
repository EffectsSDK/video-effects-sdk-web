import { LowerThird, LtOptions } from "@/components/lower-third/lowerThird";
import { Options as sdkOptions } from '@/Options';
export declare class LtHorizontalMirror extends LowerThird {
    private isReady;
    private middleLine;
    private titleContainer;
    private subtitleContainer;
    private animations;
    private ltWidth;
    private ltHeight;
    private smoothPower;
    constructor(sdkOptions: sdkOptions, options: LtOptions);
    render(): void;
    private createText;
    private createRectangles;
    private addShowFunction;
    private addHideFunction;
}
