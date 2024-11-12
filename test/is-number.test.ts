import { describe, it, expect } from "@jest/globals";

import isNumber from "../blocks/is-number";
import DBBMock from "../lib/DBBMock";

describe("is-number", () => {
  it.each([
    ["1235"],
    [" 1235"],
    [" 1235 "],
    ["1235 "],
    [1234],
  ])("executes true_action if %j is a valid number", (input) => {
      expect(DBBMock.runBlock(isNumber, { input }, {}).outputs["true_action"])
        .toEqual({ called: true })
  });
  it.each([
    ["-1235"],
    ["12.35"],
    ["12,35"],
    ["1,235"],
    ["1.235"],
    [-1234],
    ["aaaa"],
    [false],
    [true],
    [null],
    [undefined],
  ])("executes false_action if %j isn't a valid number", (input) => {
      expect(DBBMock.runBlock(isNumber, { input }, {}).outputs["false_action"])
        .toEqual({ called: true })
  });
});
