import { LowerThird, LtOptions } from "@/components/lower-third/lowerThird";
import { Options as sdkOptions } from '@/Options';
export declare class LtTwoSlideRects extends LowerThird {
    private titleBox;
    private subtitleBox;
    private isTitleTextShown;
    private isTitleRectHidden;
    private isSubtitleTextShown;
    private isSubtitleRectHidden;
    private delay;
    private gap;
    private isReady;
    constructor(sdkOptions: sdkOptions, options: LtOptions);
    render(): void;
    private addShowFunction;
    private addHideFunction;
}
