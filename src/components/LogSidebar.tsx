import { useEffect, useState } from 'react';

/**
 * LogSidebar - 装饰性日志侧边栏组件
 * 
 * 特性:
 * - 左侧显示系统日志流
 * - 右侧显示活动日志流
 * - 小字体（10px）和低透明度（0.6）
 * - 响应式隐藏（< 768px）
 * 
 * Requirements: 5.1, 5.2, 5.4, 5.5
 */

interface LogSidebarProps {
  side: 'left' | 'right';
}

// 系统日志模板（左侧）
const systemLogTemplates = [
  '[SYS] INIT_COMPLETE',
  '[SYS] CACHE_HIT: tags.json',
  '[SYS] RENDER_CYCLE: 16ms',
  '[SYS] MEM_USAGE: 42MB',
  '[SYS] GC_SWEEP: 0.3ms',
  '[SYS] THREAD_POOL: 4/8',
  '[SYS] NET_LATENCY: 12ms',
  '[SYS] DB_CONN: ACTIVE',
  '[SYS] HEARTBEAT: OK',
  '[SYS] BUFFER_FLUSH',
  '[SYS] INDEX_REBUILD',
  '[SYS] QUERY_CACHE: 98%',
  '[SYS] CPU_LOAD: 23%',
  '[SYS] IO_WAIT: 2ms',
  '[SYS] SOCKET_POOL: 12',
];

// 活动日志模板（右侧）
const activityLogTemplates = [
  '[ACTIVITY] NODE_HIT: react',
  '[ACTIVITY] QUERY: "typescript"',
  '[ACTIVITY] TAG_HOVER: #design',
  '[ACTIVITY] SCROLL_POS: 42%',
  '[ACTIVITY] CLICK: tag_bubble',
  '[ACTIVITY] SEARCH_INIT',
  '[ACTIVITY] FILTER_APPLY',
  '[ACTIVITY] NAV_TRIGGER',
  '[ACTIVITY] ZOOM_LEVEL: 1.0',
  '[ACTIVITY] FOCUS_SHIFT',
  '[ACTIVITY] RENDER_TAG: 24',
  '[ACTIVITY] ANIM_FRAME: 60',
  '[ACTIVITY] USER_IDLE: 3s',
  '[ACTIVITY] CACHE_READ',
  '[ACTIVITY] STATE_UPDATE',
];

export default function LogSidebar({ side }: LogSidebarProps) {
  const [logs, setLogs] = useState<string[]>([]);
  
  const templates = side === 'left' ? systemLogTemplates : activityLogTemplates;

  // 初始化日志
  useEffect(() => {
    // 生成初始日志
    const initialLogs = Array.from({ length: 20 }, () => 
      templates[Math.floor(Math.random() * templates.length)]
    );
    setLogs(initialLogs);
  }, [templates]);

  // 定时添加新日志
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLog = templates[Math.floor(Math.random() * templates.length)];
        const updated = [...prev, newLog];
        // 保持最多 30 条日志
        if (updated.length > 30) {
          return updated.slice(-30);
        }
        return updated;
      });
    }, 2000 + Math.random() * 2000); // 2-4秒随机间隔

    return () => clearInterval(interval);
  }, [templates]);

  return (
    <div
      className={`
        hidden md:flex flex-col
        fixed top-0 ${side === 'left' ? 'left-0' : 'right-0'}
        w-48 h-screen
        overflow-hidden
        pointer-events-none
        z-10
      `}
      data-testid={`log-sidebar-${side}`}
      aria-hidden="true"
    >
      {/* 渐变遮罩 - 顶部 */}
      <div 
        className={`
          absolute top-0 left-0 right-0 h-16 z-10
          bg-gradient-to-b 
          from-[#F0F0F0] dark:from-[#0A0A0A]
          to-transparent
        `}
      />
      
      {/* 日志内容 */}
      <div 
        className="
          flex-1 overflow-hidden
          px-2 py-16
          font-mono
          text-[10px] leading-relaxed
          text-[#0A5F2C] dark:text-[#00FF41]
          opacity-60
        "
      >
        {logs.map((log, index) => (
          <div
            key={`${log}-${index}`}
            className="
              whitespace-nowrap
              animate-fade-in
              mb-1
            "
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            {log}
          </div>
        ))}
      </div>

      {/* 渐变遮罩 - 底部 */}
      <div 
        className={`
          absolute bottom-0 left-0 right-0 h-16 z-10
          bg-gradient-to-t 
          from-[#F0F0F0] dark:from-[#0A0A0A]
          to-transparent
        `}
      />
    </div>
  );
}
