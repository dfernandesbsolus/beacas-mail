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

export const Navbar = ({ nodePath }: { nodePath: Path }) => {
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
    <CollapseWrapper defaultActiveKey={["0", "1", "2", "3", "NavrbarItems"]}>
      {mode === ActiveTabKeys.DESKTOP && (
        <AttributeField.EditPanelListField
          path={nodePath}
          headerKey="NavrbarItems"
          header={t("Navbar menus")}
          tabPosition="top"
          name={`children`}
          label=""
          renderItem={(item, index) => (
            <NavbarLink index={index} path={[...nodePath, index]} />
          )}
          renderHeader={(item: any, index) => item.content || "Custom"}
        />
      )}
      <Collapse.Item name="0" header={t("Dimension")}>
        <SyncChildrenAttributes nodePath={nodePath} mode={mode} />
        <ResponsiveField
          component={AttributeField.Padding}
          path={nodePath}
          name=""
        />
        <ResponsiveField
          component={AttributeField.Padding}
          path={nodePath}
          name=""
          label={t("Item padding")}
          fieldName="item-padding"
        />
      </Collapse.Item>
      <Collapse.Item name="1" header={t("Typography")}>
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

function NavbarLink({ index, path }: { index: number; path: Path }) {
  return (
    <div className="NavbarLink">
      <div style={{ marginTop: 10 }} />
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
      <AttributeField.SyncChildrenField
        path={nodePath}
        mode={mode}
        name="item-padding-top"
        childrenFieldName="padding-top"
      />
      <AttributeField.SyncChildrenField
        path={nodePath}
        mode={mode}
        name="item-padding-right"
        childrenFieldName="padding-right"
      />
      <AttributeField.SyncChildrenField
        path={nodePath}
        mode={mode}
        name="item-padding-bottom"
        childrenFieldName="padding-bottom"
      />
      <AttributeField.SyncChildrenField
        path={nodePath}
        mode={mode}
        name="item-padding-left"
        childrenFieldName="padding-left"
      />

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
