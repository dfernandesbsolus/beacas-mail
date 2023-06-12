import { Collapse, Divider } from "@arco-design/web-react";
import { ActiveTabKeys } from "beacas-editor";
import { t } from "beacas-core";
import { useSelectedNode } from "beacas-editor";
import React from "react";
import { Path } from "slate";
import { AttributeField } from "../../components/AttributeField";
import { AttributesPanelWrapper } from "../../components/AttributesPanelWrapper";
import { CollapseWrapper } from "../../components/CollapseWrapper";
import {
  ResponsiveField,
  ResponsiveTabs,
} from "../../components/ResponsiveTabs";

export const Column = ({ nodePath }: { nodePath: Path }) => {
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
  const { selectedNode } = useSelectedNode();

  if (!selectedNode) return null;
  return (
    <div>
      <CollapseWrapper defaultActiveKey={["0", "1", "2"]}>
        <Collapse.Item
          contentStyle={{ padding: "28px 13px 8px 13px" }}
          name="2"
          header={t("Dimension")}
        >
          <ResponsiveField
            component={AttributeField.Padding}
            path={nodePath}
            name=""
          />
        </Collapse.Item>
        <Collapse.Item
          contentStyle={{ padding: "28px 13px 8px 13px" }}
          name="0"
          header={t("Background")}
        >
          <ResponsiveField
            name="background-color"
            component={AttributeField.BackgroundColor}
            path={nodePath}
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
        </Collapse.Item>
      </CollapseWrapper>
    </div>
  );
}
