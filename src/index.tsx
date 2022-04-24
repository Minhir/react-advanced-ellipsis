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

const baseHiddenStyle = { position: "absolute", visibility: "hidden" } as const;

const hiddenTextStyle = { ...baseTextStyle, ...baseHiddenStyle } as const;

const hiddenTailStyle = { ...tailStyle, ...baseHiddenStyle } as const;

interface TailedEllipsisState {
  setIsEllipsisShown: (isEllipsisShown: boolean) => void;
  setTailWidth: (width: number) => void;
  parentWidth: number;
  hiddenTextWidth: number;
}

const tailedEllipsisStates = new Map<string, TailedEllipsisState>();

let idCounter = 0;

function getId() {
  return `${idCounter++}`;
}

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    if (!(entry.target instanceof HTMLElement)) {
      continue;
    }

    const { width } = entry.contentRect;
    const id = entry.target.dataset.tailedEllipsisId;

    if (!id) {
      continue;
    }

    const description = tailedEllipsisStates.get(id);

    if (!description) {
      continue;
    }

    if (entry.target.dataset.tailedEllipsisRole === "tail") {
      description.setTailWidth(width);

      continue;
    }

    if (entry.target.dataset.tailedEllipsisRole === "parent") {
      description.parentWidth = width;
    }

    if (entry.target.dataset.tailedEllipsisRole === "text") {
      description.hiddenTextWidth = width;
    }

    description.setIsEllipsisShown(
      description.parentWidth < description.hiddenTextWidth
    );
  }
});

const TailedEllipsis = React.memo<TailedEllipsisProps>(
  ({ children: text, tailLength, title, className }) => {
    const [id] = useState(getId);
    const [isEllipsisShown, setIsEllipsisShown] = useState(false);
    const [tailWidth, setTailWidth] = useState<number | null>(null);
    const parentRef = useRef<HTMLDivElement>(null);
    const hiddenTextRef = useRef<HTMLDivElement>(null);
    const hiddenTailRef = useRef<HTMLDivElement>(null);

    const head = useMemo(() => text.slice(0, -tailLength), [text, tailLength]);
    const tail = useMemo(() => text.slice(-tailLength), [text, tailLength]);

    const textStyle = useMemo(
      () =>
        isEllipsisShown
          ? { ...baseTextStyle, width: `calc(100% - ${tailWidth}px)` }
          : baseTextStyle,
      [isEllipsisShown, tailWidth]
    );

    useEffect(() => {
      const parentElement = parentRef.current;
      const hiddenTextElement = hiddenTextRef.current;
      const hiddenTailElement = hiddenTailRef.current;

      if (!parentElement || !hiddenTextElement || !hiddenTailElement) {
        return;
      }

      tailedEllipsisStates.set(id, {
        parentWidth: Infinity,
        hiddenTextWidth: 0,
        setIsEllipsisShown,
        setTailWidth,
      });

      resizeObserver.observe(parentElement);
      resizeObserver.observe(hiddenTextElement);
      resizeObserver.observe(hiddenTailElement);

      return () => {
        resizeObserver.unobserve(parentElement);
        resizeObserver.unobserve(hiddenTextElement);
        resizeObserver.unobserve(hiddenTailElement);
        tailedEllipsisStates.delete(id);
      };
    }, []);

    const isObserverReady = tailWidth !== null;

    const headText = isObserverReady ? (
      <div style={textStyle}>{isEllipsisShown ? head : text}</div>
    ) : null;

    const tailText = (
      <div
        data-tailed-ellipsis-role="tail"
        data-tailed-ellipsis-id={id}
        ref={hiddenTailRef}
        style={isEllipsisShown ? tailStyle : hiddenTailStyle}
      >
        {tail}
      </div>
    );

    const hiddenText = (
      <div
        data-tailed-ellipsis-role="text"
        data-tailed-ellipsis-id={id}
        ref={hiddenTextRef}
        style={hiddenTextStyle}
      >
        {text}
      </div>
    );

    return (
      <div
        ref={parentRef}
        className={className}
        title={title}
        style={parentStyle}
        data-tailed-ellipsis-role="parent"
        data-tailed-ellipsis-id={id}
      >
        {headText}
        {tailText}
        {hiddenText}
      </div>
    );
  }
);

export { TailedEllipsis };
