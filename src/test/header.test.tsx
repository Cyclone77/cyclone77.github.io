import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import BrutalistHeader from '../components/BrutalistHeader';
import { ThemeProvider } from '../contexts/ThemeContext';

/**
 * Feature: ui-redesign-brutalist
 * Unit tests for BrutalistHeader component
 * Validates: Requirements 2.1, 2.4, 11.3, 11.4
 */

const renderWithProviders = (component: React.ReactNode) => {
    return render(
        <MemoryRouter>
            <ThemeProvider>
                {component}
            </ThemeProvider>
        </MemoryRouter>
    );
};

describe('BrutalistHeader Component', () => {
    it('should render with fixed positioning', () => {
        renderWithProviders(<BrutalistHeader />);
        const nav = document.querySelector('nav');
        expect(nav).toHaveClass('fixed');
    });

    it('should have 4px bottom border', () => {
        renderWithProviders(<BrutalistHeader />);
        const nav = document.querySelector('nav');
        expect(nav).toHaveClass('border-b-4');
    });

    it('should have backdrop blur effect', () => {
        renderWithProviders(<BrutalistHeader />);
        const nav = document.querySelector('nav');
        expect(nav).toHaveClass('backdrop-blur-md');
    });

    it('should render logo with Matrix Green background', () => {
        renderWithProviders(<BrutalistHeader />);
        const logo = screen.getByText('Cyclone77');
        expect(logo).toHaveClass('bg-primary');
    });

    it('should render navigation links on desktop', () => {
        renderWithProviders(<BrutalistHeader />);
        expect(screen.getByText('文章归档')).toBeInTheDocument();
        expect(screen.getByText('技术专题')).toBeInTheDocument();
        expect(screen.getByText('关于我')).toBeInTheDocument();
    });

    it('should render search icon', () => {
        renderWithProviders(<BrutalistHeader />);
        expect(screen.getByLabelText('搜索')).toBeInTheDocument();
    });

    it('should render theme toggle button', () => {
        renderWithProviders(<BrutalistHeader />);
        expect(screen.getByLabelText('切换主题')).toBeInTheDocument();
    });
});
