import { Collapse, Divider } from "@arco-design/web-react";
import { ActiveTabKeys, useEventCallback } from "beacas-editor";
import { NodeUtils, t } from "beacas-core";
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
import { useEditorForm } from "@beacas-plugins/hooks";

export const Wrapper = ({ nodePath }: { nodePath: Path }) => {
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
  const { selectedNode, selectedNodePath } = useSelectedNode();
  const { setFieldValue } = useEditorForm();

  const onVerticalAlignChange = useEventCallback((value: string) => {
    let children = selectedNode?.children;
    let path = selectedNodePath!;

    if (children?.[0] && NodeUtils.isGroupElement(children[0])) {
      children = children[0].children;
      path = [...path, 0];
    }

    children?.forEach((_, index) => {
      setFieldValue(
        [...path, index],
        mode === ActiveTabKeys.DESKTOP
          ? "attributes.vertical-align"
          : "mobileAttributes.vertical-align",
        value
      );
    });
  });

  const onDirectionChange = useEventCallback((value: string) => {
    const children = selectedNode?.children;
    const path = selectedNodePath!;

    if (children?.[0] && NodeUtils.isGroupElement(children[0])) {
      setFieldValue(
        [...path, 0],
        mode === ActiveTabKeys.DESKTOP
          ? "attributes.direction"
          : "mobileAttributes.direction",
        value
      );
    }
  });

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
            component={AttributeField.BackgroundImage}
            path={nodePath}
            name=""
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
      </CollapseWrapper>
    </div>
  );
}
