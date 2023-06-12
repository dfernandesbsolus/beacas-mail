import { debounce } from 'lodash';
import { makeAutoObservable } from 'mobx';

const CURRENT_COLORS_KEY = 'CURRENT_COLORS_KEY';
const MAX_RECORD_SIZE = 10;

const colorDivRef = document.createElement('div');
const defaultPresetColor: string[] = [
  '#000000',
  '#FFFFFF',
  '#9b9b9b',
  '#d0021b',
  '#4a90e2',
  '#7ed321',
  '#bd10e0',
  '#f8e71c',
];
const getCacheColors = () => {
  try {
    return localStorage.getItem(CURRENT_COLORS_KEY)
      ? JSON.parse(localStorage.getItem(CURRENT_COLORS_KEY)!)
      : [];
  } catch (error) {
    return [];
  }
};

class ColorState {
  constructor() {
    makeAutoObservable(this);
  }

  state = {
    list: [...defaultPresetColor, ...getCacheColors()].slice(
      -MAX_RECORD_SIZE,
    ) as string[],
  };

  addCurrentColor = debounce((newColor: string) => {
    colorDivRef.style.color = '';
    colorDivRef.style.color = newColor;
    if (colorDivRef.style.color) {
      if (this.state.list.includes(newColor)) return;
      const newColors = [...new Set([...this.state.list, newColor])]
        .filter(Boolean)
        .slice(-MAX_RECORD_SIZE);
      this.state.list = newColors;
      localStorage.setItem(CURRENT_COLORS_KEY, JSON.stringify(newColors));
    }
  }, 500);
}

export const colorState = new ColorState();
