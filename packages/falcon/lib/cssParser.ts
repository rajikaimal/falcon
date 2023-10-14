import { transform } from "lightningcss";

export type Css = {
  code: string | undefined;
  map: string | undefined;
};

export default class CssParser {
  constructor() { }

  parseCss({ fileName, css }: { fileName: string; css: any }): Css | undefined {
    try {
      let { code, map } = transform({
        filename: fileName,
        code: Buffer.from(css),
        minify: true,
        sourceMap: false,
      });

      return {
        code: code.toString(),
        map: map ? map.toString() : undefined,
      };
    } catch (err) {
      console.error(`Error parsing CSS`, err);
    }
  }
}
