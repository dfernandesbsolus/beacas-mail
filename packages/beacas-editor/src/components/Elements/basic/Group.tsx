import { Group as AtomGroup } from "../atom";
import { BlockManager, ElementType } from "beacas-core";

const block = BlockManager.getBlockByType(ElementType.GROUP);

export class Group extends AtomGroup {
  static defaultAttributes = {
    ...block.defaultData.attributes,
  };
}
