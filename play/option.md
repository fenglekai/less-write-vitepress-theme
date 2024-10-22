---
title: 选项
---

# 选项

Config提供基础选项，配置文档路径与是否使用彩虹特效

## docRoot

- **Type:**`string`

项目的文档路径。用于寻找目录下的`component`/`examples`目录，也是Demo组件的关键目录。

## rainbowAnimation

- **Type:**`boolean`

是否开启彩虹动画（同时在导航栏上显示切换按钮）。

### tip

另外可以在`themeConfig.nav`中配置子菜单组件，效果与选项开启相同

```ts
themeConfig: {
    nav: [
		// ...
        {
            text: `less-write`,
            items: [
				// ...
                {
                    component: "VPMenuRainbowAnimationSwitcher",
                    props: {
                        text: "Rainbow Animation",
                    },
                },
            ],
        },
    ],
```

