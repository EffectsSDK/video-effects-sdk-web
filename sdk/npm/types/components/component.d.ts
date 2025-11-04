import { Container } from "pixi.js";
import { Options as sdkOptions } from '../Options';
type Options = {
    [key: string]: any;
};
export declare abstract class Component {
    container: Container;
    protected options: Options;
    protected sdkOptions: sdkOptions;
    private afterShowFunction;
    private beforeShowFunction;
    private beforeHideFunction;
    private afterHideFunction;
    protected onLoadedFunction: Function;
    constructor(sdkOptions: sdkOptions, options?: Options);
    setOptions(options?: Options): void;
    show(): void;
    hide(): void;
    onLoaded(f: Function): void;
    onBeforeShow(f: Function): void;
    onAfterShow(f: Function): void;
    onBeforeHide(f: Function): void;
    onAfterHide(f: Function): void;
    isVisible(): boolean;
    getOptions(): Options;
    destroy(): void;
    px(value: number): number;
    render(): void;
}
export declare const componentsProxyHandler: ProxyHandler<any>;
export {};
