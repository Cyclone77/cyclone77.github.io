import { useState, useEffect } from 'react';

/**
 * StatusBar - 底部状态栏组件
 * 
 * 特性:
 * - 固定在底部
 * - 显示状态信息（STATUS: MONITORING）
 * - 显示版本号和版权信息
 * - Matrix 绿色边框和黑色背景
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */

export default function StatusBar() {
  const [latency, setLatency] = useState(12);
  const [uptime, setUptime] = useState('00:00:00');
  const [startTime] = useState(Date.now());

  // 模拟延迟变化
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(8 + Math.random() * 15));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 更新运行时间
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const hours = Math.floor(elapsed / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
      const seconds = (elapsed % 60).toString().padStart(2, '0');
      setUptime(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div
      className="
        fixed bottom-0 left-0 right-0
        h-7 sm:h-8
        flex items-center justify-between
        px-2 sm:px-4
        font-mono text-[10px] sm:text-xs
        bg-black dark:bg-[#0A0A0A]
        border-t sm:border-t-2 border-[#0A5F2C] dark:border-[#00FF41]
        text-[#0A5F2C] dark:text-[#00FF41]
        z-50
      "
      data-testid="status-bar"
    >
      {/* 左侧状态信息 */}
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#0A5F2C] dark:bg-[#00FF41] animate-pulse" />
          <span className="hidden xs:inline">STATUS:</span>
          <span>MONITORING</span>
        </span>
        <span className="hidden sm:inline opacity-70">
          LATENCY: {latency}MS
        </span>
        <span className="hidden md:inline opacity-70">
          UPTIME: {uptime}
        </span>
      </div>

      {/* 中间分隔符 */}
      <div className="hidden lg:flex items-center gap-2 opacity-50">
        <span>|</span>
        <span>NODES: ACTIVE</span>
        <span>|</span>
        <span>CONN: STABLE</span>
        <span>|</span>
      </div>

      {/* 右侧版本和版权 */}
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="hidden sm:inline opacity-70">
          v2.0.26
        </span>
        <span className="truncate">
          © 2026_CY77
        </span>
      </div>
    </div>
  );
}
