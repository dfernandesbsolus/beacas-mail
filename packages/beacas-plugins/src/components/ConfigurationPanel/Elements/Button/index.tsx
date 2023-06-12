import { Collapse } from "@arco-design/web-react";
import { t } from "beacas-core";
import { useSelectedNode } from "beacas-editor";
import { ActiveTabKeys } from "beacas-editor";
import React, { useMemo } from "react";
import { Path } from "slate";
import { AttributeField } from "../../components/AttributeField";
import { AttributesPanelWrapper } from "../../components/AttributesPanelWrapper";
import { CollapseWrapper } from "../../components/CollapseWrapper";
import {
  ResponsiveField,
  ResponsiveTabs,
} from "../../components/ResponsiveTabs";

const buttonWidthAdapter = {
  formatter(val: string) {
    return val === "100%" ? "100%" : "auto";
  },
  normalize(val: string) {
    return val === "100%" ? "100%" : undefined;
  },
};

export const Button = ({ nodePath }: { nodePath: Path }) => {
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

  const textPath = useMemo(() => {
    return [...nodePath, 0];
  }, [nodePath]);

  if (!selectedNode) return null;

  return (
    <CollapseWrapper defaultActiveKey={["0", "1", "2", "3", "4"]}>
      <Collapse.Item name="3" header={t("Content")}>
        <AttributeField.TextField
          path={textPath}
          name="text"
          label={t("Content")}
        />
        <AttributeField.TextField
          path={nodePath}
          name="attributes.href"
          label={t("URL")}
        />
      </Collapse.Item>
      <Collapse.Item name="0" header={t("Dimension")}>
        <ResponsiveField
          label={t("Width")}
          component={AttributeField.ButtonGroupField}
          path={nodePath}
          name="width"
          options={[
            { label: t("Auto"), value: "auto" },
            { label: t("Full width"), value: "100%" },
          ]}
          formItem={buttonWidthAdapter}
        />
        <ResponsiveField
          component={AttributeField.Height}
          path={nodePath}
          name="height"
        />
        <ResponsiveField
          label={t("Inner padding")}
          fieldName="inner-padding"
          component={AttributeField.Padding}
          path={nodePath}
          name=""
        />
        <ResponsiveField
          component={AttributeField.Padding}
          path={nodePath}
          name=""
        />
      </Collapse.Item>
      <Collapse.Item name="1" header={t("Typography")}>
        <ResponsiveField
          mode={mode}
          component={AttributeField.Buttons}
          path={nodePath}
          name=""
          type={selectedNode.type}
          hidePadding
        />
      </Collapse.Item>
      <Collapse.Item name="2" header={t("Border")}>
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
      </Collapse.Item>
      <Collapse.Item name="4" header={t("Block")}>
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
