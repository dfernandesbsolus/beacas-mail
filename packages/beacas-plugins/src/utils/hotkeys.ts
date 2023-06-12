import { isKeyHotkey } from "is-hotkey";
import { IS_APPLE } from "./environment";

const HOTKEYS: Record<string, string> = {
  formatBold: "mod+b",
  formatItalic: "mod+i",
  formatUnderline: "mod+u",
  mergeTag: "mod+`",
  selectBlock: "mod+a",
  save: "mod+s",
  alignCenter: "mod+e",
  alignLeft: "mod+l",
  alignRight: "mod+r",
};

const APPLE_HOTKEYS: Record<string, string> = {
  redo: "mod+shift+z",
  undo: "mod+z",
};

const WINDOWS_HOTKEYS: Record<string, string> = {
  redo: "ctrl+y",
  undo: "ctrl+z",
};

/**
 * Create a platform-aware hotkey checker.
 */

const create = (key: string) => {
  const generic = HOTKEYS[key];
  const apple = APPLE_HOTKEYS[key];
  const windows = WINDOWS_HOTKEYS[key];
  const isGeneric = generic && isKeyHotkey(generic);
  const isApple = apple && isKeyHotkey(apple);
  const isWindows = windows && isKeyHotkey(windows);

  return (event: KeyboardEvent | React.KeyboardEvent<HTMLDivElement>) => {
    if (isGeneric && isGeneric(event)) return true;
    if (IS_APPLE && isApple && isApple(event)) return true;
    if (!IS_APPLE && isWindows && isWindows(event)) return true;
    return false;
  };
};

/**
 * Hotkeys.
 */

export default {
  isSelectBlock: create("selectBlock"),
  isMergeTag: create("mergeTag"),
  isSave: create("save"),
  isFormatBold: create("formatBold"),
  isFormatItalic: create("formatItalic"),
  isFormatUnderline: create("formatUnderline"),
  isUndo: create("undo"),
  isRedo: create("redo"),
  alignCenter: create("alignCenter"),
  alignLeft: create("alignLeft"),
  alignRight: create("alignRight"),
};
