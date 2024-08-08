export type LineType =
  | "unspecified"
  | "undefined"
  | "null"
  | "object"
  | "boolean"
  | "number"
  | "text"
  | "list"
  | "date"
  | "action";

export interface BlockLine {
  id: string;
  name: string;
  description: string;
  types: Array<LineType>;
}

export interface BlockOptionBase {
  id: string;
  name: string;
  description: string;
}
export interface BlockOptionOther extends BlockOptionBase {
  type: "TEXT" | "COLOR" | "NUMBER";
}
export interface BlockOptionSelect extends BlockOptionBase {
  type: "SELECT";
  options: Record<string, string>;
}
export type BlockOption = BlockOptionOther | BlockOptionSelect;

export interface Cache {
  inputs: Record<string, any>;
  options: Record<string, any>;
  outputs: Record<string, any>;
}

export interface DBB {
  GetInputValue(key: string, cache: Cache): any;
  StoreOutputValue(value: any, key: string, cache: Cache): void;
  RunNextBlock(_key: string, _cache: Cache): void;
}

export interface Block {
  name: string;
  description: string;
  category: string;
  inputs: Array<BlockLine>;
  outputs: Array<BlockLine>;
  options: Array<BlockOption>;
  code: (cache: Cache) => any;
}
