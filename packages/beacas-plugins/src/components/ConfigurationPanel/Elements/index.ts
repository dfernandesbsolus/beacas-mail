import { ElementType } from "beacas-core";

import { Text } from "./Text";
import { Section } from "./Section";
import { Page } from "./Page";
import { Button } from "./Button";
import { Image } from "./Image";
import { Divider } from "./Divider";
import { Spacer } from "./Spacer";
import { Navbar } from "./Navbar";
import { Social } from "./Social";
import { Hero } from "./Hero";
import { Column } from "./Column";
import { Wrapper } from "./Wrapper";
import { Shopwindow } from "./Shopwindow";
import { Path } from "slate";

export const ConfigPanelsMap: Record<string, React.FC<{ nodePath: Path }>> = {
  [ElementType.PAGE]: Page,
  [ElementType.STANDARD_NAVBAR]: Navbar,
  [ElementType.STANDARD_BUTTON]: Button,
  [ElementType.STANDARD_IMAGE]: Image,
  [ElementType.STANDARD_SOCIAL]: Social,
  [ElementType.STANDARD_DIVIDER]: Divider,
  [ElementType.STANDARD_SPACER]: Spacer,
  [ElementType.STANDARD_WRAPPER]: Wrapper,
  [ElementType.STANDARD_SECTION]: Section,
  [ElementType.STANDARD_COLUMN]: Column,
  [ElementType.STANDARD_HERO]: Hero,

  //text
  [ElementType.STANDARD_TEXT]: Text,
  [ElementType.STANDARD_PARAGRAPH]: Text,
  [ElementType.STANDARD_H1]: Text,
  [ElementType.STANDARD_H2]: Text,
  [ElementType.STANDARD_H3]: Text,
  [ElementType.STANDARD_H4]: Text,

  // marketing
  [ElementType.MARKETING_SHOPWINDOW]: Shopwindow,
};
