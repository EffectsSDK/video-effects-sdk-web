import { Renderer } from "@/renderer/renderer";
import { RenderTexture } from "@/engine/Texture";
export declare class ComponentRenderSystem {
    private _renderer;
    private _componentProvider;
    private _sourcedTextures;
    private _alphaChannelFilter;
    private _containerRenderSystem;
    constructor(renderer: Renderer, components: any);
    destroy(): void;
    draw(target?: RenderTexture): void;
    private drawComponent;
}
