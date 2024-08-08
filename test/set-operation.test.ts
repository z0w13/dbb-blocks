import { describe, it, expect } from "@jest/globals";

import setOperation from "../blocks/set-operation";
import DBBMock from "../lib/DBBMock";

describe("validateInput", () => {
  it.each([
    ["invalid", ["a", "b"]],
    [undefined, ["a", "b"]],
    [null, ["a", "b"]],
    [null, "invalid"],
    [["a", "b"], "invalid"],
  ])("errors if inputs are invalid: (%p, %p)", (in1, in2) => {
    expect(() =>
      DBBMock.runBlock(setOperation, { in1, in2 }, { operation: "intersect" }),
    ).toThrow(/can't be string/);
  });
  it("passes if inputs are valid", () => {
    DBBMock.runBlock(
      setOperation,
      { in1: ["a", "b"], in2: ["b", "c"] },
      { operation: "intersect" },
    );
  });
});

describe("processInput", () => {
  it.each([
    new Set("a"),
    ["a"],
    {
      *[Symbol.iterator](): any {
        yield 1;
      },
    },
  ])("handles iterable %p", (iter) => {
    const result = DBBMock.runBlock(
      setOperation,
      { in1: iter, in2: iter },
      { operation: "union" },
    ).outputs["result"];

    expect(result).toEqual(new Set(iter));
  });

  it("handles object keys", () => {
    const result = DBBMock.runBlock(
      setOperation,
      { in1: { a: "c" }, in2: { b: "d" } },
      { operation: "union", objectProcessMethod: "keys" },
    ).outputs["result"];

    expect(result).toEqual(new Set(["a", "b"]));
  });

  it("handles object values", () => {
    const result = DBBMock.runBlock(
      setOperation,
      { in1: { a: "c" }, in2: { b: "d" } },
      { operation: "union", objectProcessMethod: "values" },
    ).outputs["result"];

    expect(result).toEqual(new Set(["c", "d"]));
  });

  // processInput: error invalid process method
  it("errors on invalid process method", () => {
    expect(() => {
      DBBMock.runBlock(
        setOperation,
        { in1: { a: "c" }, in2: { b: "d" } },
        { objectProcessMethod: "invalid" },
      );
    }).toThrow(/object process method/);
  });

  it("errors on unknown input", () => {
    expect(() => {
      DBBMock.runBlock(setOperation, { in1: 3, in2: 5 }, {});
    }).toThrow(/unknown input/);
  });
});

describe("executeSetOperation", () => {
  it.each([
    ["union", ["a", "b", "c"]],
    ["intersect", ["b"]],
    ["diff", ["a"]],
    ["symdiff", ["a", "c"]],
  ])("executes %s correctly", (operation, expected) => {
    const cache = DBBMock.runBlock(
      setOperation,
      { in1: ["a", "b"], in2: ["b", "c"] },
      { operation },
    );

    expect(cache.outputs["result"]).toEqual(new Set(expected));
  });

  it("errors on invalid operation", () => {
    expect(() => {
      DBBMock.runBlock(
        setOperation,
        { in1: ["a", "b"], in2: ["b", "c"] },
        { operation: "invalid" },
      );
    }).toThrow(/invalid set operation/);
  });
});

describe("executeSort", () => {
  it("returns original set if not sorting", () => {
    const result = DBBMock.runBlock(
      setOperation,
      { in1: ["a", "b"], in2: ["b", "c"] },
      { operation: "union" },
    ).outputs["result"];

    expect(result).toEqual(new Set(["a", "b", "c"]));
  });
  it("returns sorted array if 'alpha' sort", () => {
    const result = DBBMock.runBlock(
      setOperation,
      { in1: ["b", "c"], in2: ["b", "a"] },
      { operation: "union", sort: "alpha" },
    ).outputs["result"];

    expect(result).toEqual(["a", "b", "c"]);
  });
  it("returns reverse sorted array if 'revalpha' sort", () => {
    const result = DBBMock.runBlock(
      setOperation,
      { in1: ["a", "b"], in2: ["b", "c"] },
      { operation: "union", sort: "alpharev" },
    ).outputs["result"];

    expect(result).toEqual(["c", "b", "a"]);
  });
  it("errors on invalid sort method", () => {
    expect(() =>
      DBBMock.runBlock(
        setOperation,
        { in1: ["a", "b"], in2: ["b", "c"] },
        { operation: "union", sort: "invalid" },
      ),
    ).toThrow(/invalid sort method/);
  });
});

describe("convertOutput", () => {
  it('returns original set if type is "set"', () => {
    const result = DBBMock.runBlock(
      setOperation,
      { in1: ["a", "b"], in2: ["b", "c"] },
      { operation: "union", outputType: "set" },
    ).outputs["result"];

    expect(result).toEqual(new Set(["a", "b", "c"]));
  });
  it('returns original array if type is "set" and we sorted', () => {
    const result = DBBMock.runBlock(
      setOperation,
      { in1: ["b", "c"], in2: ["b", "a"] },
      { operation: "union", sort: "alpha", outputType: "set" },
    ).outputs["result"];

    expect(result).toEqual(["a", "b", "c"]);
  });
  it('returns array if type is "array"', () => {
    const result = DBBMock.runBlock(
      setOperation,
      { in1: ["b", "c"], in2: ["b", "a"] },
      { operation: "union", outputType: "array" },
    ).outputs["result"];

    expect(result).toEqual(["b", "c", "a"]);
  });
  it("errors on invalid type", () => {
    expect(() =>
      DBBMock.runBlock(
        setOperation,
        { in1: ["a", "b"], in2: ["b", "c"] },
        { operation: "union", outputType: "invalid" },
      ),
    ).toThrow(/invalid output type/);
  });
});
