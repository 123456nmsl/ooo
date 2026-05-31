# 《归土 Project》网页工程交接说明

## 工程位置

当前工程目录：

`D:\Desktop\tod\yemian`

主入口：

`index.html`

核心文件：

- `index.html`：页面结构
- `styles.css`：全站样式与动效
- `app.js`：交互逻辑
- `assets/`：图片、海报、分镜、人物、计划卡片、片段视频、完整影片

## 当前页面结构

1. 首页：归土 Project 首页与进站海报弹层
2. 世界观：计划卡片与背景图
3. 档案：人物卡片、AI 日志、小物件卡片
4. 剧本：四个章节按钮，右侧视频切换播放
5. 分镜：42 张分镜环形画廊，点击可打开大图灯箱
6. 剧本阅读：左侧标题，右侧滚动阅读完整剧本
7. 放映：完整影片播放界面，播放 `assets/full-film.mp4`

## 放映页说明

- 完整影片文件：`assets/full-film.mp4`
- 未播放封面：`assets/full-film-cover.png`
- 放映页锚点：`#screening`
- 顶部导航中的“放映”由 `app.js` 的 `initSiteNavLabels()` 生成。
- 播放器交互由 `app.js` 的 `initFullFilmPlayer()` 控制。
- 右下角组员署名已加入：沈广辉、王钰喆、赵心怡。

## 最近状态

- 第五页分镜已经改为读取 `assets/storyboard-01` 到 `assets/storyboard-42`。
- 分镜卡片左下角只显示编号，避免标签重复。
- 第六页加入了 Galaxy 风格 canvas 背景，逻辑在 `initSymbolGalaxy()`。
- Galaxy 旋臂速度已降低，避免转动过快。
- 第七页为完整影片放映页，使用完整影片和电影封面。
- `app.js` 已通过 `node --check app.js` 语法检查。

## 后续注意

- 当前工程包含完整影片，压缩包体积会明显变大。
- 修改中文内容时请确保文件以 UTF-8 保存。
- 如继续调整放映页，只建议限定在 `#screening` section 内，不影响前面页面。

