import { Collapse } from "@arco-design/web-react";
import { ActiveTabKeys } from "beacas-editor";
import { t } from "beacas-core";
import { useSelectedNode, validation } from "beacas-editor";
import React from "react";
import { Path } from "slate";
import { AttributeField } from "../../components/AttributeField";
import { AttributesPanelWrapper } from "../../components/AttributesPanelWrapper";
import { CollapseWrapper } from "../../components/CollapseWrapper";
import {
  ResponsiveField,
  ResponsiveTabs,
} from "../../components/ResponsiveTabs";

export const Divider = ({ nodePath }: { nodePath: Path }) => {
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
    <CollapseWrapper defaultActiveKey={["0", "1", "2", "3"]}>
      <Collapse.Item name="0" header={t("Line")}>
        <ResponsiveField
          component={AttributeField.DividerLine}
          path={nodePath}
          name=""
        />
      </Collapse.Item>
      <Collapse.Item name="1" header={t("Dimension")}>
        <ResponsiveField
          component={AttributeField.TextField}
          path={nodePath}
          name="width"
          label={t("Width")}
          formItem={{
            rules: [
              {
                validator(value, callback) {
                  const Validate =
                    validation.unit.typeConstructor("unit(px,%)");
                  const errMsg = new Validate(value || "").getErrorMessage();
                  if (errMsg) {
                    callback(errMsg);
                  }
                },
              },
            ],
          }}
        />
        <ResponsiveField
          label={t("Padding")}
          fieldName="padding"
          component={AttributeField.Padding}
          path={nodePath}
          name=""
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
          name="align"
          label={t("Align")}
        />
      </Collapse.Item>
    </CollapseWrapper>
  );
}
