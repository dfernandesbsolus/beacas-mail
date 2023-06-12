import {
  Input as ArcoInput,
  InputNumber,
  InputTag,
  Slider,
  TreeSelect,
} from "@arco-design/web-react";
import { ButtonField } from "./ButtonField";
import { ButtonGroupField } from "./ButtonGroupField";
import { ColorPickerField } from "./ColorPicker";
import { EditPanelListField } from "./EditPanelListField";
import { enhancer } from "./enhancer";
import { ImageUploaderField } from "./ImageUploaderField";
import { Select } from "./Select";
import { SwitchField } from "./SwitchField";
import { WatchField } from "./WatchField";
import { EditPanelTabsField } from "./EditPanelTabsField";
import { SyncChildrenField } from "./SyncChildrenField";
import { RichTextField } from "./RichTextField";

export const TextField = enhancer(ArcoInput);

export const InputTagField = enhancer(InputTag);

export const SearchField = enhancer(ArcoInput.Search);

export const TextAreaField = enhancer(ArcoInput.TextArea);

export const NumberField = enhancer(InputNumber);

export const SliderField = enhancer(Slider);

export const SelectField = enhancer(Select);

export const TreeSelectField = enhancer(TreeSelect);

export {
  enhancer,
  SwitchField,
  ButtonField,
  ButtonGroupField,
  WatchField,
  SyncChildrenField,
  ColorPickerField,
  ImageUploaderField,
  EditPanelListField,
  EditPanelTabsField,
  RichTextField,
};
