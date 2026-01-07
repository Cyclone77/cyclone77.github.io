const fs = require('fs');
const path = require('path');

/**
 * 辅助函数：解析标签
 */
function parseLabels(labels) {
    const labelNames = labels.map(l => l.name);
    console.log('解析标签列表:', labelNames.join(', '));
    const statusLabel = labelNames.find(l => l === '状态:已发布' || l === '已发布');
    return {
        status: statusLabel
            ? '已发布'
            : labelNames.find(l => l.startsWith('状态:'))?.replace('状态:', '') || '草稿',
        categories: labelNames.filter(l => l.startsWith('分类:')).map(l => l.replace('分类:', '')),
        displays: labelNames.filter(l => l.startsWith('展示:')).map(l => l.replace('展示:', '')),
        tags: labelNames.filter(l => !l.includes(':')),
    };
}

/**
 * 辅助函数：通用区块提取
 */
function extractSection(body, headerName) {
    if (!body) return '';
    const patterns = [
        headerName === '文章内容'
            ? new RegExp(`(?:^|[\\r\\n])#+\\s*${headerName}\\s*[\\r\\n]+([\\s\\S]*)`, 'i')
            : new RegExp(
                  `(?:^|[\\r\\n])#+\\s*${headerName}\\s*[\\r\\n]+([\\s\\S]*?)(?=(?:[\\r\\n](?:#+|---|_+) [A-Z])|$)`,
                  'i'
              ),
        new RegExp(
            `(?:^|[\\r\\n])${headerName}\\s*[\\r\\n]+(?:[-_=]{3,}[\\r\\n]+)?([\\s\\S]*?)(?=(?:[\\r\\n](?:#+|---|_+) [A-Z])|$)`,
            'i'
        ),
    ];

    for (const pattern of patterns) {
        const match = body.match(pattern);
        if (match && match[1].trim()) {
            return match[1].trim();
        }
    }
    return '';
}

/**
 * 辅助函数：提取封面图
 */
function extractCoverImage(body) {
    const section = extractSection(body, '封面图片');
    const source = section || body;

    const mdImage = source.match(/!\[[^\]]*]\((https?:\/\/[^\)]+)\)/);
    if (mdImage) return mdImage[1];

    const urlMatch = source.match(/https?:\/\/[^\s\)\"\'\]]+/);
    if (urlMatch) return urlMatch[0];

    return 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&auto=format&fit=crop';
}

/**
 * 辅助函数：提取摘要
 */
function extractDescription(body) {
    if (!body) return '';

    let source = extractSection(body, '摘要');

    if (!source) {
        const content = extractSection(body, '文章内容') || body;
        source =
            content
                .split(/[\r\n]+/)
                .find(p => p.trim() && !p.startsWith('#') && !p.startsWith('![')) || '';
    }

    const text = source
        .replace(/!\[.*?\]\((https?:\/\/[^\)]+)\)/g, '')
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .replace(/[#>*_`]/g, '')
        .replace(/\r/g, '')
        .trim();

    const sliced = text.substring(0, 200);
    return sliced + (text.length > 200 ? '...' : '');
}

/**
 * 辅助函数：提取正文内容
 */
function extractContent(body) {
    return extractSection(body, '文章内容') || body;
}

/**
 * 辅助函数：计算阅读时间
 */
function calculateReadTime(body) {
    if (!body) return '1 分钟';
    const words = body.length;
    const minutes = Math.ceil(words / 300);
    return `${minutes} 分钟阅读`;
}

/**
 * 辅助函数：解析单个 Issue 为文章对象
 */
async function parseIssue(github, context, issue) {
    const parsed = parseLabels(issue.labels);

    const comments = await github.rest.issues.listComments({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issue.number,
    });

    return {
        id: issue.id,
        number: issue.number,
        title: issue.title,
        description: extractDescription(issue.body),
        content: extractContent(issue.body),
        author: {
            name: issue.user.login,
            avatar: issue.user.avatar_url,
            url: issue.user.html_url,
        },
        status: parsed.status || '草稿',
        categories: parsed.categories,
        tags: parsed.tags,
        displays: parsed.displays,
        coverImage: extractCoverImage(issue.body),
        readTime: calculateReadTime(extractContent(issue.body)),
        date: new Date(issue.created_at).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
        createdAt: issue.created_at,
        updatedAt: issue.updated_at,
        commentsCount: comments.data.length,
        url: issue.html_url,
    };
}

/**
 * 主函数
 */
module.exports = async ({ github, context, core }) => {
    const dataDir = path.join(process.cwd(), 'public', 'data');
    const articlesFile = path.join(dataDir, 'articles.json');

    // 确保目录存在
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    // 判断是否为全量同步
    const isFullSync =
        context.payload.inputs?.full_sync === 'true' || !fs.existsSync(articlesFile);

    let articlesData = { articles: [], total: 0, lastUpdate: new Date().toISOString() };

    if (isFullSync) {
        console.log('执行全量同步...');

        const issues = await github.paginate(github.rest.issues.listForRepo, {
            owner: context.repo.owner,
            repo: context.repo.repo,
            state: 'open',
            labels: '状态:已发布',
            per_page: 100,
        });

        console.log(`找到 ${issues.length} 篇已发布文章`);

        for (const issue of issues) {
            const article = await parseIssue(github, context, issue);
            articlesData.articles.push(article);
        }
    } else {
        console.log('执行增量同步...');

        if (fs.existsSync(articlesFile)) {
            articlesData = JSON.parse(fs.readFileSync(articlesFile, 'utf8'));
        }

        const issueNumber = context.payload.issue?.number;
        if (issueNumber) {
            const issue = await github.rest.issues.get({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: issueNumber,
            });

            const parsed = parseLabels(issue.data.labels);
            const isPublished = parsed.status === '已发布';
            console.log(`Issue #${issueNumber} 状态: ${parsed.status}, 是否发布: ${isPublished}`);

            const existingIndex = articlesData.articles.findIndex(a => a.number === issueNumber);

            if (isPublished) {
                const article = await parseIssue(github, context, issue.data);

                if (existingIndex >= 0) {
                    articlesData.articles[existingIndex] = article;
                    console.log(`更新文章 #${issueNumber}: ${article.title}`);
                } else {
                    articlesData.articles.push(article);
                    console.log(`新增文章 #${issueNumber}: ${article.title}`);
                }
            } else {
                if (existingIndex >= 0) {
                    articlesData.articles.splice(existingIndex, 1);
                    console.log(`删除文章 #${issueNumber}`);
                }
            }
        }
    }

    // 按置顶和时间排序
    articlesData.articles.sort((a, b) => {
        const aPinned = a.displays.includes('置顶');
        const bPinned = b.displays.includes('置顶');
        if (aPinned !== bPinned) return bPinned ? 1 : -1;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    articlesData.total = articlesData.articles.length;
    articlesData.lastUpdate = new Date().toISOString();

    fs.writeFileSync(articlesFile, JSON.stringify(articlesData, null, 2));
    console.log(`✅ 已保存 ${articlesData.total} 篇文章到 articles.json`);
};
