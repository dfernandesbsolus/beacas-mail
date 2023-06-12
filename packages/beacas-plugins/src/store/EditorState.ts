import { makeAutoObservable } from "mobx";

class EditorState {
  state = {
    isPreview: false,
    zoom: 100,
  };

  constructor() {
    makeAutoObservable(this);
  }

  setIsPreview = (preview: boolean) => {
    this.state.isPreview = preview;
  };

  togglePreview = () => {
    this.state.isPreview = !this.state.isPreview;
  };
  setZoom = (zoom: number) => {
    this.state.zoom = zoom;
  };
}

export const editorState = new EditorState();
