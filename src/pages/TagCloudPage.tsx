import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { fetchTags } from '../services/api';
import { Tag, TagPosition, generateTagPositions } from '../utils/tagCloud';
import TagBubble from '../components/TagBubble';
import SearchInterface from '../components/SearchInterface';
import LogSidebar from '../components/LogSidebar';
import ConnectionLines from '../components/ConnectionLines';
import StatusBar from '../components/StatusBar';

/**
 * TagCloudPage - Brutalist 风格的标签云页面
 * 
 * 特性:
 * - 全屏布局（100vh）
 * - Matrix 绿色网格背景
 * - 标签气泡散布展示
 * - 终端风格搜索框
 * - 搜索筛选（高亮匹配、降低不匹配透明度）
 * - 深色/浅色主题支持
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 3.3, 3.4
 */
export default function TagCloudPage() {
  const navigate = useNavigate();
  
  // 状态管理
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagPositions, setTagPositions] = useState<TagPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 加载标签数据
  useEffect(() => {
    async function loadTags() {
      try {
        setLoading(true);
        const response = await fetchTags();
        setTags(response.tags);
        setTagPositions(generateTagPositions(response.tags));
        setError(null);
      } catch (err) {
        setError('无法加载标签数据');
        console.error('加载标签失败:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadTags();
  }, []);

  // 判断标签是否匹配搜索关键词（不区分大小写）
  const isTagHighlighted = useCallback((tagName: string): boolean => {
    if (!searchQuery.trim()) return true; // 无搜索词时全部高亮
    return tagName.toLowerCase().includes(searchQuery.toLowerCase());
  }, [searchQuery]);

  // 标签点击处理 - 导航到首页并传递 tag 参数
  const handleTagClick = useCallback((tagName: string) => {
    navigate(`/?tag=${encodeURIComponent(tagName)}`);
  }, [navigate]);

  // ESC 键清除搜索
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchQuery('');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 加载状态
  if (loading) {
    return (
      <div className="
        min-h-screen flex items-center justify-center
        bg-[#F0F0F0] dark:bg-[#0A0A0A]
        font-mono text-[#0A5F2C] dark:text-[#00FF41]
      ">
        <div className="text-center">
          <div className="animate-pulse text-2xl mb-2">[LOADING...]</div>
          <div className="text-sm opacity-60">正在加载标签数据</div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="
        min-h-screen flex items-center justify-center
        bg-[#F0F0F0] dark:bg-[#0A0A0A]
        font-mono text-red-500
      ">
        <div className="text-center">
          <div className="text-2xl mb-2">[ERROR]</div>
          <div className="text-sm">{error}</div>
        </div>
      </div>
    );
  }

  // 空标签状态
  if (tags.length === 0) {
    return (
      <div className="
        min-h-screen flex items-center justify-center
        bg-[#F0F0F0] dark:bg-[#0A0A0A]
        font-mono text-[#0A5F2C] dark:text-[#00FF41]
      ">
        <div className="text-center">
          <div className="text-2xl mb-2">[EMPTY]</div>
          <div className="text-sm opacity-60">暂无标签</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        relative w-full min-h-screen overflow-hidden
        bg-[#F0F0F0] dark:bg-[#0A0A0A]
        pb-8
      "
      data-testid="tag-cloud-page"
    >
      {/* 网格背景 - 50px 间距的 Matrix 绿色网格线 */}
      <div
        className="
          absolute inset-0 pointer-events-none
          opacity-20 dark:opacity-30
        "
        style={{
          backgroundImage: `
            linear-gradient(to right, #0A5F2C 1px, transparent 1px),
            linear-gradient(to bottom, #0A5F2C 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
        aria-hidden="true"
      />
      
      {/* 深色模式网格 */}
      <div
        className="
          absolute inset-0 pointer-events-none
          hidden dark:block opacity-30
        "
        style={{
          backgroundImage: `
            linear-gradient(to right, #00FF41 1px, transparent 1px),
            linear-gradient(to bottom, #00FF41 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
        aria-hidden="true"
      />

      {/* 装饰性连接线 */}
      <ConnectionLines />

      {/* 左侧日志侧边栏 */}
      <LogSidebar side="left" />

      {/* 右侧日志侧边栏 */}
      <LogSidebar side="right" />

      {/* 标签容器 - 移动端调整高度，为状态栏留出空间 */}
      <div
        className="relative w-full h-[calc(100vh-1.75rem)] sm:h-[calc(100vh-2rem)] md:h-screen"
        data-testid="swarm-container"
      >
        {/* 标签气泡 */}
        {tags.map((tag, index) => (
          <TagBubble
            key={tag.name}
            tag={tag}
            position={tagPositions[index]}
            isHighlighted={isTagHighlighted(tag.name)}
            onClick={handleTagClick}
          />
        ))}

        {/* 中央搜索框 */}
        <SearchInterface
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {/* 底部状态栏 */}
      <StatusBar />
    </div>
  );
}
