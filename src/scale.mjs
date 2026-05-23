export function scale(value, unit = "--tw-scale") {
    if (value === 0) return "0";
    return `calc(${value} * var(${unit}))`;
}
