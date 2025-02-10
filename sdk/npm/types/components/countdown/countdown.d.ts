import { Component } from "@/components/component";
import { Options as sdkOptions } from '@/Options';
interface CountdownOptions {
    countDown: number;
}
export declare class CountdownComponent extends Component {
    options: CountdownOptions;
    private currentCount;
    private text;
    private interval;
    private showRejecter;
    constructor(sdkOptions: sdkOptions, options?: CountdownOptions);
    render(): void;
    setOptions(options?: CountdownOptions): void;
    private drawRect;
    private drawText;
    showCountdown(): Promise<any>;
    hideCountdown(): void;
}
export {};
