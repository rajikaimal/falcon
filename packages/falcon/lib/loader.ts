export default class Loader {
  async evalLoader(loader: Function) {
    try {
      const res = await loader();
      return res;
    } catch (err) {
      console.error("Error when evaluating the loader");
    }
  }
}
