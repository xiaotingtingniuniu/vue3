# Dialog

### Intro

页面上会弹出一个模式框，通常用于消息提示、消息确认或完成当前页面中的特定交互操作。它支持一种方法：函数调用。

### Install

```js
import Dialog from '@/components/Dialog';
```

## Usage

```js
Dialog({
  title: 'Title',
  message: 'Content',
}).then(() => {
  // on right button
}).catch(() => {
  // on left button
})
```

### Async Close

```js
const beforeClose = (action) =>
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(action === 'right');
    }, 1000);
  });
Dialog.confirm({
  title: 'Title',
  message: 'Content',
  beforeClose,
});
```

## API

### Methods

| Name | Description | Attribute | Return value |
| --- | --- | --- | --- |
| Dialog | Show dialog | _options: DialogOptions_ | `Promise<void>` |
| Dialog.close | Close dialog | - | `void` |

### DialogOptions

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| title | Title | _string_ | - |
| message | Message | _string_ | - |
| left | Cancel button text | _string_ | `取消` |
| right | Confirm button text | _string_ | `确认` |
| showLeftButton | show Cancel button | _boolean_ | `true` |
| showRightButton | show Confirm button | _boolean_ | `true` |
| showCloseButton | show Close button | _boolean_ | `false` |
| beforeClose | Callback function before close | _(action: string) => boolean \| Promise\<boolean\>_ | - |

### Events

| Event   | Description                                | Parameters |
| ------- | ------------------------------------------ | ---------- |
| close   | Emitted when closing Dialog                | -          |
