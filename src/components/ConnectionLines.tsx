/**
 * ConnectionLines - 装饰性连接线组件
 * 
 * 特性:
 * - 在标签之间显示装饰性连接线
 * - 使用渐变和低透明度
 * - 纯装饰性，不影响交互
 * 
 * Requirements: 5.3
 */

// 预定义的装饰线路径
const decorativeLines = [
  // 左上区域的线条
  { x1: 5, y1: 15, x2: 25, y2: 35 },
  { x1: 10, y1: 25, x2: 35, y2: 20 },
  { x1: 15, y1: 10, x2: 20, y2: 45 },
  
  // 右上区域的线条
  { x1: 75, y1: 15, x2: 95, y2: 30 },
  { x1: 80, y1: 25, x2: 90, y2: 10 },
  { x1: 70, y1: 20, x2: 85, y2: 40 },
  
  // 左下区域的线条
  { x1: 10, y1: 70, x2: 30, y2: 85 },
  { x1: 5, y1: 80, x2: 25, y2: 65 },
  { x1: 20, y1: 75, x2: 15, y2: 90 },
  
  // 右下区域的线条
  { x1: 75, y1: 70, x2: 90, y2: 85 },
  { x1: 80, y1: 80, x2: 95, y2: 65 },
  { x1: 70, y1: 85, x2: 85, y2: 75 },
  
  // 对角线装饰
  { x1: 15, y1: 30, x2: 40, y2: 55 },
  { x1: 60, y1: 55, x2: 85, y2: 30 },
  { x1: 20, y1: 60, x2: 35, y2: 80 },
  { x1: 65, y1: 80, x2: 80, y2: 60 },
];

export default function ConnectionLines() {
  return (
    <svg
      className="
        absolute inset-0 w-full h-full
        pointer-events-none
        z-0
      "
      data-testid="connection-lines"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        {/* 渐变定义 - 浅色模式 */}
        <linearGradient id="line-gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0A5F2C" stopOpacity="0" />
          <stop offset="50%" stopColor="#0A5F2C" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0A5F2C" stopOpacity="0" />
        </linearGradient>
        
        {/* 渐变定义 - 深色模式 */}
        <linearGradient id="line-gradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00FF41" stopOpacity="0" />
          <stop offset="50%" stopColor="#00FF41" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#00FF41" stopOpacity="0" />
        </linearGradient>

        {/* 发光效果 */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 浅色模式线条 */}
      <g className="dark:hidden">
        {decorativeLines.map((line, index) => (
          <line
            key={`light-${index}`}
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke="url(#line-gradient-light)"
            strokeWidth="1"
            filter="url(#glow)"
          />
        ))}
      </g>

      {/* 深色模式线条 */}
      <g className="hidden dark:block">
        {decorativeLines.map((line, index) => (
          <line
            key={`dark-${index}`}
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke="url(#line-gradient-dark)"
            strokeWidth="1"
            filter="url(#glow)"
          />
        ))}
      </g>

      {/* 装饰性节点点 */}
      <g className="dark:hidden">
        {decorativeLines.slice(0, 8).map((line, index) => (
          <circle
            key={`node-light-${index}`}
            cx={`${line.x1}%`}
            cy={`${line.y1}%`}
            r="2"
            fill="#0A5F2C"
            opacity="0.2"
          />
        ))}
      </g>

      <g className="hidden dark:block">
        {decorativeLines.slice(0, 8).map((line, index) => (
          <circle
            key={`node-dark-${index}`}
            cx={`${line.x1}%`}
            cy={`${line.y1}%`}
            r="2"
            fill="#00FF41"
            opacity="0.15"
          />
        ))}
      </g>
    </svg>
  );
}
