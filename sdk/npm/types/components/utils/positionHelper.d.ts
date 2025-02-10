interface SizeData {
    width: number;
    height: number;
}
export declare class PositionHelper {
    static calcPosition(_width: number, _height: number, position: ComponentPosition, size: SizeData): {
        x: number;
        y: number;
    };
    private static getPositionFromPlacement;
    private static getCustomPosition;
}
export {};
