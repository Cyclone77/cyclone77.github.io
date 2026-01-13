/**
 * ResultsLogDecoration - 左侧日志装饰组件
 * 
 * 特性:
 * - 模拟系统日志
 * - 二进制数据流效果
 * - 小字体（10px）和低透明度（0.4）
 * - 仅在 lg 及以上屏幕显示
 * 
 * Requirements: 6.1, 6.2, 6.3
 */
export default function ResultsLogDecoration() {
  // 生成随机二进制数据
  const binaryLines = Array.from({ length: 8 }, () =>
    Array.from({ length: 9 }, () => Math.round(Math.random())).join('')
  );

  return (
    <div className="
      hidden lg:block w-32 p-4 
      text-[10px] opacity-40 
      select-none flex-shrink-0
      font-mono text-text-primary-light dark:text-primary
      whitespace-nowrap
    ">
      <div>系统报告_09</div>
      <div className="mt-4">0x00A: 正常</div>
      <div>0x00B: 正常</div>
      <div>0x00C: 加载中</div>
      <div className="h-full mt-4 flex flex-col gap-1 opacity-50">
        {binaryLines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}
