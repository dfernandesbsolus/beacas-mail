import { Collapse, Divider } from "@arco-design/web-react";
import {
  NodeUtils,
  SocialItemElement,
  StandardSocialItemElement,
  t,
} from "beacas-core";
import { useSelectedNode } from "beacas-editor";
import { ActiveTabKeys } from "beacas-editor";
import React, { useEffect } from "react";
import { Editor, Path, Transforms } from "slate";
import { AttributeField } from "../../components/AttributeField";
import { AttributesPanelWrapper } from "../../components/AttributesPanelWrapper";
import { CollapseWrapper } from "../../components/CollapseWrapper";
import {
  ResponsiveField,
  ResponsiveTabs,
} from "../../components/ResponsiveTabs";
import { useSlate } from "slate-react";
import { HistoryEditor } from "slate-history";
import { useEditorForm } from "@beacas-plugins/hooks";
import { isEqual } from "lodash";

export const Social = ({ nodePath }: { nodePath: Path }) => {
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
  const editor = useSlate();
  const { selectedNode } = useSelectedNode();
  const { getFieldValue } = useEditorForm();

  const spacingName =
    mode === ActiveTabKeys.DESKTOP
      ? "attributes.spacing"
      : "mobileAttributes.spacing";
  const spacing = getFieldValue(nodePath, spacingName);

  useEffect(() => {
    HistoryEditor.withoutSaving(editor, () => {
      Editor.withoutNormalizing(editor, () => {
        selectedNode?.children.forEach((child, index) => {
          if (!NodeUtils.isElement(child)) return;
          const item = child as SocialItemElement;

          const attrs = {
            ...item.attributes,
            "padding-left": "0px",
            "padding-right": "0px",
            "padding-top": "0px",
            "padding-bottom": "0px",
          } as StandardSocialItemElement["attributes"];

          if (index !== 0) {
            attrs["padding-left"] = spacing;
          }
          if (isEqual(item.attributes, attrs)) {
            return;
          }

          delete attrs.padding;

          Transforms.setNodes(
            editor,
            {
              [mode === ActiveTabKeys.DESKTOP
                ? "attributes"
                : "mobileAttributes"]: {
                ...attrs,
              },
            },
            {
              at: [...nodePath, index],
            }
          );
        });
      });
    });
  });

  if (!selectedNode) return null;

  return (
    <CollapseWrapper defaultActiveKey={["0", "2", "3", "SocialItems"]}>
      {mode === ActiveTabKeys.DESKTOP && (
        <AttributeField.EditPanelListField
          path={nodePath}
          headerKey="SocialItems"
          header={t("Social items")}
          tabPosition="top"
          name={`children`}
          label=""
          renderItem={(item, index) => (
            <SocialItem index={index} path={[...nodePath, index]} />
          )}
          renderHeader={(item: any, index) => item.content || "Custom"}
        />
      )}
      <Collapse.Item name="0" header={t("Dimension")}>
        <ResponsiveField
          label={t("Icon size")}
          suffix={t("px")}
          component={AttributeField.PixelField}
          path={nodePath}
          name="icon-size"
        />
        <ResponsiveField
          label={t("Item spacing")}
          suffix={t("px")}
          component={AttributeField.PixelField}
          path={nodePath}
          name="spacing"
        />
        <SyncChildrenAttributes nodePath={nodePath} mode={mode} />
        <ResponsiveField
          component={AttributeField.Padding}
          path={nodePath}
          name=""
        />
      </Collapse.Item>
      <Collapse.Item name="Typography" header={t("Typography")}>
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
          component={AttributeField.ButtonGroupField}
          path={nodePath}
          name="mode"
          label={t("Mode")}
          options={[
            {
              value: "horizontal",
              label: t("Horizontal"),
            },
            {
              value: "vertical",
              label: t("Vertical"),
            },
          ]}
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

function SocialItem({ index, path }: { index: number; path: Path }) {
  return (
    <div className="SocialItem">
      <div style={{ marginTop: 10 }} />
      <AttributeField.ImageUrl
        path={path}
        label={t("Icon")}
        name={`attributes.src`}
      />
      <Divider />
      <AttributeField.TextField
        path={[...path, 0]}
        label={t("Text")}
        name={`text`}
      />
      <AttributeField.Link
        label={t("Link address")}
        required
        path={path}
        name={`attributes.href`}
      />
    </div>
  );
}

const SyncChildrenAttributes = ({
  nodePath,
  mode,
}: {
  nodePath: Path;
  mode: ActiveTabKeys;
}) => {
  return (
    <>
      {/* sync Typography */}
      <AttributeField.SyncChildrenField
        path={nodePath}
        mode={mode}
        name="font-family"
        childrenFieldName="font-family"
      />
      <AttributeField.SyncChildrenField
        path={nodePath}
        mode={mode}
        name="font-size"
        childrenFieldName="font-size"
      />
      <AttributeField.SyncChildrenField
        path={nodePath}
        mode={mode}
        name="font-style"
        childrenFieldName="font-style"
      />
      <AttributeField.SyncChildrenField
        path={nodePath}
        mode={mode}
        name="font-weight"
        childrenFieldName="font-weight"
      />
      <AttributeField.SyncChildrenField
        path={nodePath}
        mode={mode}
        name="line-height"
        childrenFieldName="line-height"
      />
      <AttributeField.SyncChildrenField
        path={nodePath}
        mode={mode}
        name="letter-spacing"
        childrenFieldName="letter-spacing"
      />
      <AttributeField.SyncChildrenField
        path={nodePath}
        mode={mode}
        name="text-decoration"
        childrenFieldName="text-decoration"
      />
      <AttributeField.SyncChildrenField
        path={nodePath}
        mode={mode}
        name="text-transform"
        childrenFieldName="text-transform"
      />
      <AttributeField.SyncChildrenField
        path={nodePath}
        mode={mode}
        name="color"
        childrenFieldName="color"
      />
    </>
  );
};
