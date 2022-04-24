# React advanced ellipsis

Truncate string where you want and keep it's tail.

Original phrase:

```
I don't love ellipsis
```

Default ellipsis:

```
I don't love ellip...
```

Advanced ellipsis:

```
I do... love ellipsis
```

## How to use

```jsx
import { TailedEllipsis } from "react-advanced-ellipsis";

<TailedEllipsis tailLength={13}>I don't love ellipsis</TailedEllipsis>;
```

> NOTE: the library uses ResizeObserver inside. You may need a polyfill for some old browsers.

## How to build the library

```
npm install
npm run build
```

It will produce artifacts into `dist` folder

## How to run storybook

```
npm run storybook
```
