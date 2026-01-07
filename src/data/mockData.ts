export interface Article {
    id: number;
    title: string;
    description: string;
    category?: string; // 保留旧的以兼容，但标记为可选
    categories?: string[]; // 新的分类数组
    displays?: string[]; // 显示类型（置顶、精选等）
    categoryColor?: string;
    date: string;
    readTime: string;
    author: {
        name: string;
        avatar: string;
        url?: string;
    };
    coverImage: string;
    tags: string[];
    content?: string;
}

export const mockArticles: Article[] = [
    {
        id: 1,
        title: '优化 React 渲染性能',
        description: '学习如何有效使用记忆化、虚拟化和新的 React 编译器来显著加速您的应用程序，而无需重写整个代码库。',
        category: '前端开发',
        categoryColor: 'text-primary',
        date: '2023年10月24日',
        readTime: '5 分钟阅读',
        author: {
            name: 'Sarah Chen',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        },
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop',
        tags: ['React', 'JavaScript', '性能', '前端'],
    },
    {
        id: 2,
        title: '使用 Go 设计可扩展的微服务',
        description: '全面指南：使用 Golang 和 gRPC 将单体应用拆分为可管理的高性能微服务。',
        category: '系统设计',
        categoryColor: 'text-purple-500',
        date: '2023年10月22日',
        readTime: '8 分钟阅读',
        author: {
            name: 'Alex Rivera',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        },
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop',
        tags: ['Go', '微服务', '系统设计', '后端'],
    },
    {
        id: 3,
        title: '将 LLM 集成到您的 Web 技术栈',
        description: '探索将 GPT-4 等大语言模型集成到现有 Web 基础设施的实用模式，以增强用户体验。',
        category: 'AI/ML',
        categoryColor: 'text-green-500',
        date: '2023年10月18日',
        readTime: '10 分钟阅读',
        author: {
            name: 'David Kim',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        },
        coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
        tags: ['AI', 'LLM', 'Web开发', 'GPT'],
    },
    {
        id: 4,
        title: 'Kubernetes：从零到精通指南',
        description: '从基本的 Pods 到复杂的部署，了解 Kubernetes 编排的核心概念以及如何管理生产集群。',
        category: 'DevOps',
        categoryColor: 'text-orange-500',
        date: '2023年10月15日',
        readTime: '12 分钟阅读',
        author: {
            name: 'Emily Zhang',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        },
        coverImage: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop',
        tags: ['Kubernetes', 'DevOps', '容器', '云原生'],
    },
];

export const featuredArticle: Article = {
    id: 0,
    title: '掌握现代 Web 架构',
    description: '深入探讨可扩展系统、微服务和现代 Web 生态系统的性能优化技术。',
    category: '精选',
    categoryColor: 'text-primary',
    date: '2023年10月25日',
    readTime: '5 分钟阅读',
    author: {
        name: 'Tech Team',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech',
    },
    coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&auto=format&fit=crop',
    tags: ['架构', 'Web开发', '最佳实践'],
};
