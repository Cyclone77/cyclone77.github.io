import { Outlet, useLocation } from 'react-router';
import BrutalistHeader from './BrutalistHeader';
import Footer from './Footer';
import BackToTop from './BackToTop';
import NoiseOverlay from './NoiseOverlay';

export default function Layout() {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isArticlePage = location.pathname.startsWith('/article/');
    const isTagCloudPage = location.pathname === '/tags';

    // Homepage, article pages, and tag cloud page use full-screen layouts without footer
    const useFullScreenLayout = isHomePage || isArticlePage || isTagCloudPage;

    return (
        <div className={`${useFullScreenLayout ? 'h-screen overflow-hidden' : 'min-h-screen'} flex flex-col bg-background-light dark:bg-background-dark text-black dark:text-white transition-colors duration-500`}>
            {/* Noise texture overlay */}
            <NoiseOverlay />
            
            {/* Grid pattern background */}
            <div className="fixed inset-0 -z-10 pointer-events-none opacity-5 grid-pattern" />
            
            <BrutalistHeader />
            <main className={`flex-grow flex flex-col ${useFullScreenLayout ? '' : 'items-center pt-20'}`}>
                <Outlet />
            </main>
            {!useFullScreenLayout && <Footer />}
            {!useFullScreenLayout && <BackToTop />}
        </div>
    );
}
