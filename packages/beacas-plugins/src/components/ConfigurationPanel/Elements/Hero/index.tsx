import { Collapse, Divider } from "@arco-design/web-react";
import { ActiveTabKeys } from "beacas-editor";
import { t } from "beacas-core";
import React from "react";
import { Path } from "slate";
import { AttributeField } from "../../components/AttributeField";
import { AttributesPanelWrapper } from "../../components/AttributesPanelWrapper";
import { CollapseWrapper } from "../../components/CollapseWrapper";
import {
  ResponsiveField,
  ResponsiveTabs,
} from "../../components/ResponsiveTabs";
import { useEditorForm } from "@beacas-plugins/hooks";

export const Hero = ({ nodePath }: { nodePath: Path }) => {
  return (
    <AttributesPanelWrapper>
      <ResponsiveTabs
        desktop={
          <AttributesContainer
            mode={ActiveTabKeys.DESKTOP}
            nodePath={nodePath}
          />
        }
        mobile={
          <AttributesContainer
            mode={ActiveTabKeys.MOBILE}
            nodePath={nodePath}
          />
        }
      />
    </AttributesPanelWrapper>
  );
};

function AttributesContainer({
  nodePath,
  mode,
}: {
  mode: ActiveTabKeys;
  nodePath: Path;
}) {
  const { getFieldValue } = useEditorForm();

  const isFixedHeight =
    getFieldValue(
      nodePath,
      mode === ActiveTabKeys.DESKTOP
        ? "attributes.mode"
        : "mobileAttributes.mode"
    ) === "fixed-height";

  return (
    <CollapseWrapper defaultActiveKey={["0", "1", "2", "3"]}>
      <Collapse.Item name="1" header={t("Setting")}>
        <ResponsiveField
          label={t("Mode")}
          component={AttributeField.ButtonGroupField}
          path={nodePath}
          name="mode"
          options={[
            {
              label: t("Auto height"),
              value: "fluid-height",
            },
            {
              label: t("Fixed height"),
              value: "fixed-height",
            },
          ]}
        />

        <ResponsiveField
          component={AttributeField.Width}
          path={nodePath}
          name="width"
          label={t("Width")}
        />
        {isFixedHeight && (
          <>
            <ResponsiveField
              component={AttributeField.Height}
              path={nodePath}
              name="height"
              label={t("Height")}
            />
            <ResponsiveField
              component={AttributeField.VerticalAlign}
              path={nodePath}
              name="vertical-align"
            />
          </>
        )}
      </Collapse.Item>
      <Collapse.Item
        contentStyle={{ padding: "28px 13px 8px 13px" }}
        name="0"
        header={t("Background")}
      >
        <ResponsiveField
          component={AttributeField.BackgroundImage}
          path={nodePath}
          hideBackgroundSize
          name=""
        />
        <ResponsiveField
          component={AttributeField.Height}
          path={nodePath}
          name="background-height"
        />
        <Divider />
        <ResponsiveField
          component={AttributeField.Border}
          path={nodePath}
          name=""
        />
        <ResponsiveField
          component={AttributeField.BorderRadius}
          path={nodePath}
          name="border-radius"
        />
        <Divider />
        <ResponsiveField
          name="background-color"
          component={AttributeField.BackgroundColor}
          path={nodePath}
        />
      </Collapse.Item>
      <Collapse.Item name="2" header={t("Block")}>
        <ResponsiveField
          label={t("Padding")}
          fieldName="padding"
          component={AttributeField.Padding}
          path={nodePath}
          name=""
        />
        <ResponsiveField
          component={AttributeField.BackgroundColor}
          path={nodePath}
          name="container-background-color"
        />
        <ResponsiveField
          component={AttributeField.TextAlign}
          path={nodePath}
          name="align"
          label={t("Align")}
        />
      </Collapse.Item>
    </CollapseWrapper>
  );
}
