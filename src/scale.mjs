export function scale(value, unit = "--tw-scale") {
    if (value === 0) return "0";
    return `calc(var(${unit}) * ${value})`;
}

export function scaleInt(value, options = {}) {
    const designWidth = options.designWidth ?? 375;
    const minWidth = options.minWidth ?? 320;
    const maxWidth = options.maxWidth ?? 480;
    const viewportWidth = options.viewportWidth ?? getViewportWidth(designWidth);
    const clampedWidth = Math.min(Math.max(viewportWidth, minWidth), maxWidth);
    return Math.round((clampedWidth / designWidth) * value);
}

function getViewportWidth(fallback) {
    if (typeof window === "undefined") return fallback;
    return window.innerWidth;
}
