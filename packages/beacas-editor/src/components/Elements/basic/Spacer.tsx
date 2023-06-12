import { Spacer as AtomSpacer } from "../atom";
import { BlockManager, ElementType } from "beacas-core";

const block = BlockManager.getBlockByType(ElementType.SPACER);

export class Spacer extends AtomSpacer {
  static defaultAttributes = {
    ...block.defaultData.attributes,
  };
}
