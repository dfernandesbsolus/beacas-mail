import { Button, Collapse, Message } from "@arco-design/web-react";
import { MarketingShopwindowElement, t } from "beacas-core";
import { useEditorProps, useSelectedNode } from "beacas-editor";
import { ActiveTabKeys } from "beacas-editor";
import React, { useState } from "react";
import { Path } from "slate";
import { AttributeField } from "../../components/AttributeField";
import { AttributesPanelWrapper } from "../../components/AttributesPanelWrapper";
import { CollapseWrapper } from "../../components/CollapseWrapper";
import {
  ResponsiveField,
  ResponsiveTabs,
} from "../../components/ResponsiveTabs";

import { useEditorForm } from "@beacas-plugins/hooks";
import { previewLoadImage } from "@beacas-plugins/utils/previewLoadImage";
import { generateGif } from "@beacas-plugins/utils";

const imageAdapter = {
  formatter(val: string) {
    return Boolean(val);
  },
  normalize(val: string) {
    return val ? "true" : undefined;
  },
};

export const Shopwindow = ({ nodePath }: { nodePath: Path }) => {
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
}: {
  mode: ActiveTabKeys;
  nodePath: Path;
}) {
  const { onUpload } = useEditorProps();
  const { setFieldValue } = useEditorForm();
  const { selectedNode, setLock } = useSelectedNode();
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!selectedNode) return;

    try {
      setLock(true);
      setLoading(true);

      const imageList = await Promise.all(
        (selectedNode as MarketingShopwindowElement).data.list
          .filter((item) => item.src)
          .map((item) => {
            return previewLoadImage(item.src);
          })
      );

      const gifBlob = await generateGif({
        images: imageList,
        perFrameTime: 1000,
      });

      const url = await onUpload?.(new File([gifBlob], "animatedVitrine.gif"));
      setFieldValue(nodePath, "attributes.src", url);
    } catch (error) {
      console.error(error);

      Message.error(String(error));
    } finally {
      setLoading(false);
      setLock(false);
    }
  };

  if (!selectedNode) return null;

  return (
    <CollapseWrapper defaultActiveKey={["0", "1", "2", "3"]}>
      <Collapse.Item
        name="3"
        header={t("Image")}
        extra={
          <Button loading={loading} type="primary" onClick={generate}>
            {t(`Generate`)}
          </Button>
        }
      >
        <AttributeField.EditPanelTabsField
          path={nodePath}
          tabPosition="top"
          name={`data.list`}
          label=""
          renderItem={(item, index) => (
            <ImageSourceItem index={index} path={nodePath} />
          )}
          renderHeader={(item: any, index) =>
            item.content || t("Image") + " " + (index + 1)
          }
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

function ImageSourceItem({ index, path }: { index: number; path: Path }) {
  return (
    <div style={{ paddingTop: 20 }}>
      <AttributeField.ImageUrl path={path} name={`data.list.[${index}].src`} />
    </div>
  );
}
