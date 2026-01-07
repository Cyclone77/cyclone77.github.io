import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import BackToTop from './BackToTop';

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark transition-colors duration-200">
            <Header />
            <main className="flex-grow flex flex-col items-center">
                <Outlet />
            </main>
            <Footer />
            <BackToTop />
        </div>
    );
}
