import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { getFiles, makeDir, removeDir, writeStaticFile } from "./utils/fs";

export default class StaticBuilder {
  async build(currentDir: string) {
    const defaultOutputDir = `${import.meta.dir}/build/`;

    const componentFiles = await getFiles("./pages");

    removeDir(defaultOutputDir);
    makeDir(defaultOutputDir);

    componentFiles?.forEach(async (filePath) => {
      const component = await import(`${currentDir}/${filePath}`);

      const currentComponent = createElement(component.default);
      const html = renderToStaticMarkup(currentComponent);
      const fileName = filePath.split("pages/")[1].split(".tsx")[0];

      await writeStaticFile(`${defaultOutputDir}${fileName}.html`, html);
    });
  }
}
