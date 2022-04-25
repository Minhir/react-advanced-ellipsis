import React from "react";
import { ComponentMeta } from "@storybook/react";

import { TailedEllipsis } from "../src";

import { TextGallery } from "./texts";
import { Table } from "./table";

export default {
  title: "TailedEllipsis",
  component: TailedEllipsis,
} as ComponentMeta<typeof TailedEllipsis>;

export const ReadmeExample = () => (
  <TextGallery widths={[125, 135]} tailLength={13}>
    I don't love ellipsis
  </TextGallery>
);

export const LongTextExample = () => {
  return (
    <TextGallery widths={[150, 250, 350, 450, 550, 650, 750]} tailLength={5}>
      The text-overflow property specifies how overflowed content that is not
      displayed should be signaled to the user.
    </TextGallery>
  );
};

export { Table };
