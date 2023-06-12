import { t } from "beacas-core";
import React from "react";
import { AttributeField } from ".";

const path = [0];
export function WebFonts() {
  return (
    <AttributeField.EditPanelListField
      path={path}
      headerKey="WEB FONTS"
      header={t("WEB FONTS")}
      tabPosition="top"
      name={`data.fonts`}
      label=""
      renderItem={(item, index) => <FontItem index={index} />}
      renderHeader={(item: any, index) => item.name || t("Custom font")}
      onAddItem={() => ({ name: "", href: "" })}
      atLastOne={false}
    />
  );
}

const FontItem: React.FC<{ index: number }> = ({ index }) => {
  return (
    <div style={{ marginTop: 20 }}>
      <>
        <AttributeField.TextField
          label={t("Font name")}
          name={`data.fonts.${index}.name`}
          path={path}
          autoFocus
        />
        <AttributeField.TextField
          label={t("Font Address")}
          name={`data.fonts.${index}.href`}
          path={path}
        />
      </>
    </div>
  );
};
