import { makeAutoObservable } from "mobx";

class UI {
  constructor() {
    makeAutoObservable(this);
  }

  blockMenusOverlay = {
    visible: false,
    search: "",
  };

  columnsOverlay = {
    visible: false,
  };

  moreActionsMenusOverlay = {
    visible: false,
    left: 0,
    top: 0,
  };

  imageUploaderOverlay = {
    visible: false,
    left: 0,
    top: 0,
  };

  setSearch = (v: string) => {
    this.blockMenusOverlay.search = v;
  };

  setBlockMenusOverlayVisible = (v: boolean) => {
    this.blockMenusOverlay.visible = v;
  };

  setMoreActionsMenusOverlayVisible = (v: boolean) => {
    this.moreActionsMenusOverlay.visible = v;
  };

  setMoreActionsMenusOverlayPosition = (pos: { left: number; top: number }) => {
    this.moreActionsMenusOverlay.left = pos.left;
    this.moreActionsMenusOverlay.top = pos.top;
  };

  serImageUploaderOverlayVisible = (v: boolean) => {
    this.imageUploaderOverlay.visible = v;
  };

  serImageUploaderOverlayPosition = (pos: { left: number; top: number }) => {
    this.imageUploaderOverlay.left = pos.left;
    this.imageUploaderOverlay.top = pos.top;
  };

  serColumnsOverlayVisible = (v: boolean) => {
    this.columnsOverlay.visible = v;
  };
}

export const ui = new UI();
