function validateInput(input, name) {
  if (typeof input === "string" || input === undefined || input === null) {
    throw new Error("ERROR: '" + name + "' can't be string/undefined/null");
  }
}

function processInput(input, objectProcessMethod) {
  if (typeof input === "string" || input === undefined || input === null) {
    throw new Error("input can't be string/undefined/null");
  }

  if (typeof input[Symbol.iterator] === "function") {
    return new Set(input);
  }

  if (typeof input === "object") {
    switch (objectProcessMethod) {
      case "keys":
        return new Set(Object.keys(input));
      case "values":
        return new Set(Object.values(input));
      default:
        throw new Error(
          `Invalid object process method: ${objectProcessMethod}`,
        );
    }
  }
}

function executeSort(input, method) {
  switch (method) {
    case "no":
      return input;
    case "alpha":
      return Array.from(input).sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true }),
      );
    case "alpharev":
      return Array.from(input).sort((a, b) =>
        b.localeCompare(a, undefined, { numeric: true }),
      );
    default:
      throw new Error(`Invalid sort method: ${method}`);
  }
}

function executeSetOperation(input1, input2, operation) {
  switch (operation) {
    case "union":
      return input1.union(input2);
    case "intersect":
      return input1.intersection(input2);
    case "diff":
      return input1.difference(input2);
    case "symdiff":
      return input1.symmetricDifference(input2);
    default:
      throw new Error(`Invalid set operation: ${operation}`);
  }
}

function convertOutput(input, outputType) {
  switch (outputType) {
    case "set":
      // NOTE: Even if input is an array we directly return it, because that means
      //       it was sorted, and as specified, that converts to array
      return input;
    case "array":
      return Array.from(input);
    default:
      throw new Error(`Invalid output type: ${outputType}`);
  }
}

module.exports = {
  name: "Set Operation",
  description: "Various set operations",
  category: "List Stuff",
  inputs: [
    {
      id: "action",
      name: "Action",
      description:
        "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
      types: ["action"],
    },
    {
      id: "input-1",
      name: "Input 1",
      description:
        "Type: List, Array, Set, Object\n\nDescription: first value to compare",
      types: ["list", "object"],
    },
    {
      id: "input-2",
      name: "Input 2",
      description:
        "Type: List, Array, Set, Object\n\nDescription: second value to compare",
      types: ["list", "object"],
    },
  ],

  outputs: [
    {
      id: "action",
      name: "Action",
      description:
        "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
      types: ["action"],
    },
    {
      id: "result",
      name: "Result",
      description: "Type: array, Set\n\nDescription: result of the operation",
      types: ["list", "object"],
    },
  ],

  options: [
    {
      id: "operation",
      name: "Operation",
      description: "Operation to perform",
      type: "SELECT",
      options: {
        union: "Union (return unique values from both inputs)",
        intersect: "Intersect (return values that are in both inputs)",
        diff: "Diff (return values that are in first but not second input)",
        symdiff:
          "Symmetric Diff (return values that are in either input but not both)",
      },
    },
    {
      id: "object-process",
      name: "Object Processing",
      description: "How to process the input if it's a non-iterable object",
      type: "SELECT",
      options: {
        keys: "Use the object keys as input (Object.keys)",
        values: "Use the object values as input (Object.values)",
      },
    },
    {
      id: "sort",
      name: "Sort",
      description: "Sort the output (will always convert to array)",
      type: "SELECT",
      options: {
        no: "No Sorting",
        alpha: "Sort Alphanumeric",
        alpharev: "Sort Alphanumeric (Reverse)",
      },
    },
    {
      id: "output-type",
      name: "Output Type",
      description: "What kind of item to output",
      type: "SELECT",
      options: {
        set: "Set object (will be ignored if sorted)",
        array: "array",
      },
    },
  ],

  code(cache) {
    const in1 = this.GetInputValue("input-1", cache);
    const in2 = this.GetInputValue("input-2", cache);
    const options = cache.options;

    validateInput(in1, "Input 1");
    validateInput(in2, "Input 2");

    const processed1 = processInput(in1, options["object-process"]);
    const processed2 = processInput(in2, options["object-process"]);

    const operated = executeSetOperation(
      processed1,
      processed2,
      options["operation"],
    );
    const sorted = executeSort(operated, options["sort"]);
    const result = convertOutput(sorted, options["output-type"]);

    this.StoreOutputValue(result, "result", cache);
    this.RunNextBlock("action", cache);
  },
};
