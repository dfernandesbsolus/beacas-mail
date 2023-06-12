import { Collapse } from "@arco-design/web-react";
import { t } from "beacas-core";
import { useSelectedNode } from "beacas-editor";
import { ActiveTabKeys } from "beacas-editor";
import React from "react";
import { Path } from "slate";
import { AttributeField } from "../../components/AttributeField";
import { AttributesPanelWrapper } from "../../components/AttributesPanelWrapper";
import { CollapseWrapper } from "../../components/CollapseWrapper";
import {
  ResponsiveField,
  ResponsiveTabs,
} from "../../components/ResponsiveTabs";

export const Text = ({ nodePath }: { nodePath: Path }) => {
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
    <CollapseWrapper defaultActiveKey={["0", "1", "2"]}>
      <Collapse.Item name="0" header={t("Dimension")}>
        <ResponsiveField
          component={AttributeField.Height}
          path={nodePath}
          name="height"
        />
        <ResponsiveField
          component={AttributeField.Padding}
          path={nodePath}
          name=""
        />
      </Collapse.Item>
      <Collapse.Item name="1" header={t("Typography")}>
        {mode === ActiveTabKeys.DESKTOP && (
          <AttributeField.Heading
            path={nodePath}
            formItem={{
              labelCol: { span: 8, style: { lineHeight: 1.15 } },
              wrapperCol: { span: 14, offset: 0 },
            }}
          />
        )}
        <ResponsiveField
          mode={mode}
          component={AttributeField.Typography}
          path={nodePath}
          name=""
          type={selectedNode.type}
        />
      </Collapse.Item>
      <Collapse.Item name="2" header={t("Block")}>
        <ResponsiveField
          component={AttributeField.BackgroundColor}
          path={nodePath}
          name="container-background-color"
        />
        <ResponsiveField
          component={AttributeField.TextAlign}
          path={nodePath}
          name={`align`}
        />
      </Collapse.Item>
    </CollapseWrapper>
  );
}
