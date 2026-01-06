import { useParams } from 'react-router';
import { useState } from 'react';

export default function ArticleDetailPage() {
    const { id } = useParams();
    const [comment, setComment] = useState('');

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <article className="lg:col-span-8 flex flex-col gap-8">
                    <nav className="flex flex-wrap gap-2 text-sm">
                        <a
                            href="/"
                            className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"
                        >
                            首页
                        </a>
                        <span className="text-text-secondary-light dark:text-text-secondary-dark">/</span>
                        <a
                            href="#"
                            className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"
                        >
                            工程
                        </a>
                        <span className="text-text-secondary-light dark:text-text-secondary-dark">/</span>
                        <span className="text-text-primary-light dark:text-white font-medium">Web 开发</span>
                    </nav>

                    <div className="flex flex-col gap-6">
                        <h1 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-[-0.02em] text-text-primary-light dark:text-white">
                            理解 React 服务器组件：综合指南
                        </h1>

                        <p className="text-lg md:text-xl text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                            深入了解正在改变我们构建 React 应用程序的架构，提高性能和开发人员体验。
                        </p>

                        <div className="flex items-center justify-between border-y border-gray-200 dark:border-border-dark py-6">
                            <div className="flex items-center gap-4">
                                <div
                                    className="size-12 rounded-full bg-center bg-cover shadow-sm"
                                    style={{
                                        backgroundImage: 'url(https://api.dicebear.com/7.x/avataaars/svg?seed=Alex)',
                                    }}
                                ></div>
                                <div className="flex flex-col">
                                    <span className="text-text-primary-light dark:text-white font-bold text-base hover:text-primary cursor-pointer transition-colors">
                                        Alex Chen
                                    </span>
                                    <span className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
                                        2023年10月24日 · 8 分钟阅读
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex items-center justify-center size-10 rounded-full bg-gray-100 dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-primary hover:bg-primary/10 transition-all">
                                    <span className="material-symbols-outlined text-[20px]">bookmark</span>
                                </button>
                                <button className="flex items-center justify-center size-10 rounded-full bg-gray-100 dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-primary hover:bg-primary/10 transition-all">
                                    <span className="material-symbols-outlined text-[20px]">share</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="w-full aspect-[2/1] rounded-2xl overflow-hidden bg-gray-200 dark:bg-surface-dark">
                        <div
                            className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-700"
                            style={{
                                backgroundImage:
                                    'url(https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop)',
                            }}
                        ></div>
                    </div>

                    <div className="flex flex-col gap-6 text-lg leading-relaxed text-gray-700 dark:text-[#c4cfde]">
                        <p>
                            React 服务器组件（RSC）代表了我们思考构建 React
                            应用程序方式的范式转变。与传统的服务器端渲染（SSR）不同，后者专注于初始 HTML 生成，RSC
                            允许组件专门在服务器上运行，仅将必要的输出发送到客户端。
                        </p>

                        <h2 className="text-2xl font-bold text-text-primary-light dark:text-white mt-8 mb-2">
                            为什么需要服务器组件？
                        </h2>

                        <p>
                            RSC 的主要目标是减少发送到客户端的包大小。通过在服务器上渲染组件，我们可以将大型依赖项（如
                            markdown 解析器或日期格式化库）保留在后端，向用户的浏览器发送零 KB 的代码。
                        </p>

                        <blockquote className="border-l-4 border-primary bg-primary/5 p-6 rounded-r-lg my-6">
                            <p className="text-base italic font-medium text-text-primary-light dark:text-white m-0">
                                "零包大小的 React
                                服务器组件。这是一个实验性功能......允许您编写仅在服务器上运行的组件。"
                            </p>
                            <footer className="mt-3 text-sm font-bold text-primary">— React 团队</footer>
                        </blockquote>

                        <p>
                            这种方法还解决了数据获取中的"瀑布"问题。客户端组件不是获取数据，然后渲染一个获取更多数据的子组件，服务器组件可以直接访问数据库并更接近数据源进行异步/等待。
                        </p>

                        <h3 className="text-xl font-bold text-text-primary-light dark:text-white mt-6 mb-2">
                            实现示例
                        </h3>

                        <p>
                            下面是一个简单的示例，展示了服务器组件在不使用中间 API
                            层的情况下直接从数据库获取数据的样子。
                        </p>

                        <div className="rounded-xl overflow-hidden bg-[#0d1117] border border-border-dark my-6 shadow-lg">
                            <div className="flex justify-between items-center px-4 py-2 bg-[#161b22] border-b border-border-dark">
                                <span className="text-xs font-mono text-text-secondary-dark">NoteList.server.jsx</span>
                                <div className="flex gap-2">
                                    <span className="size-3 rounded-full bg-[#ff5f56]"></span>
                                    <span className="size-3 rounded-full bg-[#ffbd2e]"></span>
                                    <span className="size-3 rounded-full bg-[#27c93f]"></span>
                                </div>
                            </div>
                            <div className="p-6 overflow-x-auto code-scroll">
                                <pre className="font-mono text-sm leading-6 text-[#c9d1d9]">
                                    <code>{`import { db } from './db';

// 此组件*仅*在服务器上运行
export default async function NoteList({ searchText }) {
  // 直接访问数据库！
  const notes = await db.findAll({
    where: { title: { contains: searchText } }
  });

  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id} className="p-4 border-b">
          {note.title}
        </li>
      ))}
    </ul>
  );
}`}</code>
                                </pre>
                            </div>
                        </div>

                        <p>
                            注意没有{' '}
                            <code className="px-2 py-1 bg-gray-100 dark:bg-surface-dark rounded text-sm">
                                useEffect
                            </code>{' '}
                            或{' '}
                            <code className="px-2 py-1 bg-gray-100 dark:bg-surface-dark rounded text-sm">useState</code>{' '}
                            钩子。数据被简单地等待和渲染。这段代码永远不会发送到客户端。
                        </p>

                        <h2 className="text-2xl font-bold text-text-primary-light dark:text-white mt-8 mb-2">结论</h2>

                        <p>
                            虽然仍在成熟，但 RSC 准备成为我们在 Next.js
                            生态系统及其他地方构建复杂应用程序的默认方式。它需要转变思维模式，但性能优势是不可否认的。
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 py-6">
                        {['React', 'JavaScript', '性能', '架构'].map(tag => (
                            <a
                                key={tag}
                                href="#"
                                className="flex h-8 items-center justify-center rounded-lg bg-gray-200 dark:bg-surface-dark px-4 text-sm font-medium text-text-primary-light dark:text-white hover:bg-primary hover:text-white transition-colors"
                            >
                                {tag}
                            </a>
                        ))}
                    </div>

                    <div className="h-px w-full bg-gray-200 dark:bg-border-dark my-4"></div>

                    <section className="flex flex-col gap-8">
                        <h3 className="text-2xl font-bold text-text-primary-light dark:text-white">评论 (12)</h3>

                        <div className="flex gap-4">
                            <div
                                className="size-10 rounded-full bg-center bg-cover shrink-0"
                                style={{ backgroundImage: 'url(https://api.dicebear.com/7.x/avataaars/svg?seed=User)' }}
                            ></div>
                            <div className="flex flex-col flex-1 gap-3">
                                <textarea
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    className="w-full min-h-[100px] rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark p-4 text-text-primary-light dark:text-white placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-0 resize-y"
                                    placeholder="分享您的想法..."
                                ></textarea>
                                <div className="flex justify-end">
                                    <button className="bg-primary hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                                        发表评论
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 mt-4">
                            {[
                                {
                                    name: 'Sarah Jenkins',
                                    time: '2 小时前',
                                    text: '很好的解释！我一直在努力理解客户端和服务器组件之间的界限。代码片段让我明白了。',
                                    likes: 14,
                                },
                                {
                                    name: 'Marcus Dev',
                                    time: '5 小时前',
                                    text: '一个问题 - 这如何处理身份验证？我们是向下传递会话还是直接在组件中访问它？',
                                    likes: 5,
                                },
                            ].map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    <div
                                        className="size-10 rounded-full bg-center bg-cover shrink-0"
                                        style={{
                                            backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name})`,
                                        }}
                                    ></div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-text-primary-light dark:text-white">
                                                {item.name}
                                            </span>
                                            <span className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
                                                • {item.time}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 dark:text-[#c4cfde] leading-relaxed">{item.text}</p>
                                        <div className="flex items-center gap-4 mt-1">
                                            <button className="flex items-center gap-1 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary text-sm font-medium">
                                                <span className="material-symbols-outlined text-[18px]">thumb_up</span>{' '}
                                                {item.likes}
                                            </button>
                                            <button className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary text-sm font-medium">
                                                回复
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </article>

                <aside className="lg:col-span-4 flex flex-col gap-8">
                    <div className="sticky top-24 flex flex-col gap-6">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-border-dark shadow-sm">
                            <h4 className="text-lg font-bold text-text-primary-light dark:text-white mb-4">本页内容</h4>
                            <ul className="flex flex-col gap-3">
                                <li>
                                    <a
                                        href="#"
                                        className="block text-primary font-medium pl-3 border-l-2 border-primary"
                                    >
                                        介绍
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white transition-colors pl-3 border-l-2 border-transparent"
                                    >
                                        为什么需要服务器组件？
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white transition-colors pl-3 border-l-2 border-transparent"
                                    >
                                        实现示例
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white transition-colors pl-3 border-l-2 border-transparent"
                                    >
                                        结论
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-[#1e2329] to-[#10151a] rounded-2xl p-6 border border-border-dark relative overflow-hidden group">
                            <div className="absolute -right-10 -top-10 size-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500"></div>
                            <h4 className="text-lg font-bold text-white mb-2 relative z-10">每周精选</h4>
                            <p className="text-sm text-text-secondary-dark mb-4 relative z-10">
                                获取最新的前端工程文章，直接送到您的收件箱。
                            </p>
                            <div className="flex flex-col gap-3 relative z-10">
                                <input
                                    type="email"
                                    className="bg-background-dark/50 border border-border-dark rounded-lg px-4 py-2 text-sm text-white placeholder:text-text-secondary-dark focus:border-primary focus:ring-0"
                                    placeholder="your@email.com"
                                />
                                <button className="bg-primary hover:bg-blue-600 text-white font-bold py-2 rounded-lg text-sm transition-colors">
                                    订阅
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <h4 className="text-lg font-bold text-text-primary-light dark:text-white">相关文章</h4>
                            {[
                                { title: 'React 18 并发性解释', readTime: '5 分钟阅读' },
                                { title: '精通 Next.js 中间件', readTime: '12 分钟阅读' },
                                { title: 'CSS Grid vs Flexbox：何时使用？', readTime: '7 分钟阅读' },
                            ].map((item, index) => (
                                <a key={index} href="#" className="group flex gap-3 items-start">
                                    <div
                                        className="w-20 h-14 rounded-lg bg-cover bg-center shrink-0 group-hover:opacity-80 transition-opacity bg-gray-300 dark:bg-surface-dark"
                                        style={{
                                            backgroundImage: `url(https://images.unsplash.com/photo-${1633356122544 + index}?w=200&auto=format&fit=crop)`,
                                        }}
                                    ></div>
                                    <div className="flex flex-col">
                                        <h5 className="text-sm font-bold text-text-primary-light dark:text-white group-hover:text-primary transition-colors leading-snug">
                                            {item.title}
                                        </h5>
                                        <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                                            {item.readTime}
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
