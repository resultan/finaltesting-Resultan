import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  countryExtractor,
  countryListLookup
} from "./language_spoken";
import httpRequest from "./utils/http-request";

vi.mock("./utils/http-request", () => ({
  default: vi.fn()
}));

const inputObject = {
  country1: { name: "Argentina" },
  country2: { name: "Belize" },
  country3: { name: "Bolivia" }
};

describe("countryExtractor", () => {
  it("converts country data objects into an array of country names", () => {
    const actualValue = countryExtractor(inputObject);

    expect(actualValue[0]).toEqual("Argentina");
    expect(actualValue).toContain("Belize");
    expect(actualValue[2] === "Bolivia").toBe(true);
    expect(actualValue[3]).not.toBeDefined();
  });
});

describe("countryListLookup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a list of countries for the given language code", async () => {
    vi.mocked(httpRequest).mockResolvedValue({
      data: inputObject
    } as any);

    const actualValue = await countryListLookup("en");

    expect(httpRequest).toHaveBeenCalledWith("en");
    expect(actualValue).toEqual([
      "Argentina",
      "Belize",
      "Bolivia"
    ]);
  });

  it("returns undefined when the request fails", async () => {
    vi.mocked(httpRequest).mockRejectedValue(
      new Error("Request failed")
    );

    const actualValue = await countryListLookup("en");

    expect(actualValue).toBeUndefined();
  });
});
