import { Collapse } from "@arco-design/web-react";
import { ElementType, t } from "beacas-core";
import React from "react";
import { Path } from "slate";
import { AttributeField } from "../../components/AttributeField";
import { CollapseWrapper } from "../../components/CollapseWrapper";

export const Page = ({ nodePath }: { nodePath: Path }) => {
  return (
    <CollapseWrapper defaultActiveKey={["0", "1", "2", "TEXT"]}>
      <Collapse.Item
        contentStyle={{ padding: "28px 13px 8px 13px" }}
        name="0"
        header={t("Email settings")}
      >
        <AttributeField.BackgroundColor
          label={t("Template background")}
          path={nodePath}
          name={"attributes.background-color"}
        />
        <AttributeField.BackgroundColor
          label={t("Content background")}
          path={nodePath}
          name={"attributes.content-background-color"}
        />
        <AttributeField.Width path={nodePath} name={"attributes.width"} />

        <AttributeField.PixelField
          label={t("Margin top")}
          suffix={t("px")}
          path={nodePath}
          name={"attributes.margin-top"}
        />
        <AttributeField.PixelField
          label={t("Margin bottom")}
          suffix={t("px")}
          path={nodePath}
          name={"attributes.margin-bottom"}
        />
        <AttributeField.TextAreaField
          label="Preheader"
          path={nodePath}
          name={"data.preheader"}
        />
      </Collapse.Item>
      <Collapse.Item
        contentStyle={{ padding: "28px 13px 8px 13px" }}
        name="TEXT"
        header={t("TEXT & HEADINGS")}
      >
        <AttributeField.TextAndHeadingList />
      </Collapse.Item>
      <Collapse.Item
        contentStyle={{ padding: "28px 13px 8px 13px" }}
        name="BUTTONS"
        header={t("BUTTONS")}
      >
        <AttributeField.ButtonCategory type={ElementType.STANDARD_BUTTON} />
      </Collapse.Item>
      <Collapse.Item
        contentStyle={{ padding: "28px 13px 8px 13px" }}
        name="LINKS"
        header={t("LINKS")}
      >
        <AttributeField.GlobalLink />
      </Collapse.Item>

      <AttributeField.WebFonts />

      <Collapse.Item
        style={{ display: "none" }}
        name="WEB FONTS"
      ></Collapse.Item>
    </CollapseWrapper>
  );
};
