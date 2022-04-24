import React from "react";

import { TailedEllipsis } from "../src";

export const TextGallery = ({
  widths,
  children,
  tailLength,
}: {
  widths: number[];
  children: string;
  tailLength: number;
}) => {
  return (
    <div>
      {widths.map((width) => {
        return (
          <div
            key={width}
            style={{
              width: `${width}px`,
              border: "1px solid gray",
              margin: "5px",
              padding: "5px",
            }}
          >
            <TailedEllipsis tailLength={tailLength}>{children}</TailedEllipsis>
          </div>
        );
      })}
    </div>
  );
};
