import React, { useLayoutEffect, useRef, useState, useMemo } from "react";

interface TailedEllipsisProps {
  /**
   * Text to be truncated
   */
  children: string;
  /**
   *  Length of a non shrinking tail
   */
  tailLength: number;
  /**
   * Text title
   */
  title?: string;
  /**
   * Text container className
   */
  className?: string;
}

const parentStyle = { whiteSpace: "pre", overflow: "hidden" } as const;

const tailStyle = { display: "inline-block", verticalAlign: "middle" } as const;

const baseHeadStyle = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  // Min width '2ch' helps to keep first letter for most of the fonts
  minWidth: "2ch",
  verticalAlign: "middle",
  display: "inline-block",
} as const;

const tailedEllipsisStatesCbks = new Map<
  HTMLSpanElement,
  (width: number) => void
>();

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    if (!(entry.target instanceof HTMLElement)) {
      continue;
    }

    const setTailWidth = tailedEllipsisStatesCbks.get(entry.target);

    if (setTailWidth) {
      setTailWidth(Math.ceil(entry.contentRect.width));
    }
  }
});

const TailedEllipsis = React.memo<TailedEllipsisProps>(
  ({ children: text, tailLength, title, className }) => {
    const [tailWidth, setTailWidth] = useState<number | null>(null);
    const tailRef = useRef<HTMLSpanElement>(null);

    const head = useMemo(() => text.slice(0, -tailLength), [text, tailLength]);
    const tail = useMemo(() => text.slice(-tailLength), [text, tailLength]);

    const headStyle = useMemo(
      () =>
        tailWidth === null
          ? baseHeadStyle
          : { ...baseHeadStyle, maxWidth: `calc(100% - ${tailWidth}px)` },
      [tailWidth]
    );

    useLayoutEffect(() => {
      const tailElement = tailRef.current;

      if (!tailElement) {
        return;
      }

      tailedEllipsisStatesCbks.set(tailElement, setTailWidth);

      resizeObserver.observe(tailElement);

      // Prevent tail jitter due to unknown initial width
      setTailWidth(Math.ceil(tailElement.offsetWidth));

      return () => {
        resizeObserver.unobserve(tailElement);
        tailedEllipsisStatesCbks.delete(tailElement);
      };
    }, []);

    return (
      <div className={className} title={title} style={parentStyle}>
        <span style={headStyle}>{head}</span>
        <span ref={tailRef} style={tailStyle}>
          {tail}
        </span>
      </div>
    );
  }
);

export { TailedEllipsis };
