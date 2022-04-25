import React, { useEffect, useRef, useState, useMemo } from "react";

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

const baseTextStyle = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  // Min width '2ch' helps to keep first letter for most of the fonts
  minWidth: "2ch",
  verticalAlign: "middle",
  display: "inline-block",
} as const;

const tailedEllipsisStatesCbks = new Map<string, (width: number) => void>();

let idCounter = 0;

function getId() {
  return `${idCounter++}`;
}

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    if (!(entry.target instanceof HTMLElement)) {
      continue;
    }

    const id = entry.target.dataset.tailedEllipsisId;
    const setTailWidth = id ? tailedEllipsisStatesCbks.get(id) : null;

    if (setTailWidth) {
      const { width } = entry.contentRect;

      setTailWidth(Math.ceil(width));
    }
  }
});

const TailedEllipsis = React.memo<TailedEllipsisProps>(
  ({ children: text, tailLength, title, className }) => {
    const [id] = useState(getId);
    const [tailWidth, setTailWidth] = useState<number | null>(null);
    const tailRef = useRef<HTMLSpanElement>(null);

    const head = useMemo(() => text.slice(0, -tailLength), [text, tailLength]);
    const tail = useMemo(() => text.slice(-tailLength), [text, tailLength]);

    const textStyle = useMemo(
      () =>
        tailWidth === null
          ? baseTextStyle
          : { ...baseTextStyle, maxWidth: `calc(100% - ${tailWidth}px)` },
      [tailWidth]
    );

    useEffect(() => {
      const tailElement = tailRef.current;

      if (!tailElement) {
        return;
      }

      tailedEllipsisStatesCbks.set(id, setTailWidth);

      resizeObserver.observe(tailElement);

      return () => {
        resizeObserver.unobserve(tailElement);
        tailedEllipsisStatesCbks.delete(id);
      };
    }, []);

    return (
      <div className={className} title={title} style={parentStyle}>
        <span style={textStyle}>{head}</span>
        <span data-tailed-ellipsis-id={id} ref={tailRef} style={tailStyle}>
          {tail}
        </span>
      </div>
    );
  }
);

export { TailedEllipsis };
