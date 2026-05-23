const plugin = require('tailwindcss/plugin');

const defaultOptions = {
    designWidth: 375,
    minWidth: 320,
    maxWidth: 480,
    rootFontSize: 16,
    max: 1000,
    cssVar: '--tw-scale',
    viewportFontSizeVar: '--tw-viewport-font-size',
    includeClamp: true,
    scopeSelector: null,
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
    if (value === '0') return '0';
    return `calc(var(${cssVar}) * ${value})`;
}

function scaleValue(config) {
    const ratio = round(1 / config.rootFontSize);
    if (!config.scopeSelector) return `${ratio}rem`;
    return `calc(var(${config.viewportFontSizeVar}) * ${ratio})`;
}

function clampedScaleValue(config) {
    const ratio = round(1 / config.rootFontSize);
    return `clamp(calc(var(--tw-viewport-font-size-min) * ${ratio}), calc(var(${config.viewportFontSizeVar}) * ${ratio}), calc(var(--tw-viewport-font-size-max) * ${ratio}))`;
}

function createTransform(value, axis) {
    const next = axis === 'x' ? { '--tw-translate-x': value } : { '--tw-translate-y': value };

    return {
        '--tw-translate-x': '0',
        '--tw-translate-y': '0',
        ...next,
        transform:
            'translate(var(--tw-translate-x), var(--tw-translate-y)) var(--tw-rotate, ) var(--tw-skew-x, ) var(--tw-skew-y, ) var(--tw-scale-x, ) var(--tw-scale-y, )',
    };
}

function createHandler(options = {}) {
    const config = { ...defaultOptions, ...options };
    const values = rangeValues(config.max);
    const viewportFontSize = `${round((100 / config.designWidth) * config.rootFontSize)}vw`;
    const minFontSize = `${round((config.minWidth / config.designWidth) * config.rootFontSize)}px`;
    const maxFontSize = `${round((config.maxWidth / config.designWidth) * config.rootFontSize)}px`;
    const scaleSelector = config.scopeSelector || ':root';
    const fontSizeSelector = config.scopeSelector || 'html';

    return ({ addBase, addUtilities, matchUtilities }) => {
        const baseStyles = {
            [scaleSelector]: {
                [config.cssVar]: scaleValue(config),
                [config.viewportFontSizeVar]: viewportFontSize,
                '--tw-viewport-font-size-min': minFontSize,
                '--tw-viewport-font-size-max': maxFontSize,
            },
        };

        baseStyles[fontSizeSelector] = {
            ...(baseStyles[fontSizeSelector] || {}),
            fontSize: `var(${config.viewportFontSizeVar})`,
        };

        if (config.includeClamp) {
            baseStyles['@supports (font-size: clamp(1px, 2vw, 3px))'] = {
                [fontSizeSelector]: {
                    fontSize: `clamp(var(--tw-viewport-font-size-min), var(${config.viewportFontSizeVar}), var(--tw-viewport-font-size-max))`,
                    ...(config.scopeSelector ? { [config.cssVar]: clampedScaleValue(config) } : {}),
                },
            };
        }

        addBase(baseStyles);

        matchUtilities(
            {
                'min-w-s': (value) => ({ minWidth: scaled(value, config.cssVar) }),
                'max-w-s': (value) => ({ maxWidth: scaled(value, config.cssVar) }),
                'min-h-s': (value) => ({ minHeight: scaled(value, config.cssVar) }),
                'max-h-s': (value) => ({ maxHeight: scaled(value, config.cssVar) }),
                'size-s': (value) => ({
                    width: scaled(value, config.cssVar),
                    height: scaled(value, config.cssVar),
                }),
                'p-s': (value) => ({ padding: scaled(value, config.cssVar) }),
                'px-s': (value) => ({
                    paddingLeft: scaled(value, config.cssVar),
                    paddingRight: scaled(value, config.cssVar),
                }),
                'py-s': (value) => ({
                    paddingTop: scaled(value, config.cssVar),
                    paddingBottom: scaled(value, config.cssVar),
                }),
                'pt-s': (value) => ({ paddingTop: scaled(value, config.cssVar) }),
                'pr-s': (value) => ({ paddingRight: scaled(value, config.cssVar) }),
                'pb-s': (value) => ({ paddingBottom: scaled(value, config.cssVar) }),
                'pl-s': (value) => ({ paddingLeft: scaled(value, config.cssVar) }),
                'gap-s': (value) => ({ gap: scaled(value, config.cssVar) }),
                'gap-x-s': (value) => ({ columnGap: scaled(value, config.cssVar) }),
                'gap-y-s': (value) => ({ rowGap: scaled(value, config.cssVar) }),
                'rounded-s': (value) => ({ borderRadius: scaled(value, config.cssVar) }),
                'text-s': (value) => ({ fontSize: scaled(value, config.cssVar) }),
                'leading-s': (value) => ({ lineHeight: scaled(value, config.cssVar) }),
                'border-s': (value) => ({ borderWidth: scaled(value, config.cssVar) }),
                'outline-offset-s': (value) => ({ outlineOffset: scaled(value, config.cssVar) }),
                'scroll-m-s': (value) => ({ scrollMargin: scaled(value, config.cssVar) }),
                'scroll-mx-s': (value) => ({
                    scrollMarginLeft: scaled(value, config.cssVar),
                    scrollMarginRight: scaled(value, config.cssVar),
                }),
                'scroll-my-s': (value) => ({
                    scrollMarginTop: scaled(value, config.cssVar),
                    scrollMarginBottom: scaled(value, config.cssVar),
                }),
                'scroll-mt-s': (value) => ({ scrollMarginTop: scaled(value, config.cssVar) }),
                'scroll-mr-s': (value) => ({ scrollMarginRight: scaled(value, config.cssVar) }),
                'scroll-mb-s': (value) => ({ scrollMarginBottom: scaled(value, config.cssVar) }),
                'scroll-ml-s': (value) => ({ scrollMarginLeft: scaled(value, config.cssVar) }),
                'scroll-p-s': (value) => ({ scrollPadding: scaled(value, config.cssVar) }),
                'scroll-px-s': (value) => ({
                    scrollPaddingLeft: scaled(value, config.cssVar),
                    scrollPaddingRight: scaled(value, config.cssVar),
                }),
                'scroll-py-s': (value) => ({
                    scrollPaddingTop: scaled(value, config.cssVar),
                    scrollPaddingBottom: scaled(value, config.cssVar),
                }),
                'scroll-pt-s': (value) => ({ scrollPaddingTop: scaled(value, config.cssVar) }),
                'scroll-pr-s': (value) => ({ scrollPaddingRight: scaled(value, config.cssVar) }),
                'scroll-pb-s': (value) => ({ scrollPaddingBottom: scaled(value, config.cssVar) }),
                'scroll-pl-s': (value) => ({ scrollPaddingLeft: scaled(value, config.cssVar) }),
                'indent-s': (value) => ({ textIndent: scaled(value, config.cssVar) }),
                'tracking-s': (value) => ({ letterSpacing: scaled(value, config.cssVar) }),
                'basis-s': (value) => ({ flexBasis: scaled(value, config.cssVar) }),
            },
            { values }
        );

        matchUtilities(
            {
                'w-s': (value) => ({ width: scaled(value, config.cssVar) }),
                'h-s': (value) => ({ height: scaled(value, config.cssVar) }),
                'm-s': (value) => ({ margin: scaled(value, config.cssVar) }),
                'mx-s': (value) => ({
                    marginLeft: scaled(value, config.cssVar),
                    marginRight: scaled(value, config.cssVar),
                }),
                'my-s': (value) => ({
                    marginTop: scaled(value, config.cssVar),
                    marginBottom: scaled(value, config.cssVar),
                }),
                'mt-s': (value) => ({ marginTop: scaled(value, config.cssVar) }),
                'mr-s': (value) => ({ marginRight: scaled(value, config.cssVar) }),
                'mb-s': (value) => ({ marginBottom: scaled(value, config.cssVar) }),
                'ml-s': (value) => ({ marginLeft: scaled(value, config.cssVar) }),
                'top-s': (value) => ({ top: scaled(value, config.cssVar) }),
                'right-s': (value) => ({ right: scaled(value, config.cssVar) }),
                'bottom-s': (value) => ({ bottom: scaled(value, config.cssVar) }),
                'left-s': (value) => ({ left: scaled(value, config.cssVar) }),
                'inset-s': (value) => ({ inset: scaled(value, config.cssVar) }),
                'inset-x-s': (value) => ({
                    left: scaled(value, config.cssVar),
                    right: scaled(value, config.cssVar),
                }),
                'inset-y-s': (value) => ({
                    top: scaled(value, config.cssVar),
                    bottom: scaled(value, config.cssVar),
                }),
                'translate-x-s': (value) => createTransform(scaled(value, config.cssVar), 'x'),
                'translate-y-s': (value) => createTransform(scaled(value, config.cssVar), 'y'),
            },
            { values, supportsNegativeValues: true }
        );
    };
}

module.exports = plugin.withOptions((options = {}) => createHandler(options));
