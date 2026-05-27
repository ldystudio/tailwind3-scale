function scale(value, unit = "--tw-scale") {
    if (value === 0) return "0";
    return `calc(var(${unit}) * ${value})`;
}

module.exports = { scale };
