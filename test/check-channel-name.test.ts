import { jest, describe, it, expect } from "@jest/globals";

import checkChannelName from "../blocks/check-channel-name";
import DBBMock from "../lib/DBBMock";

// prettier-ignore
const TEST_CASES: Array<[string, string, boolean]> = [
    ["a".repeat(100), "text"    , true],
    [" ".repeat(101), "text"    , false],
    ["!"            , "text"    , false],
    ["AA"           , "text"    , false],
    ["É"            , "text"    , false],
    ["-"            , "text"    , false],
    ["😊"           , "text"    , true],
    ["!"            , "voice"   , true],
    ["a b"          , "voice"   , true],
    ["a b"          , "thread"  , true],
    ["a b"          , "category", true],
];

describe("check-channel-name", () => {
    it.each(TEST_CASES)(
        "correctly verifies the channel name: (%p, %p, %p)",
        (channel_name, channel_type, expected) => {
            expect(
                DBBMock.runBlock(
                    checkChannelName,
                    { channel_name },
                    { channel_type },
                ).outputs,
            ).toStrictEqual({
                [expected ? "action_true" : "action_false"]: { called: true },
            });
        },
    );
});
