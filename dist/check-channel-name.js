"use strict";
// Invalid characters: spaces & symbols (this may not be exhaustive)
const INVALID_TEXT_CHANNEL_CHARACTERS = " ~!@#$%^&*()+{}|:\"<>?`=,./;'\\[]";
function containsInvalidCharacter(input, characters) {
    return Array.from(characters).some((char) => input.includes(char));
}
function isLowerCase(input) {
    return input.toLowerCase() === input;
}
function validateInput(channel_name, channel_type) {
    if (typeof channel_name !== "string") {
        return false;
    }
    // channel name should be 1-100 characters long
    // see https://discord.com/developers/docs/resources/channel#channel-object-channel-structure
    // NOTE: this includes leading/trailing whitespace, even though discord removes it
    if (channel_name.length < 1 || channel_name.length > 100) {
        return false;
    }
    switch (channel_type) {
        case "thread":
        case "category":
        case "voice":
            return true;
        case "text":
            return (!containsInvalidCharacter(channel_name.trim(), INVALID_TEXT_CHANNEL_CHARACTERS) &&
                // aren't allowed to contain upper case characters
                isLowerCase(channel_name) &&
                // can't start with a dash (-)
                channel_name.at(0) !== "-");
        default:
            throw new Error(`invalid channel type: ${channel_type}`);
    }
}
const block = {
    name: "Check Channel Name",
    description: "Check whether a channel name is valid for the given channel type",
    category: "TODO", // TODO
    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Acceptable Types: Action\n\nDescription: Executes this block.",
            types: ["action"],
        },
        {
            id: "channel_name",
            name: "Channel Name",
            description: "Acceptable Types: Text, Unspecified\n\nDescription: channel name to verify",
            types: ["text", "unspecified"],
        },
    ],
    options: [
        {
            id: "channel_type",
            name: "Channel Type",
            description: "Description: the type of channel to verify the name for",
            type: "SELECT",
            options: {
                text: "Text Channel",
                voice: "Voice Channel",
                category: "Category",
                thread: "Forum Thread",
            },
        },
    ],
    outputs: [
        {
            id: "action_true",
            name: "Action (Valid)",
            description: "Type: Action\n\nDescription: execute this block if the channel name is valid",
            types: ["action"],
        },
        {
            id: "action_false",
            name: "Action (Invalid)",
            description: "Type: Action\n\nDescription: execute this block if the channel name is invalid",
            types: ["action"],
        },
    ],
    code(cache) {
        const channel_name = this.GetInputValue("channel_name", cache);
        const channel_type = this.GetOptionValue("channel_type", cache);
        if (validateInput(channel_name, channel_type)) {
            this.RunNextBlock("action_true", cache);
        }
        else {
            this.RunNextBlock("action_false", cache);
        }
    },
};
module.exports = block;
