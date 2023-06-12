import {
  ButtonGroupField,
  ColorPickerField,
  EditPanelListField,
  EditPanelTabsField,
  ImageUploaderField,
  NumberField,
  SelectField,
  SwitchField,
  TextAreaField,
  TextField,
  WatchField,
  SyncChildrenField,
  RichTextField,
} from "@beacas-plugins/components/Form";
import { AttributeFieldsMap } from "@beacas-plugins/typings";
import { BackgroundColor } from "./BackgroundColor";
import { Border } from "./Border";
import { FontFamily } from "./FontFamily";
import { FontSize } from "./FontSize";
import { TextAndHeadingStyle } from "./TextAndHeadingStyle";
import { FontWeight } from "./FontWeight";
import { PixelField } from "./PixelField";
import { Typography } from "./Typography";
import { TextAndHeadingList } from "./TextAndHeadingList";
import { Width } from "./Width";
import { LetterSpacing } from "./LetterSpacing";
import { LineHeight } from "./LineHeight";
import { TextAlign } from "./TextAlign";
import { Padding } from "./Padding";
import { Buttons } from "./Buttons";
import { GlobalLink } from "./GlobalLink";
import { Height } from "./Height";
import { ButtonCategory } from "./ButtonCategory";
import { BackgroundImage } from "./BackgroundImage";
import { ImageUrl } from "./ImageUrl";
import { BackgroundPosition } from "./BackgroundPosition";
import { BorderRadius } from "./BorderRadius";
import { StackOnMobile } from "./StackOnMobile";
import { Columns } from "./Columns";
import { DisplayOptions } from "./DisplayOptions";
import { DividerLine } from "./DividerLine";
import { Link } from "./Link";
import { Heading } from "./Heading";
import { VerticalAlign } from "./VerticalAlign";
import { WebFonts } from "./WebFonts";
import { PixelAndPercentField } from "./PixelAndPercentField";
import { ImageWidth } from "./ImageWidth";
import { Direction } from "./Direction";

export const defaultAttributeFields = {
  // Basic Form Field

  WatchField: WatchField,
  SyncChildrenField: SyncChildrenField,
  TextField: TextField,
  NumberField: NumberField,
  PixelField: PixelField,
  SelectField: SelectField,
  ColorPickerField: ColorPickerField,
  SwitchField: SwitchField,
  ButtonGroupField: ButtonGroupField,
  ImageUploaderField: ImageUploaderField,
  EditPanelListField: EditPanelListField,
  EditPanelTabsField: EditPanelTabsField,
  PixelAndPercentField: PixelAndPercentField,

  // Attributes Field
  Heading: Heading,
  Direction: Direction,
  Height: Height,
  Width: Width,
  TextAreaField: TextAreaField,
  Link: Link,
  BackgroundImage: BackgroundImage,
  DisplayOptions: DisplayOptions,
  Columns: Columns,
  BackgroundColor: BackgroundColor,
  DividerLine: DividerLine,
  BackgroundPosition: BackgroundPosition,
  StackOnMobile: StackOnMobile,
  ImageUrl: ImageUrl,
  Border: Border,
  ImageWidth: ImageWidth,
  BorderRadius: BorderRadius,
  FontFamily: FontFamily,
  FontSize: FontSize,
  LetterSpacing: LetterSpacing,
  LineHeight: LineHeight,
  TextAlign: TextAlign,
  VerticalAlign: VerticalAlign,
  Padding: Padding,
  TextAndHeadingStyle: TextAndHeadingStyle,
  FontWeight: FontWeight,
  GlobalLink: GlobalLink,
  Typography: Typography,
  TextAndHeadingList: TextAndHeadingList,
  Buttons: Buttons,
  ButtonCategory: ButtonCategory,
  WebFonts: WebFonts,
  RichTextField,
};

export const AttributeField: AttributeFieldsMap = { ...defaultAttributeFields };
