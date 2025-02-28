import { jest, describe, it, expect } from "@jest/globals";

import createDate from "../blocks/create-date";
import DBBMock from "../lib/DBBMock";

// prettier-ignore
const TEST_CASES: Array<[string, Record<string, number>, string]> = [
  ["2024-12-02",              { year: -1         }, "2023-12-02"],

  ["2024-12-02",              { month: -1        }, "2024-11-02"],
  ["2025-01-01",              { month: -1        }, "2024-12-01"],
  ["2025-01-31",              { month: -2        }, "2024-11-30"],
  ["2024-11-02",              { month: 1         }, "2024-12-02"],
  ["2024-12-01",              { month: 1         }, "2025-01-01"],
  ["2024-11-30",              { month: 2         }, "2025-01-30"],

  ["2024-12-02",              { day: -1          }, "2024-12-01"],
  ["2024-12-01",              { day: -1          }, "2024-11-30"],
  ["2024-11-01",              { day: -1          }, "2024-10-31"],

  ["2024-12-02T23:30",        { hours: -1        }, "2024-12-02T22:30"],
  ["2024-12-02T00:00",        { hours: -1        }, "2024-12-01T23:00"],

  ["2024-12-02T23:30",        { minutes: -1      }, "2024-12-02T23:29"],
  ["2024-12-02T23:00",        { minutes: -1      }, "2024-12-02T22:59"],

  ["2024-12-02T00:00:05",     { seconds: -1      }, "2024-12-02T00:00:04"],
  ["2024-12-02T23:30:00",     { seconds: -1      }, "2024-12-02T23:29:59"],

  ["2024-12-02T00:00:00.003", { milliseconds: -1 }, "2024-12-02T00:00:00.002"],
  ["2024-12-02T23:00:01.000", { milliseconds: -1 }, "2024-12-02T23:00:00.999"],
]

describe("create-date", () => {
    it("returns the current date when start_date = 'current'", () => {
        let now = new Date("2024-01-01T00:00:00");

        jest.useFakeTimers();
        jest.setSystemTime(now);

        expect(
            DBBMock.runBlock(createDate, {}, { start_date: "current" }).outputs[
                "date"
            ],
        ).toEqual(now);

        jest.useRealTimers();
    });

    it("returns 0000-12-30T23:42:30.000Z when start_date = 'beginning'", () => {
        let expected = new Date(0, 0, 0, 0, 0, 0, 0);
        expected.setFullYear(0);

        expect(
            DBBMock.runBlock(createDate, {}, { start_date: "beginning" })
                .outputs["date"],
        ).toEqual(expected);
    });

    it("creates a fixed date with the correct month when start_date = 'beginning'", () => {
        let expected = new Date("2024-01-01T00:00:00");

        expect(
            DBBMock.runBlock(
                createDate,
                { year: 2024, month: 1, day: 1 },
                { start_date: "beginning" },
            ).outputs["date"],
        ).toEqual(expected);
    });

    it("returns the custom date when start_date = 'custom'", () => {
        let custom_date = new Date("2024-01-01");

        expect(
            DBBMock.runBlock(
                createDate,
                { custom_date },
                { start_date: "custom" },
            ).outputs["date"],
        ).toEqual(custom_date);
    });

    it.each(TEST_CASES)(
        "correctly modifies the date: (%p, %p, %p)",
        (start, inputs, expected) => {
            expect(
                DBBMock.runBlock(
                    createDate,
                    { custom_date: new Date(start), ...inputs },
                    { start_date: "custom" },
                ).outputs["date"],
            ).toEqual(new Date(expected));
        },
    );
});
