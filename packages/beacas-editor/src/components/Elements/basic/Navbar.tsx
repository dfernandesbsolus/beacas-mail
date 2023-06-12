import { Navbar as AtomNavbar } from "../atom";
import { BlockManager, ElementType } from "beacas-core";

const block = BlockManager.getBlockByType(ElementType.NAVBAR);

export class Navbar extends AtomNavbar {
  static defaultAttributes = {
    ...block.defaultData.attributes,
  };
}
