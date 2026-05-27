const plugin = require("tailwindcss/plugin");

const defaultOptions = {
    designWidth: 375,
    minWidth: 320,
    maxWidth: 480,
    rootFontSize: 16,
    max: 812,
    cssVar: "--tw-scale",
    viewportFontSizeVar: "--tw-viewport-font-size",
    includeClamp: true,
    scopeSelector: null,
    scaleCoreUtilities: false,
};

const defaultSpacing = {
    0: 0,
    px: 1,
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    2.5: 10,
    3: 12,
    3.5: 14,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    24: 96,
    28: 112,
    32: 128,
    36: 144,
    40: 160,
    44: 176,
    48: 192,
    52: 208,
    56: 224,
    60: 240,
    64: 256,
    72: 288,
    80: 320,
    96: 384,
};

const defaultFontSize = {
    xs: [12, 16],
    sm: [14, 20],
    base: [16, 24],
    lg: [18, 28],
    xl: [20, 28],
    "2xl": [24, 32],
    "3xl": [30, 36],
    "4xl": [36, 40],
    "5xl": [48, null],
    "6xl": [60, null],
    "7xl": [72, null],
    "8xl": [96, null],
    "9xl": [128, null],
};

const defaultBorderRadius = {
    none: 0,
    sm: 2,
    DEFAULT: 4,
    md: 6,
    lg: 8,
    xl: 12,
    "2xl": 16,
    "3xl": 24,
    full: null,
};

const defaultBorderWidth = {
    DEFAULT: 1,
    0: 0,
    2: 2,
    4: 4,
    8: 8,
};

function round(value) {
    return Number(value.toFixed(5)).toString();
}

function rangeValues(max) {
    const values = {};
    for (let i = 0; i <= max; i += 1) {
        values[i] = String(i);
    }
    return values;
}

function scaled(value, cssVar) {
    if (value === "0") return "0";
    return `calc(var(${cssVar}) * ${value})`;
}

function scaledCore(value, cssVar) {
    if (value === 0) return "0";
    return `calc(var(${cssVar}) * ${value})`;
}

function className(value) {
    return String(value).replaceAll(".", "\\.");
}

function directionalUtility(prefix, property, key, value, utilities, options = {}) {
    const suffix = key === "DEFAULT" ? "" : `-${className(key)}`;
    utilities[`.${prefix}${suffix}`] = { [property]: value };
    if (options.negative && value !== "0") {
        utilities[`.-${prefix}${suffix}`] = { [property]: options.negativeValue || `calc(${value} * -1)` };
    }
}

function createCoreUtilities(config) {
    if (!config.scaleCoreUtilities) return {};

    const utilities = {};
    const spacingMappings = [
        ["w", "width"],
        ["h", "height"],
        ["min-w", "minWidth"],
        ["max-w", "maxWidth"],
        ["min-h", "minHeight"],
        ["max-h", "maxHeight"],
        ["p", "padding"],
        ["pt", "paddingTop"],
        ["pr", "paddingRight"],
        ["pb", "paddingBottom"],
        ["pl", "paddingLeft"],
        ["gap", "gap"],
        ["gap-x", "columnGap"],
        ["gap-y", "rowGap"],
        ["top", "top"],
        ["right", "right"],
        ["bottom", "bottom"],
        ["left", "left"],
        ["inset", "inset"],
    ];
    const negativeSpacingMappings = [
        ["m", "margin"],
        ["mt", "marginTop"],
        ["mr", "marginRight"],
        ["mb", "marginBottom"],
        ["ml", "marginLeft"],
    ];

    for (const [key, rawValue] of Object.entries(defaultSpacing)) {
        const value = scaledCore(rawValue, config.cssVar);
        const negativeValue = scaledCore(-rawValue, config.cssVar);
        const suffix = className(key);
        utilities[`.size-${suffix}`] = { width: value, height: value };
        utilities[`.px-${suffix}`] = { paddingLeft: value, paddingRight: value };
        utilities[`.py-${suffix}`] = { paddingTop: value, paddingBottom: value };
        utilities[`.mx-${suffix}`] = { marginLeft: value, marginRight: value };
        utilities[`.my-${suffix}`] = { marginTop: value, marginBottom: value };
        utilities[`.inset-x-${suffix}`] = { left: value, right: value };
        utilities[`.inset-y-${suffix}`] = { top: value, bottom: value };

        if (value !== "0") {
            utilities[`.-mx-${suffix}`] = {
                marginLeft: negativeValue,
                marginRight: negativeValue,
            };
            utilities[`.-my-${suffix}`] = {
                marginTop: negativeValue,
                marginBottom: negativeValue,
            };
            utilities[`.-inset-x-${suffix}`] = {
                left: negativeValue,
                right: negativeValue,
            };
            utilities[`.-inset-y-${suffix}`] = {
                top: negativeValue,
                bottom: negativeValue,
            };
        }

        for (const [prefix, property] of spacingMappings) {
            directionalUtility(prefix, property, key, value, utilities, {
                negative: ["top", "right", "bottom", "left", "inset"].includes(prefix),
                negativeValue,
            });
        }
        for (const [prefix, property] of negativeSpacingMappings) {
            directionalUtility(prefix, property, key, value, utilities, { negative: true, negativeValue });
        }
    }

    for (const [key, [size, lineHeight]] of Object.entries(defaultFontSize)) {
        utilities[`.text-${className(key)}`] = {
            fontSize: scaledCore(size, config.cssVar),
            ...(lineHeight === null ? { lineHeight: "1" } : { lineHeight: scaledCore(lineHeight, config.cssVar) }),
        };
    }

    for (const [key, rawValue] of Object.entries(defaultBorderRadius)) {
        const suffix = key === "DEFAULT" ? "" : `-${className(key)}`;
        const value = rawValue === null ? "9999px" : scaledCore(rawValue, config.cssVar);
        utilities[`.rounded${suffix}`] = { borderRadius: value };
        utilities[`.rounded-l${suffix}`] = {
            borderTopLeftRadius: value,
            borderBottomLeftRadius: value,
        };
        utilities[`.rounded-r${suffix}`] = {
            borderTopRightRadius: value,
            borderBottomRightRadius: value,
        };
    }

    for (const [key, rawValue] of Object.entries(defaultBorderWidth)) {
        const suffix = key === "DEFAULT" ? "" : `-${className(key)}`;
        const value = scaledCore(rawValue, config.cssVar);
        utilities[`.border${suffix}`] = { borderWidth: value };
        utilities[`.border-t${suffix}`] = { borderTopWidth: value };
        utilities[`.border-r${suffix}`] = { borderRightWidth: value };
        utilities[`.border-b${suffix}`] = { borderBottomWidth: value };
        utilities[`.border-l${suffix}`] = { borderLeftWidth: value };
    }

    return utilities;
}

function scaleValue(config) {
    const ratio = round(1 / config.rootFontSize);
    if (!config.scopeSelector) return `${ratio}rem`;
    return `calc(var(${config.viewportFontSizeVar}) * ${ratio})`;
}

function createCoreTheme(options = {}) {
    const config = { ...defaultOptions, ...options };
    if (!config.scaleCoreUtilities) return {};

    const spacing = Object.fromEntries(
        Object.entries(defaultSpacing).map(([key, value]) => [key, scaledCore(value, config.cssVar)])
    );

    const fontSize = Object.fromEntries(
        Object.entries(defaultFontSize).map(([key, [size, lineHeight]]) => [
            key,
            lineHeight === null
                ? [scaledCore(size, config.cssVar), { lineHeight: "1" }]
                : [scaledCore(size, config.cssVar), { lineHeight: scaledCore(lineHeight, config.cssVar) }],
        ])
    );

    const borderRadius = Object.fromEntries(
        Object.entries(defaultBorderRadius).map(([key, value]) => [
            key,
            value === null ? "9999px" : scaledCore(value, config.cssVar),
        ])
    );

    const borderWidth = Object.fromEntries(
        Object.entries(defaultBorderWidth).map(([key, value]) => [key, scaledCore(value, config.cssVar)])
    );

    return {
        theme: {
            extend: {
                spacing,
                fontSize,
                borderRadius,
                borderWidth,
            },
        },
    };
}

function clampedScaleValue(config) {
    const ratio = round(1 / config.rootFontSize);
    return `clamp(calc(var(--tw-viewport-font-size-min) * ${ratio}), calc(var(${config.viewportFontSizeVar}) * ${ratio}), calc(var(--tw-viewport-font-size-max) * ${ratio}))`;
}

function createTransform(value, axis) {
    const next = axis === "x" ? { "--tw-translate-x": value } : { "--tw-translate-y": value };

    return {
        "--tw-translate-x": "0",
        "--tw-translate-y": "0",
        ...next,
        transform:
            "translate(var(--tw-translate-x), var(--tw-translate-y)) var(--tw-rotate, ) var(--tw-skew-x, ) var(--tw-skew-y, ) var(--tw-scale-x, ) var(--tw-scale-y, )",
    };
}

function createHandler(options = {}) {
    const config = { ...defaultOptions, ...options };
    const values = rangeValues(config.max);
    const viewportFontSize = `${round((100 / config.designWidth) * config.rootFontSize)}vw`;
    const minFontSize = `${round((config.minWidth / config.designWidth) * config.rootFontSize)}px`;
    const maxFontSize = `${round((config.maxWidth / config.designWidth) * config.rootFontSize)}px`;
    const scaleSelector = config.scopeSelector || ":root";
    const fontSizeSelector = config.scopeSelector || "html";

    return ({ addBase, addUtilities, matchUtilities, postcss }) => {
        const baseStyles = {
            [scaleSelector]: {
                [config.cssVar]: scaleValue(config),
                [config.viewportFontSizeVar]: viewportFontSize,
                "--tw-viewport-font-size-min": minFontSize,
                "--tw-viewport-font-size-max": maxFontSize,
            },
        };

        baseStyles[fontSizeSelector] = {
            ...(baseStyles[fontSizeSelector] || {}),
            fontSize: `var(${config.viewportFontSizeVar})`,
        };

        if (config.includeClamp) {
            baseStyles["@supports (font-size: clamp(1px, 2vw, 3px))"] = {
                [fontSizeSelector]: {
                    fontSize: `clamp(var(--tw-viewport-font-size-min), var(${config.viewportFontSizeVar}), var(--tw-viewport-font-size-max))`,
                    ...(config.scopeSelector ? { [config.cssVar]: clampedScaleValue(config) } : {}),
                },
            };
        }

        addBase(baseStyles);

        if (postcss === null) {
            addUtilities(createCoreUtilities(config));
        }

        matchUtilities(
            {
                "min-w-s": (value) => ({ minWidth: scaled(value, config.cssVar) }),
                "max-w-s": (value) => ({ maxWidth: scaled(value, config.cssVar) }),
                "min-h-s": (value) => ({ minHeight: scaled(value, config.cssVar) }),
                "max-h-s": (value) => ({ maxHeight: scaled(value, config.cssVar) }),
                "size-s": (value) => ({
                    width: scaled(value, config.cssVar),
                    height: scaled(value, config.cssVar),
                }),
                "p-s": (value) => ({ padding: scaled(value, config.cssVar) }),
                "px-s": (value) => ({
                    paddingLeft: scaled(value, config.cssVar),
                    paddingRight: scaled(value, config.cssVar),
                }),
                "py-s": (value) => ({
                    paddingTop: scaled(value, config.cssVar),
                    paddingBottom: scaled(value, config.cssVar),
                }),
                "pt-s": (value) => ({ paddingTop: scaled(value, config.cssVar) }),
                "pr-s": (value) => ({ paddingRight: scaled(value, config.cssVar) }),
                "pb-s": (value) => ({ paddingBottom: scaled(value, config.cssVar) }),
                "pl-s": (value) => ({ paddingLeft: scaled(value, config.cssVar) }),
                "gap-s": (value) => ({ gap: scaled(value, config.cssVar) }),
                "gap-x-s": (value) => ({ columnGap: scaled(value, config.cssVar) }),
                "gap-y-s": (value) => ({ rowGap: scaled(value, config.cssVar) }),
                "rounded-s": (value) => ({ borderRadius: scaled(value, config.cssVar) }),
                "text-s": (value) => ({ fontSize: scaled(value, config.cssVar) }),
                "leading-s": (value) => ({ lineHeight: scaled(value, config.cssVar) }),
                "border-s": (value) => ({ borderWidth: scaled(value, config.cssVar) }),
                "outline-offset-s": (value) => ({ outlineOffset: scaled(value, config.cssVar) }),
                "scroll-m-s": (value) => ({ scrollMargin: scaled(value, config.cssVar) }),
                "scroll-mx-s": (value) => ({
                    scrollMarginLeft: scaled(value, config.cssVar),
                    scrollMarginRight: scaled(value, config.cssVar),
                }),
                "scroll-my-s": (value) => ({
                    scrollMarginTop: scaled(value, config.cssVar),
                    scrollMarginBottom: scaled(value, config.cssVar),
                }),
                "scroll-mt-s": (value) => ({ scrollMarginTop: scaled(value, config.cssVar) }),
                "scroll-mr-s": (value) => ({ scrollMarginRight: scaled(value, config.cssVar) }),
                "scroll-mb-s": (value) => ({ scrollMarginBottom: scaled(value, config.cssVar) }),
                "scroll-ml-s": (value) => ({ scrollMarginLeft: scaled(value, config.cssVar) }),
                "scroll-p-s": (value) => ({ scrollPadding: scaled(value, config.cssVar) }),
                "scroll-px-s": (value) => ({
                    scrollPaddingLeft: scaled(value, config.cssVar),
                    scrollPaddingRight: scaled(value, config.cssVar),
                }),
                "scroll-py-s": (value) => ({
                    scrollPaddingTop: scaled(value, config.cssVar),
                    scrollPaddingBottom: scaled(value, config.cssVar),
                }),
                "scroll-pt-s": (value) => ({ scrollPaddingTop: scaled(value, config.cssVar) }),
                "scroll-pr-s": (value) => ({ scrollPaddingRight: scaled(value, config.cssVar) }),
                "scroll-pb-s": (value) => ({ scrollPaddingBottom: scaled(value, config.cssVar) }),
                "scroll-pl-s": (value) => ({ scrollPaddingLeft: scaled(value, config.cssVar) }),
                "indent-s": (value) => ({ textIndent: scaled(value, config.cssVar) }),
                "tracking-s": (value) => ({ letterSpacing: scaled(value, config.cssVar) }),
                "basis-s": (value) => ({ flexBasis: scaled(value, config.cssVar) }),
            },
            { values }
        );

        matchUtilities(
            {
                "w-s": (value) => ({ width: scaled(value, config.cssVar) }),
                "h-s": (value) => ({ height: scaled(value, config.cssVar) }),
                "m-s": (value) => ({ margin: scaled(value, config.cssVar) }),
                "mx-s": (value) => ({
                    marginLeft: scaled(value, config.cssVar),
                    marginRight: scaled(value, config.cssVar),
                }),
                "my-s": (value) => ({
                    marginTop: scaled(value, config.cssVar),
                    marginBottom: scaled(value, config.cssVar),
                }),
                "mt-s": (value) => ({ marginTop: scaled(value, config.cssVar) }),
                "mr-s": (value) => ({ marginRight: scaled(value, config.cssVar) }),
                "mb-s": (value) => ({ marginBottom: scaled(value, config.cssVar) }),
                "ml-s": (value) => ({ marginLeft: scaled(value, config.cssVar) }),
                "top-s": (value) => ({ top: scaled(value, config.cssVar) }),
                "right-s": (value) => ({ right: scaled(value, config.cssVar) }),
                "bottom-s": (value) => ({ bottom: scaled(value, config.cssVar) }),
                "left-s": (value) => ({ left: scaled(value, config.cssVar) }),
                "inset-s": (value) => ({ inset: scaled(value, config.cssVar) }),
                "inset-x-s": (value) => ({
                    left: scaled(value, config.cssVar),
                    right: scaled(value, config.cssVar),
                }),
                "inset-y-s": (value) => ({
                    top: scaled(value, config.cssVar),
                    bottom: scaled(value, config.cssVar),
                }),
                "translate-x-s": (value) => createTransform(scaled(value, config.cssVar), "x"),
                "translate-y-s": (value) => createTransform(scaled(value, config.cssVar), "y"),
            },
            { values, supportsNegativeValues: true }
        );
    };
}

module.exports = plugin.withOptions((options = {}) => createHandler(options), createCoreTheme);
