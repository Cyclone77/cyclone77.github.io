export default function Footer() {
    return (
        <footer className="mt-auto w-full bg-background-light dark:bg-background-dark">
            <div className="mx-auto max-w-7xl px-4 sm:px-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-6 px-4 sm:px-6 bg-surface-light dark:bg-surface-dark rounded-t-2xl shadow-md">
                    <div className="flex items-center gap-2">
                        <div className="size-6 text-primary">
                            <span className="material-symbols-outlined">terminal</span>
                        </div>
                        <span className="font-display text-lg font-bold text-text-primary-light dark:text-white">
                            TechInsights
                        </span>
                    </div>

                    <div className="flex gap-8 flex-wrap justify-center">
                        <a
                            href="#"
                            className="text-text-secondary-light dark:text-text-secondary-dark text-sm hover:text-primary dark:hover:text-primary transition-colors"
                        >
                            隐私政策
                        </a>
                        <a
                            href="#"
                            className="text-text-secondary-light dark:text-text-secondary-dark text-sm hover:text-primary dark:hover:text-primary transition-colors"
                        >
                            服务条款
                        </a>
                        <a
                            href="#"
                            className="text-text-secondary-light dark:text-text-secondary-dark text-sm hover:text-primary dark:hover:text-primary transition-colors"
                        >
                            联系我们
                        </a>
                        <a
                            href="#"
                            className="text-text-secondary-light dark:text-text-secondary-dark text-sm hover:text-primary dark:hover:text-primary transition-colors"
                        >
                            RSS 订阅
                        </a>
                    </div>

                    <p className="text-text-secondary-light dark:text-[#586471] text-sm">
                        © 2024 TechInsights. 保留所有权利。
                    </p>
                </div>
            </div>
        </footer>
    );
}
