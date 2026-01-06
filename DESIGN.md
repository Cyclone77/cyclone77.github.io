# Cyclone77 博客系统设计方案

## 📋 项目概述

基于 GitHub Issues 的静态博客系统，使用 React 19 + TypeScript 5 + Vite 6 构建，通过 GitHub Actions 实现自动化发布。

---

## 🏗️ 技术架构

### 前端技术栈

- **React 19** - UI 框架
- **TypeScript 5** - 类型安全
- **Vite 6** - 构建工具
- **Tailwind CSS 3** - 样式框架
- **React Router 7** - 路由管理

### 内容管理

- **GitHub Issues** - 内容编辑器
- **GitHub Actions** - 自动化构建
- **GitHub Pages** - 静态托管

---

## 🎯 核心设计理念

### 内容即数据

- Issues = 文章
- Labels = 分类和状态
- Comments = 评论系统
- Markdown = 内容格式

### 零维护成本

- 无需数据库
- 无需后端服务器
- 完全静态化
- GitHub 原生生态

---

## 🏷️ 标签系统设计

### 标签前缀规范

使用中文前缀区分标签类型，便于管理和解析：

#### 1. 状态标签（`状态:` 前缀）

- `状态:草稿` - 默认状态，博客不显示
- `状态:已发布` - 正式发布，博客可见
- `状态:已归档` - 归档页可见，首页不显示
- `状态:已作废` - 完全不显示

**规则：**

- 每篇文章只能有一个状态标签
- 添加新状态时，自动移除其他状态标签
- 新建 Issue 自动添加"草稿"状态

#### 2. 分类标签（`分类:` 前缀）

- `分类:前端开发` - 前端技术
- `分类:后端开发` - 后端技术
- `分类:DevOps` - 运维相关
- `分类:人工智能` - AI/ML
- `分类:系统设计` - 架构设计
- `分类:教程` - 教程文章
- `分类:经验分享` - 经验总结

**规则：**

- 可以有多个分类标签
- 至少选择一个主分类

#### 3. 功能标签（`功能:` 前缀）

- `功能:置顶` - 首页置顶显示
- `功能:精选` - Hero 区域展示
- `功能:热门` - 热门推荐

**规则：**

- 可选功能标签
- 可以组合使用

#### 4. 普通标签（无前缀）

- 技术标签：`React`、`Vue`、`TypeScript`、`Docker` 等
- 主题标签：`性能优化`、`最佳实践`、`代码规范` 等

**规则：**

- 自由添加
- 用于内容分组和搜索

### 标签颜色规范

| 前缀类型 | 颜色代码  | 用途   |
| -------- | --------- | ------ |
| 状态:    | `#0969DA` | 蓝色系 |
| 分类:    | `#1A7F37` | 绿色系 |
| 功能:    | `#8250DF` | 紫色系 |
| 无前缀   | `#656D76` | 灰色系 |

---

## 🔄 工作流设计

### Workflow 1: 自动添加草稿标签

**触发时机：** Issue 创建时

**流程：**

```
1. 检测新 Issue 是否有状态标签
2. 如果没有 → 自动添加"状态:草稿"
3. 如果有 → 跳过
```

**文件：** `.github/workflows/auto-label.yml`

---

### Workflow 2: 增量构建和部署

**触发时机：**

- Issues 标签变更
- Issues 内容编辑
- Issues 评论变更
- 手动触发（全量构建）

**增量构建流程：**

```
1. 获取触发事件的 Issue 信息
   - Issue 编号
   - 变更类型（编辑/标签）
   - 当前状态

2. 读取现有的 articles.json（如果存在）

3. 判断操作类型：
   a) 如果是「状态:已发布」→ 更新/新增文章
      - 解析该 Issue 的完整信息
      - 更新或添加到文章列表

   b) 如果移除了「状态:已发布」→ 删除文章
      - 从文章列表中移除该条目

   c) 如果是「状态:已发布」文章的编辑 → 更新文章
      - 只更新该篇文章的数据
      - 保留其他文章不变

4. 增量解析文章数据：
   - 标题、内容（Markdown）
   - 作者信息
   - 创建/更新时间
   - 所有标签
   - 评论数量（通过 GitHub API 获取）

5. 提取元数据：
   - 封面图（第一张图片）
   - 摘要（前 200 字）
   - 阅读时间（字数 ÷ 300）

6. 分类处理：
   - 提取分类标签
   - 提取功能标签
   - 提取普通标签

7. 更新数据文件：
   - 合并更新 articles.json
   - 重新统计 categories.json
   - 重新统计 tags.json

8. 构建前端项目（npm run build）

9. 部署到 GitHub Pages
```

**全量构建流程：**

```
仅在以下情况触发全量构建：
- 手动触发 workflow_dispatch
- 数据文件损坏或丢失
- 每周定时任务（同步所有数据）

全量构建流程：
1. 获取所有「状态:已发布」的 Issues
2. 批量解析所有文章
3. 重新生成所有数据文件
4. 构建并部署
```

**缓存策略：**

```
- 使用 GitHub Actions Cache 缓存 articles.json
- 缓存 key: articles-${{ hashFiles('data/articles.json') }}
- 缓存有效期: 7 天
- 减少重复的 API 请求
```

**文件：** `.github/workflows/build-blog.yml`

---

### Workflow 3: 状态标签互斥

**触发时机：** 添加状态标签时

**流程：**

```
1. 检测添加的标签是否为"状态:*"
2. 如果是 → 移除其他所有"状态:*"标签
3. 只保留最新添加的状态标签
```

**文件：** `.github/workflows/auto-label.yml`（与 Workflow 1 合并）

---

## 📊 数据结构设计

### articles.json

```json
{
    "articles": [
        {
            "id": 1,
            "number": 1,
            "title": "文章标题",
            "description": "文章摘要（前200字）",
            "content": "完整的 Markdown 内容",
            "author": {
                "name": "作者名",
                "avatar": "https://avatars.githubusercontent.com/...",
                "url": "https://github.com/username"
            },
            "status": "已发布",
            "categories": ["前端开发", "教程"],
            "tags": ["React", "TypeScript", "性能优化"],
            "features": ["置顶", "精选"],
            "coverImage": "https://...",
            "readTime": "5 分钟",
            "createdAt": "2024-01-05T10:00:00Z",
            "updatedAt": "2024-01-05T15:00:00Z",
            "commentsCount": 12,
            "url": "https://github.com/user/repo/issues/1"
        }
    ],
    "total": 100,
    "lastUpdate": "2024-01-05T16:00:00Z"
}
```

### categories.json

```json
{
    "categories": [
        {
            "name": "前端开发",
            "slug": "frontend",
            "count": 25,
            "color": "text-primary"
        },
        {
            "name": "后端开发",
            "slug": "backend",
            "count": 18,
            "color": "text-purple-500"
        }
    ]
}
```

### tags.json

```json
{
    "tags": [
        {
            "name": "React",
            "count": 15
        },
        {
            "name": "TypeScript",
            "count": 12
        }
    ]
}
```

---

## 🎨 UI 设计特色

### Header 设计

- 倒置选项卡形状（底部圆角）
- 使用 `rounded-b-2xl` 实现
- 阴影效果增加立体感
- 内容限制在 `max-w-7xl` 宽度

### Footer 设计

- 正向选项卡形状（顶部圆角）
- 使用 `rounded-t-2xl` 实现
- 高度紧凑（py-6）
- 与 Header 形成对称

### 主题切换

- 深色/浅色模式
- 使用 Context API 管理
- LocalStorage 持久化
- 平滑过渡动画

### 响应式设计

- 移动端优先
- Tailwind 断点系统
- 流式布局

---

## 📝 文章发布流程

### 作者操作流程

1. **创建文章**
    - 新建 GitHub Issue
    - 编写标题和内容（Markdown）
    - 系统自动添加"状态:草稿"

2. **编辑分类和标签**
    - 添加分类：`分类:前端开发`
    - 添加标签：`React`、`TypeScript`
    - 可选功能：`功能:置顶`

3. **发布文章**
    - 添加标签：`状态:已发布`
    - 系统自动移除"状态:草稿"
    - 触发 GitHub Actions 构建

4. **后续管理**
    - 归档：添加"状态:已归档"
    - 作废：添加"状态:已作废"
    - 修改：编辑 Issue 内容后自动重新构建

---

## 🔍 前端展示逻辑

### 文章筛选规则

```typescript
// 显示规则
状态:草稿       → 不显示
状态:已发布     → 正常显示
状态:已归档     → 归档页显示，首页不显示
状态:已作废     → 完全不显示

// 功能标签
功能:置顶       → 始终排在列表最前
功能:精选       → Hero 区域轮播展示
功能:热门       → 侧边栏热门推荐
```

### 分类和标签解析

```typescript
// 从 Issue labels 中解析
const parseLabels = (labels: string[]) => {
    return {
        status: labels.find(l => l.startsWith('状态:'))?.replace('状态:', ''),
        categories: labels.filter(l => l.startsWith('分类:')).map(l => l.replace('分类:', '')),
        features: labels.filter(l => l.startsWith('功能:')).map(l => l.replace('功能:', '')),
        tags: labels.filter(l => !l.includes(':')),
    };
};
```

---

## 🚀 部署方案

### GitHub Pages 配置

1. **仓库设置**
    - 开启 GitHub Pages
    - 源分支：`gh-pages`
    - 构建来源：GitHub Actions

2. **自动部署**
    - Actions 构建后自动推送到 `gh-pages` 分支
    - GitHub Pages 自动更新网站

3. **自定义域名**（可选）
    - 配置 CNAME 文件
    - DNS 解析到 GitHub Pages

---

## 💡 扩展功能规划

### 即将实现

- [ ] 搜索功能（基于 lunr.js）
- [ ] RSS 订阅支持
- [ ] 文章阅读统计
- [ ] 评论系统集成

### 未来计划

- [ ] 图片自动优化
- [ ] CDN 加速
- [ ] PWA 支持
- [ ] 多语言支持

---

## 📌 注意事项

### GitHub API 限制

- 未认证：60 次/小时
- 认证后：5000 次/小时
- 建议：使用 GitHub Token 并启用缓存

### 构建优化

- 增量构建（只更新变更的文章）
- 数据缓存（避免重复请求）
- 并行处理（提高构建速度）

### SEO 优化

- 静态 HTML 生成
- Meta 标签完善
- Sitemap 自动生成
- 结构化数据标记

---

## 🎯 核心优势

✅ **零成本** - 完全基于 GitHub 免费服务
✅ **零维护** - 无需数据库和后端
✅ **高性能** - 完全静态化，CDN 加速
✅ **易用性** - GitHub Issues 熟悉的编辑体验
✅ **协作性** - 原生支持多人协作
✅ **版本控制** - 自动记录所有修改历史
✅ **SEO 友好** - 静态 HTML + 语义化标签
✅ **可扩展** - 基于开放的 GitHub API

---

## 📚 相关文档

- [React 文档](https://react.dev/)
- [Vite 文档](https://vitejs.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [GitHub Actions 文档](https://docs.github.com/actions)
- [GitHub REST API](https://docs.github.com/rest)

---

**最后更新：** 2024-01-05
**设计版本：** v1.0
