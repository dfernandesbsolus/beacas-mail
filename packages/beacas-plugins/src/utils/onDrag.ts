import { debounce } from 'lodash';

/**
 *
 * @param event
 */
export const onDrag = ({
  event,
  onMove,
  onEnd,
  contentWindow = window,
}: {
  event: PointerEvent;
  onMove: (x: number, y: number) => void;
  onEnd?: () => void;
  contentWindow?: Window;
}) => {
  event.preventDefault();
  event.stopPropagation();

  let initX = 0;
  let initY = 0;

  initX = event.clientX;
  initY = event.clientY;

  const onDragMove = debounce((mEvt: PointerEvent) => {
    let movX = 0;
    let movY = 0;

    movX = mEvt.clientX;
    movY = mEvt.clientY;

    const diffX = movX - initX;
    const diffY = movY - initY;

    onMove(diffX, diffY);
  });

  const onDragEnd = () => {
    onEnd && onEnd();
    contentWindow.removeEventListener('pointermove', onDragMove, true);
    contentWindow.removeEventListener('pointerup', onDragEnd, true);
    if (contentWindow !== window) {
      contentWindow.removeEventListener('pointerup', onDragEnd, true);
    }
  };

  contentWindow.addEventListener('pointermove', onDragMove, true);
  contentWindow.addEventListener('pointerup', onDragEnd, true);
  if (contentWindow !== window) {
    contentWindow.addEventListener('pointerup', onDragEnd, true);
  }
};
