import { copyFile } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const src = join(root, "src");
const dist = join(root, "dist");

for (const file of ["plugin.d.ts", "scale.d.ts"]) {
    await copyFile(join(src, file), join(dist, file));
}
