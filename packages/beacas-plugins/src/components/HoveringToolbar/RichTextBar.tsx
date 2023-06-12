import { TextFormat, useEditorProps } from "beacas-editor";
import React, { useCallback, useMemo } from "react";
import { BgColor } from "./componens/BgColor";
import { FontColor } from "./componens/FontColor";
import { FormatButton } from "./componens/FormatButton";
import { TextLink } from "./componens/TextLink";
import { TurnInto } from "./componens/TurnInto";
import "./HoveringToolbar.scss";
import { MergeTag } from "./componens/MergeTag";
import { TextAlign } from "./componens/TextAlign";
import { MergetagElement, NodeUtils, t } from "beacas-core";
import { Editor, Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { FontSize } from "./componens/FontSize";
import { FontFamily } from "./componens/FontFamily";

export const RichTextBar = ({ list }: { list: Array<TextFormat> }) => {
  const { MergetagPopover } = useEditorProps();

  const editor = useSlate();
  const { selection } = editor;
  const nodePath = selection?.anchor.path ? selection.anchor.path : null;

  const mergetagNodeEntry = nodePath
    ? Editor.above(editor, {
        at: nodePath,
        match: NodeUtils.isMergetagElement,
      })
    : null;

  const mergetagNode = mergetagNodeEntry?.[0] as MergetagElement;

  const onSave = useCallback(
    (val?: string) => {
      if (!mergetagNode) return;

      Transforms.setNodes(
        editor,
        {
          data: {
            default: val,
          },
        },
        {
          at: ReactEditor.findPath(editor, mergetagNode),
        }
      );
    },
    [editor, mergetagNode]
  );

  const content = useMemo(() => {
    const toolsMapping = {
      [TextFormat.TURN_INTO]: <TurnInto />,
      [TextFormat.FONT_SIZE]: <FontSize />,
      [TextFormat.FONT_FAMILY]: <FontFamily />,
      [TextFormat.LINK]: <TextLink />,
      [TextFormat.BOLD]: (
        <FormatButton
          title={t("Bold")}
          format={TextFormat.BOLD}
          icon="icon-bold"
        />
      ),
      [TextFormat.ITALIC]: (
        <FormatButton
          title={t("Italic")}
          format={TextFormat.ITALIC}
          icon="icon-italic"
        />
      ),
      [TextFormat.UNDERLINE]: (
        <FormatButton
          title={t("Underline")}
          format={TextFormat.UNDERLINE}
          icon="icon-underline"
        />
      ),
      [TextFormat.STRIKETHROUGH]: (
        <FormatButton
          title={t("Strikethrough")}
          format={TextFormat.STRIKETHROUGH}
          icon="icon-strikethrough"
        />
      ),
      [TextFormat.TEXT_COLOR]: <FontColor />,
      [TextFormat.BACKGROUND_COLOR]: <BgColor />,
      [TextFormat.MERGETAG]: !mergetagNode && <MergeTag />,
      [TextFormat.ALIGN]: <TextAlign />,
      [TextFormat.REMOVE_FORMAT]: (
        <FormatButton
          title={t("Remove format")}
          format={TextFormat.REMOVE_FORMAT}
          icon="icon-remove"
        />
      ),
    };

    return list.map((key, index) => {
      return (
        <React.Fragment key={key + index}>{toolsMapping[key]}</React.Fragment>
      );
    });
  }, [list, mergetagNode]);

  return (
    <>
      <div style={{ display: "inline-flex", alignItems: "stretch" }}>
        {content}
      </div>
      <div className="mergtag-popover">
        {mergetagNode && MergetagPopover && (
          <MergetagPopover
            element={mergetagNode}
            // onClose={onClose}
            onSave={onSave}
          />
        )}
      </div>
    </>
  );
};
