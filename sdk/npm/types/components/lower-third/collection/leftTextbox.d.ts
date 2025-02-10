import { LowerThird, LtOptions } from "@/components/lower-third/lowerThird";
import { Options as sdkOptions } from '@/Options';
export declare class LtLeftTextbox extends LowerThird {
    private rectBack;
    private rectFront;
    private mask;
    private ltContainer;
    private animations;
    private ltWidth;
    private ltHeight;
    private smoothPower;
    constructor(sdkOptions: sdkOptions, options: LtOptions);
    render(): void;
    private createText;
    private addRectangles;
    private addSpriteMask;
    private addShowFunction;
    private addHideFunction;
}
