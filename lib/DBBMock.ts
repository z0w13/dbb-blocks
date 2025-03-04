import { Cache, Block } from "./definitions";

export default class DBBMock {
  GetInputValue(key: string, cache: Cache): any {
    return cache.inputs[key];
  }
  GetOptionValue(key: string, cache: Cache): any {
    return cache.options[key];
  }
  StoreOutputValue(value: any, key: string, cache: Cache): any {
    cache.outputs[key] = value;
  }
  RunNextBlock(key: string, cache: Cache): void {
    cache.outputs[key] = { called: true }
  }

  static runBlock(
    block: Block,
    inputs: Record<string, any>,
    options: Record<string, any>,
  ): Cache {
    const defaults = Object.fromEntries(
      block.options.map((opt) => {
        if (opt.type == "SELECT") {
          return [opt.id, Object.keys(opt.options)[0]];
        } else {
          return [opt.id, undefined];
        }
      }),
    );

    const cache: Cache = {
      inputs,
      options: {
        ...defaults,
        ...options,
      },
      outputs: {},
    };

    const dbb = new DBBMock();
    block.code.call(dbb, cache);

    return cache;
  }
}
