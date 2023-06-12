import { Collapse } from "@arco-design/web-react";
import { t } from "beacas-core";
import { useSelectedNode } from "beacas-editor";
import { ActiveTabKeys } from "beacas-editor";
import React, { useCallback } from "react";
import { Path } from "slate";
import { AttributeField } from "../../components/AttributeField";
import { AttributesPanelWrapper } from "../../components/AttributesPanelWrapper";
import { CollapseWrapper } from "../../components/CollapseWrapper";
import {
  ResponsiveField,
  ResponsiveTabs,
} from "../../components/ResponsiveTabs";
import { useEditorForm } from "@beacas-plugins/hooks";

const imageAdapter = {
  formatter(val: string) {
    return Boolean(val);
  },
  normalize(val: string) {
    return val ? "true" : undefined;
  },
};

export const Image = ({ nodePath }: { nodePath: Path }) => {
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
  const { setFieldValue, values } = useEditorForm();

  const pageDataWidth =
    parseInt(values.content.attributes.width || "600") || 600;

  const onCallbackImageDetail = useCallback(
    (detail: { width: number; height: number }) => {
      if (detail.width < pageDataWidth) {
        setFieldValue(nodePath, "attributes.width", detail.width + "px");
      }
    },
    [nodePath, pageDataWidth, setFieldValue]
  );

  if (!selectedNode) return null;

  return (
    <CollapseWrapper defaultActiveKey={["0", "1", "2", "3"]}>
      <Collapse.Item name="3" header={t("Image")}>
        <ResponsiveField
          component={AttributeField.ImageUrl}
          path={nodePath}
          name="src"
          onCallbackImageDetail={onCallbackImageDetail}
          formItem={{ layout: "vertical" }}
        />
      </Collapse.Item>
      <Collapse.Item name="1" header={t("Image settings")}>
        <ResponsiveField
          component={AttributeField.TextField}
          path={nodePath}
          name="href"
          label={t("Link address")}
        />
        <ResponsiveField
          component={AttributeField.TextField}
          path={nodePath}
          name="alt"
          label={t("Alt text")}
          placeholder={t("Brief description of your image")}
        />

        <ResponsiveField
          component={AttributeField.SwitchField}
          path={nodePath}
          name="fluid-on-mobile"
          label={t("Full width on mobile")}
          formItem={imageAdapter}
        />
      </Collapse.Item>
      <Collapse.Item name="0" header={t("Dimension")}>
        <ResponsiveField
          component={AttributeField.ImageWidth}
          path={nodePath}
          name="width"
        />
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

      <Collapse.Item name="2" header={t("Border")}>
        <ResponsiveField
          component={AttributeField.Border}
          path={nodePath}
          name=""
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
          name="align"
          label={t("Align")}
        />
      </Collapse.Item>
    </CollapseWrapper>
  );
}
