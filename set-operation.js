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
      types: ["list", "array", "set", "object"],
    },
    {
      id: "input-2",
      name: "Input 2",
      description:
        "Type: List, Array, Set, Object\n\nDescription: second value to compare",
      types: ["array", "set", "object"],
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
      types: ["array", "set"],
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
      description: "How to process the input if it's a javascript object",
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
        set: "Return the result as the resulting Set object",
        array: "Return a javascript array",
      },
    },
  ],

  code(cache) {},
};
