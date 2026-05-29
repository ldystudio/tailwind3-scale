export declare function scale(value: number, unit?: string): string;

export interface ScaleIntOptions {
    designWidth?: number;
    minWidth?: number;
    maxWidth?: number;
    viewportWidth?: number;
}

export declare function scaleInt(value: number, options?: ScaleIntOptions): number;
