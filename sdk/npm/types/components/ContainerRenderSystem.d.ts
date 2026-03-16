import { Renderer } from "@/renderer/renderer";
import { Container } from "./Container";
export declare class ContainerRenderSystem {
    private _renderer;
    private _painter;
    private _cachedItems;
    private _cachedItemIndex;
    constructor(renderer: Renderer);
    onBeginPass(): void;
    onEndPass(): void;
    render(container: Container): void;
    private renderImpl;
    private drawGraphics;
    private drawText;
    private drawMediaAsset;
    private drawContainerTexture;
    private provideCacheItem;
    destroy(): void;
}
