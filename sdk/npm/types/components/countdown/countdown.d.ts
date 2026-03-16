import { Component, ComponentGeometry } from "@/components/component";
import { Options as sdkOptions } from '@/Options';
import { TextureSource } from "@/engine/Texture";
interface CountdownOptions {
    countDown: number;
}
export declare class CountdownComponent extends Component {
    options: CountdownOptions;
    private currentCount;
    private interval;
    private showRejecter;
    private canvas;
    private ctx;
    private readonly tileSize;
    private readonly radius;
    constructor(sdkOptions: sdkOptions, options?: CountdownOptions);
    render(): void;
    setOptions(options?: CountdownOptions): void;
    get source(): TextureSource | null;
    get geometry(): ComponentGeometry;
    private drawRect;
    private drawText;
    showCountdown(): Promise<any>;
    hideCountdown(): void;
    destroy(): void;
}
export {};
