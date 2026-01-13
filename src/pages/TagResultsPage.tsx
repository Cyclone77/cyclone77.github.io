import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Article } from '../data/mockData';
import { fetchArticles } from '../services/api';
import { sortArticles, SortMode } from '../utils/articleSort';
import { filterArticlesByTags, extractTagsFromArticles } from '../utils/articleFilter';
import ResultsNavHeader from '../components/ResultsNavHeader';
import SortingMatrix from '../components/SortingMatrix';
import DataPacket from '../components/DataPacket';
import FilterSidebar from '../components/FilterSidebar';
import ResultsLogDecoration from '../components/ResultsLogDecoration';
import ResultsStatusBar from '../components/ResultsStatusBar';

/**
 * TagResultsPage - 标签结果页面
 * 
 * 特性:
 * - 全屏布局（100vh）
 * - 网格背景（40px 间距）
 * - 文章列表（垂直滚动）
 * - 排序和筛选功能
 * - 响应式设计
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 8.3
 */
export default function TagResultsPage() {
  const { tagName } = useParams<{ tagName: string }>();
  const navigate = useNavigate();
  
  // 状态管理
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>('chrono');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化激活标签
  useEffect(() => {
    if (tagName) {
      setActiveTags([decodeURIComponent(tagName)]);
    }
  }, [tagName]);

  // 加载文章数据
  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true);
        const response = await fetchArticles();
        setArticles(response.articles);
        setError(null);
      } catch (err) {
        setError('无法加载文章数据');
        console.error('加载文章失败:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadArticles();
  }, []);

  // 筛选和排序后的文章
  const filteredArticles = useMemo(() => {
    const filtered = filterArticlesByTags(articles, activeTags);
    return sortArticles(filtered, sortMode);
  }, [articles, activeTags, sortMode]);

  // 推荐标签（从筛选后的文章中提取，排除已激活的标签）
  const suggestedTags = useMemo(() => {
    return extractTagsFromArticles(filteredArticles, activeTags);
  }, [filteredArticles, activeTags]);

  // 移除筛选标签
  const handleRemoveTag = useCallback((tag: string) => {
    const newTags = activeTags.filter(t => t.toLowerCase() !== tag.toLowerCase());
    if (newTags.length === 0) {
      // 如果没有标签了，返回标签云页面
      navigate('/tags');
    } else {
      setActiveTags(newTags);
      // 更新 URL 为第一个标签
      navigate(`/tags/${encodeURIComponent(newTags[0])}`, { replace: true });
    }
  }, [activeTags, navigate]);

  // 添加筛选标签
  const handleAddTag = useCallback((tag: string) => {
    if (!activeTags.some(t => t.toLowerCase() === tag.toLowerCase())) {
      setActiveTags([...activeTags, tag]);
    }
  }, [activeTags]);

  // 文章点击处理 - 导航到文章详情页
  const handleArticleClick = useCallback((articleId: number) => {
    navigate(`/article/${articleId}`);
  }, [navigate]);

  // 加载状态
  if (loading) {
    return (
      <div className="
        h-screen flex items-center justify-center
        bg-background-light dark:bg-background-dark 
        font-mono text-text-primary-light dark:text-zinc-300
      ">
        <div className="text-center">
          <div className="animate-pulse text-2xl mb-2">[加载中...]</div>
          <div className="text-sm opacity-60">正在加载数据</div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="
        h-screen flex items-center justify-center
        bg-background-light dark:bg-background-dark 
        font-mono text-red-500
      ">
        <div className="text-center">
          <div className="text-2xl mb-2">[错误]</div>
          <div className="text-sm">{error}</div>
        </div>
      </div>
    );
  }

  const primaryTag = activeTags[0] || tagName || '';

  return (
    <div
      className="
        h-screen flex flex-col
        bg-background-light dark:bg-background-dark
        grid-pattern
      "
    >
      {/* 导航头部 */}
      <ResultsNavHeader
        primaryTag={primaryTag}
        articleCount={filteredArticles.length}
      />

      {/* 主内容区 */}
      <main className="flex-1 flex overflow-hidden">
        {/* 左侧日志装饰 */}
        <ResultsLogDecoration />

        {/* 中央内容区 */}
        <div className="flex-1 flex flex-col px-20 py-6 overflow-hidden">
          {/* 排序控制面板 */}
          <SortingMatrix
            currentSort={sortMode}
            onSortChange={setSortMode}
          />

          {/* 文章列表 */}
          <div className="
            flex-1 overflow-y-auto pr-4 
            flex flex-col gap-6
            scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-500
          "
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#71717a #18181b',
          }}
          >
            {filteredArticles.length === 0 ? (
              <div className="
                flex-1 flex items-center justify-center
                font-mono text-text-primary-light dark:text-zinc-300
              ">
                <div className="text-center">
                  <div className="text-2xl mb-2">[未找到文章]</div>
                  <div className="text-sm opacity-60">
                    筛选条件: {activeTags.map(t => `#${t}`).join(', ')}
                  </div>
                </div>
              </div>
            ) : (
              filteredArticles.map(article => (
                <DataPacket
                  key={article.id}
                  article={article}
                  onClick={handleArticleClick}
                />
              ))
            )}
          </div>
        </div>

        {/* 右侧筛选侧边栏 */}
        <FilterSidebar
          activeTags={activeTags}
          suggestedTags={suggestedTags}
          onRemoveTag={handleRemoveTag}
          onAddTag={handleAddTag}
        />
      </main>

      {/* 底部状态栏 */}
      <ResultsStatusBar articleCount={filteredArticles.length} />
    </div>
  );
}
