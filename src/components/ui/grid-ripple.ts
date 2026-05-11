// Shared ripple event system for card-grid interaction
export interface GridRippleDetail {
  x: number;
  y: number;
}

export function dispatchGridRipple(x: number, y: number) {
  window.dispatchEvent(
    new CustomEvent<GridRippleDetail>("grid-ripple", {
      detail: { x, y },
    })
  );
}
