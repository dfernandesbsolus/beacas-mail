import { Social as AtomSocial } from "../atom";
import { BlockManager, ElementType } from "beacas-core";

const block = BlockManager.getBlockByType(ElementType.SOCIAL);

export class Social extends AtomSocial {
  static defaultAttributes = {
    ...block.defaultData.attributes,
  };
}
