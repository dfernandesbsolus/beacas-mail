import { Collapse } from "@arco-design/web-react";
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

export const Spacer = ({ nodePath }: { nodePath: Path }) => {
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
  return (
    <CollapseWrapper defaultActiveKey={["0", "1", "2", "3"]}>
      <Collapse.Item name="0" header={t("Block")}>
        <ResponsiveField
          component={AttributeField.Height}
          path={nodePath}
          name="height"
        />
        <ResponsiveField
          component={AttributeField.BackgroundColor}
          path={nodePath}
          name="container-background-color"
        />
      </Collapse.Item>
    </CollapseWrapper>
  );
}
