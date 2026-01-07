const fs = require('fs');
const path = require('path');

/**
 * 辅助函数：解析标签
 */
function parseLabels(labels) {
    const labelNames = labels.map(l => l.name);
    return {
        status: labelNames.find(l => l.startsWith('状态:'))?.replace('状态:', ''),
        categories: labelNames.filter(l => l.startsWith('分类:')).map(l => l.replace('分类:', '')),
        displays: labelNames.filter(l => l.startsWith('展示:')).map(l => l.replace('展示:', '')),
        tags: labelNames.filter(l => !l.includes(':')),
    };
}

/**
 * 主函数
 */
module.exports = async ({ github, context, core }) => {
    const dataDir = path.join(process.cwd(), 'public', 'data');

    // 确保目录存在
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    // 直接从仓库获取所有标签定义
    console.log('正在获取仓库所有标签定义...');

    const allLabels = await github.paginate(github.rest.issues.listLabelsForRepo, {
        owner: context.repo.owner,
        repo: context.repo.repo,
        per_page: 100,
    });

    console.log(`找到 ${allLabels.length} 个标签定义`);

    // 获取所有已发布的文章（用于统计使用次数）
    const issues = await github.paginate(github.rest.issues.listForRepo, {
        owner: context.repo.owner,
        repo: context.repo.repo,
        state: 'open',
        labels: '状态:已发布',
        per_page: 100,
    });

    console.log(`找到 ${issues.length} 篇已发布文章`);

    // 生成标签统计（包含分类标签和展示标签，用于标签云显示）
    const tagsMap = {};

    // 从所有标签中提取分类标签和展示标签
    allLabels.forEach(label => {
        if (label.name.startsWith('分类:')) {
            const tagName = label.name.replace('分类:', '');
            tagsMap[tagName] = {
                count: 0,
                color: `#${label.color}`,
                description: label.description || '',
                type: 'category',
            };
        } else if (label.name.startsWith('展示:')) {
            const tagName = label.name.replace('展示:', '');
            tagsMap[tagName] = {
                count: 0,
                color: `#${label.color}`,
                description: label.description || '',
                type: 'display',
            };
        }
    });

    // 统计每个标签的使用次数
    issues.forEach(issue => {
        const parsed = parseLabels(issue.labels);
        // 统计分类标签
        parsed.categories.forEach(cat => {
            if (tagsMap[cat]) {
                tagsMap[cat].count++;
            }
        });
        // 统计展示标签
        parsed.displays.forEach(disp => {
            if (tagsMap[disp]) {
                tagsMap[disp].count++;
            }
        });
    });

    const tagsData = {
        tags: Object.entries(tagsMap)
            .map(([name, data]) => ({
                name,
                count: data.count,
                color: data.color,
                description: data.description,
                type: data.type,
            }))
            .sort((a, b) => b.count - a.count),
    };

    fs.writeFileSync(path.join(dataDir, 'tags.json'), JSON.stringify(tagsData, null, 2));
    console.log(`✅ 已生成标签统计: ${tagsData.tags.length} 个标签`);
};
