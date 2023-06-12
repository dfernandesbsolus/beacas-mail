import {
  BlockManager,
  Element,
  ElementType,
  WrapperElement,
} from "beacas-core";
import { Section } from "./Section";

const block = BlockManager.getBlockByType(ElementType.WRAPPER);

export class Wrapper<T extends Element = WrapperElement> extends Section<T> {
  componentType = "wrapper";

  static defaultAttributes = {
    ...block.defaultData.attributes,
  };
}
