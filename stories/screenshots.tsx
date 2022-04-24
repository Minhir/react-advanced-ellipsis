import React from "react";

import { TextGallery } from "./texts";

window.onerror = (event, source, lineno, colno, error) => {
  if (event === "ResizeObserver loop limit exceeded") {
    // Ignore this error is safe https://github.com/WICG/resize-observer/issues/38
    return;
  }

  // patch for https://github.com/fwouts/viteshot/blob/main/renderers/main.ts#L35
  // @ts-expect-error
  window.__done__((error && (error.stack || error.message)) || "Unknown error");
};

export const ILoveEllipsisScreenshot = () => (
  <TextGallery widths={[100, 120, 125]} tailLength={13}>
    {"I don't love ellipsis"}
  </TextGallery>
);
