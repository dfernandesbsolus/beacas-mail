import { Divider as AtomDivider } from "../atom";
import { BlockManager, ElementType } from "beacas-core";

const block = BlockManager.getBlockByType(ElementType.DIVIDER);

export class Divider extends AtomDivider {
  static defaultAttributes = {
    ...block.defaultData.attributes,
  };
}
