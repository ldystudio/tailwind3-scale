# tailwind3-scale

Tailwind CSS v3 移动端适配插件，基于设计稿像素的等比缩放方案。相比 Tailwind v4 方案，本插件使用 v3 plugin API，适合需要兼容 iOS 13 / Safari 13 的项目。

## 安装

```bash
npm install tailwind3-scale
# 或
bun add tailwind3-scale
# 或
pnpm add tailwind3-scale
```

需要 Tailwind CSS v3：

```bash
npm install -D tailwindcss@^3.4 autoprefixer postcss
```

## 使用方式

在 `tailwind.config.js` 中注册插件：

```js
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx,vue}"],
  plugins: [require("tailwind3-scale")],
};
```

然后直接使用 `-s-` 工具类：

```html
<div class="w-s-100 h-s-44 px-s-16 text-s-14 rounded-s-8 -mt-s-10">
  设计稿像素等比缩放
</div>
```

## 在 JS 中使用

对于需要在 JavaScript 中动态设置缩放值的场景，可以导入 `scale` 函数：

```js
const { scale } = require("tailwind3-scale/js");

scale(100); // "calc(var(--tw-scale) * 100)"
scale(-20); // "calc(var(--tw-scale) * -20)"
scale(0); // "0"
scale(100, "--my-scale"); // "calc(var(--my-scale) * 100)"
```

ESM 也支持：

```js
import { scale } from "tailwind3-scale/js";
```

## 工具类说明

所有工具类使用 `-s-` 后缀，数字对应设计稿像素值：

| 类名                                                        | CSS 属性                | 示例                 |
| ----------------------------------------------------------- | ----------------------- | -------------------- |
| `w-s-{n}`                                                   | width                   | `w-s-100`            |
| `h-s-{n}`                                                   | height                  | `h-s-44`             |
| `min-w-s-{n}` / `max-w-s-{n}`                               | min-width / max-width   | `max-w-s-375`        |
| `min-h-s-{n}` / `max-h-s-{n}`                               | min-height / max-height | `min-h-s-100`        |
| `size-s-{n}`                                                | width + height          | `size-s-44`          |
| `p-s-{n}` / `px-s-{n}` / `py-s-{n}`                         | padding                 | `px-s-16`            |
| `pt-s-{n}` / `pr-s-{n}` / `pb-s-{n}` / `pl-s-{n}`           | padding-*               | `pt-s-12`            |
| `m-s-{n}` / `mx-s-{n}` / `my-s-{n}`                         | margin                  | `my-s-20`            |
| `mt-s-{n}` / `mr-s-{n}` / `mb-s-{n}` / `ml-s-{n}`           | margin-*                | `mt-s-20`            |
| `gap-s-{n}` / `gap-x-s-{n}` / `gap-y-s-{n}`                 | gap                     | `gap-s-12`           |
| `top-s-{n}` / `right-s-{n}` / `bottom-s-{n}` / `left-s-{n}` | inset side              | `top-s-44`           |
| `inset-s-{n}` / `inset-x-s-{n}` / `inset-y-s-{n}`           | inset                   | `inset-x-s-16`       |
| `rounded-s-{n}`                                             | border-radius           | `rounded-s-8`        |
| `text-s-{n}`                                                | font-size               | `text-s-14`          |
| `leading-s-{n}`                                             | line-height             | `leading-s-20`       |
| `border-s-{n}`                                              | border-width            | `border-s-1`         |
| `outline-offset-s-{n}`                                      | outline-offset          | `outline-offset-s-2` |
| `translate-x-s-{n}` / `translate-y-s-{n}`                   | transform translate     | `translate-x-s-10`   |
| `scroll-m-s-{n}` / `scroll-p-s-{n}`                         | scroll margin/padding   | `scroll-mt-s-16`     |
| `indent-s-{n}`                                              | text-indent             | `indent-s-32`        |
| `tracking-s-{n}`                                            | letter-spacing          | `tracking-s-1`       |
| `basis-s-{n}`                                               | flex-basis              | `basis-s-100`        |

### 负值支持

支持负值的属性可使用 `-` 前缀：

```html
<div class="-mt-s-10 -left-s-20 -translate-x-s-20"></div>
```

### 任意值支持

默认会生成 `0..812` 范围内的裸数字类名。范围外或小数可以使用 Tailwind v3 任意值语法：

```html
<div class="w-s-[137] text-s-[13.5]"></div>
```

任意值只接受“设计稿像素数字”，不要带单位。使用 `w-s-[10px]` 会生成无效语义的 `calc(var(--tw-scale) * 10px)`。

## 原理

默认基于 375px 设计稿：

- `--tw-scale: 0.0625rem`，即 1 设计稿像素 = `1 / 16rem`
- `html { font-size: 4.26667vw }`，即 `100vw / 375 * 16`
- 新浏览器使用 `clamp()` 限制最小/最大根字号
- 旧 iOS/Safari 不支持 `clamp()` 时，回退到普通 `vw` 根字号

| 设计稿宽度 | 视口宽度 | 1rem    | `w-s-100` 实际宽度 |
| ---------- | -------- | ------- | ------------------ |
| 375px      | 375px    | 16px    | 100px              |
| 375px      | 750px    | 32px    | 200px              |
| 375px      | 320px    | 13.65px | 85.3px             |

## 自定义配置

```js
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx,vue}"],
  plugins: [
    require("tailwind3-scale")({
      designWidth: 390,
      minWidth: 320,
      maxWidth: 480,
      rootFontSize: 16,
      max: 1200,
      cssVar: "--tw-scale",
      viewportFontSizeVar: "--tw-viewport-font-size",
      includeClamp: true,
    }),
  ],
};
```

| 选项                  | 默认值                    | 说明                                                                           |
| --------------------- | ------------------------- | ------------------------------------------------------------------------------ |
| `designWidth`         | `375`                     | 设计稿宽度                                                                     |
| `minWidth`            | `320`                     | `clamp()` 的最小视口参考宽度                                                   |
| `maxWidth`            | `480`                     | `clamp()` 的最大视口参考宽度                                                   |
| `rootFontSize`        | `16`                      | 设计稿宽度下的根字号                                                           |
| `max`                 | `812`                     | 预生成 `0..max` 的裸数字类名                                                   |
| `cssVar`              | `--tw-scale`              | 缩放单位 CSS 变量名                                                            |
| `viewportFontSizeVar` | `--tw-viewport-font-size` | 视口根字号 CSS 变量名                                                          |
| `includeClamp`        | `true`                    | 是否为支持的浏览器生成 `clamp()` 限制                                          |
| `scopeSelector`       | `null`                    | 局部启用选择器；设置后不再覆盖全局 `html` 字号                                 |
| `scaleCoreUtilities`  | `false`                   | 是否让 Tailwind 默认 `size-7` / `text-base` / `rounded-lg` 等 token 也跟随缩放 |

### 局部启用

如果只想让某个页面使用缩放，不影响全站根字号，可以配置 `scopeSelector`：

```js
plugins: [
  require("tailwind3-scale")({
    scopeSelector: ".tw-scale-scope",
    scaleCoreUtilities: true,
  }),
]
```

然后在页面根节点加上这个 class：

```html
<div class="tw-scale-scope">
  <div class="w-s-375">...</div>
</div>
```

局部模式下 `--tw-scale` 会在该 scope 内按视口宽度生成长度变量，所以不会依赖全局 `html` 的 `font-size`。

如果开启 `scaleCoreUtilities`，Tailwind 默认 spacing、fontSize、borderRadius、borderWidth token 会改成变量表达式：

```css
.size-7 {
  width: calc(var(--tw-scale) * 28);
  height: calc(var(--tw-scale) * 28);
}
```

在 `.tw-scale-scope` 内会使用响应式 `--tw-scale`；scope 外没有该变量时不会生效；需要把默认工具类用在 `scopeSelector` 覆盖的节点内。

## 许可证

MIT
