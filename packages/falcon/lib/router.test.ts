// import { domExample } from './example'
import { describe, it, expect, beforeAll, mock } from "@jest/globals";
import { FalconRouter } from "./router";

const dir = import.meta.dir;

mock("./router.ts");

const router = new FalconRouter({ dir });

describe("index file", () => {
  beforeAll(() => {
    router.getAllRoutes.mockResolvedValue(["notes", "favourties"]);
  });

  it("should return all routes", async () => {
    const allRoutes = await router.getAllRoutes();
    expect(allRoutes.length).toBe(0);
  });
});
