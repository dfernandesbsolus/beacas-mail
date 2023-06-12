import { useMemo } from "react";

import React from "react";
import { DesktopEmailPreview } from "./components/DesktopEmailPreview";
import { MobilePreview } from "./components/MobilePreview";
import { observer } from "mobx-react";
import { BeacasCore, PageElement } from "beacas-core";
import mjml from "mjml-browser";
import { EmailEditorProps, EmailTemplate } from "beacas-editor";
import { merge } from "lodash";

export const PreviewEmail = observer(
  ({
    isDesktop,
    universalElementSetting,
    values,
    mergetagsData,
  }: {
    isDesktop: boolean;
    universalElementSetting: EmailEditorProps["universalElementSetting"];
    values: EmailTemplate;
    mergetagsData: EmailEditorProps["mergetagsData"];
  }) => {
    const pageVariables = useMemo(() => {
      return BeacasCore.getPageDataVariables(values.content);
    }, [values.content]);

    const mjmlString = useMemo(() => {
      return BeacasCore.toMJML({
        element: values.content as PageElement,
        mode: "production",
        universalElements: universalElementSetting,
        mergetagsData,
      });
    }, [mergetagsData, universalElementSetting, values.content]);

    const html = useMemo(() => {
      const skeletonHtml = mjml(mjmlString).html;
      const finalHtml = BeacasCore.renderWithData(
        skeletonHtml,
        merge(pageVariables, mergetagsData)
      );

      return finalHtml;
    }, [mergetagsData, mjmlString, pageVariables]);

    return useMemo(() => {
      return (
        <>
          <MobilePreview html={html} isActive={!isDesktop} />
          <DesktopEmailPreview html={html} isActive={isDesktop} />
        </>
      );
    }, [html, isDesktop]);
  }
);
