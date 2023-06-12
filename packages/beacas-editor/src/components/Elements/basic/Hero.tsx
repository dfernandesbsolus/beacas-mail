import { Hero as AtomHero } from "../atom";
import { BlockManager, ElementType } from "beacas-core";

const block = BlockManager.getBlockByType(ElementType.HERO);

export class Hero extends AtomHero {
  static defaultAttributes = {
    ...block.defaultData.attributes,
  };
}
