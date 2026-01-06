import { Article } from './mockData';

const DATA_BASE_URL = '/data';

export interface ArticlesResponse {
    articles: Article[];
    total: number;
    lastUpdate: string;
}

export interface CategoriesResponse {
    categories: Array<{
        name: string;
        slug: string;
        count: number;
        color: string;
    }>;
}

export interface TagsResponse {
    tags: Array<{
        name: string;
        count: number;
    }>;
}

/**
 * 获取所有文章
 */
export async function fetchArticles(): Promise<ArticlesResponse> {
    try {
        const response = await fetch(`${DATA_BASE_URL}/articles.json`);
        if (!response.ok) {
            throw new Error('Failed to fetch articles');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching articles:', error);
        // 返回空数据而不是抛出错误，保证页面可以正常渲染
        return {
            articles: [],
            total: 0,
            lastUpdate: new Date().toISOString(),
        };
    }
}

/**
 * 获取分类统计
 */
export async function fetchCategories(): Promise<CategoriesResponse> {
    try {
        const response = await fetch(`${DATA_BASE_URL}/categories.json`);
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        return { categories: [] };
    }
}

/**
 * 获取标签统计
 */
export async function fetchTags(): Promise<TagsResponse> {
    try {
        const response = await fetch(`${DATA_BASE_URL}/tags.json`);
        if (!response.ok) {
            throw new Error('Failed to fetch tags');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching tags:', error);
        return { tags: [] };
    }
}

/**
 * 根据 ID 获取单篇文章
 */
export async function fetchArticleById(id: number): Promise<Article | null> {
    try {
        const { articles } = await fetchArticles();
        return articles.find(article => article.id === id) || null;
    } catch (error) {
        console.error('Error fetching article by id:', error);
        return null;
    }
}

/**
 * 根据分类筛选文章
 */
export async function fetchArticlesByCategory(category: string): Promise<Article[]> {
    try {
        const { articles } = await fetchArticles();
        if (category === '全部') return articles;
        return articles.filter(article => article.categories.includes(category));
    } catch (error) {
        console.error('Error fetching articles by category:', error);
        return [];
    }
}
