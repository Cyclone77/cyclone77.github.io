# 什么是 TypeScript

TypeScript 是 JavaScript 的一个超集，主要提供了类型系统和对 ES6 的支持，它由 Microsoft 开发，代码开源于 GitHub 上。

其次引用官网的定义：

> TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. Any browser. Any host. Any OS. Open source.

翻译成中文即是：

> TypeScript 是 JavaScript 的类型的超集，它可以编译成纯 JavaScript。编译出来的 JavaScript 可以运行在任何浏览器上。TypeScript 编译工具可以运行在任何服务器和任何系统上。TypeScript 是开源的。

代码段：

```typescript
nodes.forEach(async node => {
    if (loctionOrg === node.key) {
        this.interfaceSchemeTree.activedNode = node;
        this.interfaceSchemeTree._locationedScroll();
    } else {
        const isExist =
            this.interfaceSchemeTree.find.parentList.findIndex(v => v.groupId === node.key) > -1;
        if (isExist) {
            node.isExpanded = true;
            // 有子节点并且未取出来
            if (!node.isLeaf && node.getChildren().length === 0) {
                const childNodes = await this.interfaceSchemeTree._asyncLoadNodeChildNode(node);
                node.addChildren(childNodes);
            }
            if (node.getChildren().length > 0) {
                this.interfaceSchemeTree._selectedLocationOrg(node.children, loctionOrg);
            }
        }
    }
});
```
