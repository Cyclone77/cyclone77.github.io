import { HashRouter, Routes, Route } from 'react-router';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import TagCloudPage from './pages/TagCloudPage';
import TagResultsPage from './pages/TagResultsPage';

function App() {
    return (
        <ThemeProvider>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="article/:id" element={<ArticleDetailPage />} />
                        <Route path="tags" element={<TagCloudPage />} />
                    </Route>
                    {/* 标签结果页面使用独立布局 */}
                    <Route path="/tags/:tagName" element={<TagResultsPage />} />
                </Routes>
            </HashRouter>
        </ThemeProvider>
    );
}

export default App;
