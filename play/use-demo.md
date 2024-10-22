---
title: Demo组件
---

# Demo组件

提供一个渲染Vue文件与预览代码的上层组件。需要在`component`目录下新增markdown文档，`examples`目录下新建与markdown文档同名目录，接着在该目录下新增Vue组件。

示例目录结构：

```
.
├── .vitepress
├── component
│   └── button.md
├── examples
│   └── button
│       └── base.vue
└── package.json
```

::: tip

注意：组件无法在`component`以外的markdown文件中使用

:::
