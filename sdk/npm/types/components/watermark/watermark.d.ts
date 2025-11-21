import { Component } from "../component";
import { Options as sdkOptions } from '@/Options';
export interface WatermarkOptions {
    url: string;
    position: ComponentPosition;
    size: number;
}
export declare class Watermark extends Component {
    protected options: WatermarkOptions;
    private sprite;
    constructor(sdkOptions: sdkOptions, options: Partial<WatermarkOptions>);
    setOptions(options?: WatermarkOptions): void;
    setURL(url: string): Promise<void>;
    setSize(size: number): void;
    setPosition(position: ComponentPosition): void;
    clear(): void;
    render(): void;
    destroy(): void;
}
