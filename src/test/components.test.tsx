import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DuotoneImage from '../components/DuotoneImage';
import BrutalistButton from '../components/BrutalistButton';
import RadialMenu from '../components/RadialMenu';
import SubscribeWidget from '../components/SubscribeWidget';
import NoiseOverlay from '../components/NoiseOverlay';
import TagBubble from '../components/TagBubble';
import { Tag, TagPosition } from '../utils/tagCloud';

/**
 * Feature: ui-redesign-brutalist
 * Unit tests for shared brutalist components
 * Validates: Requirements 3.6, 4.4, 4.1
 */

describe('DuotoneImage Component', () => {
    it('should render with duotone-img class for filter effect', () => {
        render(<DuotoneImage src="test.jpg" alt="Test" />);
        const img = screen.getByAltText('Test');
        expect(img).toHaveClass('duotone-img');
    });

    it('should render badge when provided', () => {
        render(<DuotoneImage src="test.jpg" alt="Test" badge="ID: 001" />);
        expect(screen.getByText('ID: 001')).toBeInTheDocument();
    });

    it('should apply custom overlay color class', () => {
        const { container } = render(
            <DuotoneImage src="test.jpg" alt="Test" overlayColor="blue" />
        );
        const overlay = container.querySelector('.bg-blue-500\\/20');
        expect(overlay).toBeInTheDocument();
    });
});

describe('BrutalistButton Component', () => {
    it('should render with brutal shadow class', () => {
        render(<BrutalistButton>Click me</BrutalistButton>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('shadow-brutal');
    });

    it('should render with uppercase text', () => {
        render(<BrutalistButton>Click me</BrutalistButton>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('uppercase');
    });

    it('should apply primary variant styles by default', () => {
        render(<BrutalistButton>Click me</BrutalistButton>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-primary');
    });

    it('should apply secondary variant styles when specified', () => {
        render(<BrutalistButton variant="secondary">Click me</BrutalistButton>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-blue-500');
    });
});

describe('RadialMenu Component', () => {
    const mockItems = [
        { icon: 'home', label: 'Home', onClick: vi.fn() },
        { icon: 'terminal', label: 'Terminal', onClick: vi.fn() },
        { icon: 'settings', label: 'Settings', onClick: vi.fn() },
    ];

    it('should render main FAB button with add icon', () => {
        render(<RadialMenu items={mockItems} />);
        expect(screen.getByText('add')).toBeInTheDocument();
    });

    it('should render all menu items', () => {
        render(<RadialMenu items={mockItems} />);
        expect(screen.getByText('home')).toBeInTheDocument();
        expect(screen.getByText('terminal')).toBeInTheDocument();
        expect(screen.getByText('settings')).toBeInTheDocument();
    });

    it('should have fixed positioning', () => {
        const { container } = render(<RadialMenu items={mockItems} />);
        const menu = container.firstChild;
        expect(menu).toHaveClass('fixed');
    });
});

describe('SubscribeWidget Component', () => {
    it('should render email input field', () => {
        render(<SubscribeWidget />);
        expect(screen.getByPlaceholderText('USER@DOMAIN.COM')).toBeInTheDocument();
    });

    it('should render join button', () => {
        render(<SubscribeWidget />);
        expect(screen.getByRole('button', { name: /join/i })).toBeInTheDocument();
    });

    it('should have fixed positioning by default', () => {
        const { container } = render(<SubscribeWidget />);
        const widget = container.firstChild;
        expect(widget).toHaveClass('fixed');
    });

    it('should not have fixed positioning when inline', () => {
        const { container } = render(<SubscribeWidget position="inline" />);
        const widget = container.firstChild;
        expect(widget).not.toHaveClass('fixed');
    });

    it('should update email input on change', () => {
        render(<SubscribeWidget />);
        const input = screen.getByPlaceholderText('USER@DOMAIN.COM') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'test@example.com' } });
        expect(input.value).toBe('test@example.com');
    });
});

describe('NoiseOverlay Component', () => {
    it('should render SVG with noise filter', () => {
        const { container } = render(<NoiseOverlay />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });

    it('should have noise-overlay class', () => {
        const { container } = render(<NoiseOverlay />);
        const overlay = container.firstChild;
        expect(overlay).toHaveClass('noise-overlay');
    });

    it('should contain feTurbulence filter', () => {
        const { container } = render(<NoiseOverlay />);
        const turbulence = container.querySelector('feTurbulence');
        expect(turbulence).toBeInTheDocument();
    });
});


/**
 * TagBubble 组件单元测试
 * Validates: Requirements 2.3, 2.6
 */
describe('TagBubble Component', () => {
    // 测试用的标签数据
    const mockTag: Tag = {
        name: 'React',
        count: 10,
        color: '#00FF41',
        description: 'React 相关文章',
        type: 'category',
    };

    // 测试用的位置数据
    const mockPosition: TagPosition = {
        x: 50,
        y: 50,
        fontSize: 'text-xl',
        zIndex: 15,
    };

    it('应该渲染正确的标签名称格式（#前缀）', () => {
        const handleClick = vi.fn();
        render(
            <TagBubble
                tag={mockTag}
                position={mockPosition}
                isHighlighted={true}
                onClick={handleClick}
            />
        );
        
        // 验证标签名称显示为 #React 格式
        expect(screen.getByText('#React')).toBeInTheDocument();
    });

    it('应该在点击时触发 onClick 回调并传递标签名称', () => {
        const handleClick = vi.fn();
        render(
            <TagBubble
                tag={mockTag}
                position={mockPosition}
                isHighlighted={true}
                onClick={handleClick}
            />
        );
        
        const button = screen.getByTestId('tag-bubble');
        fireEvent.click(button);
        
        // 验证点击回调被调用，并传递正确的标签名称
        expect(handleClick).toHaveBeenCalledTimes(1);
        expect(handleClick).toHaveBeenCalledWith('React');
    });

    it('应该渲染为可点击的按钮元素', () => {
        const handleClick = vi.fn();
        render(
            <TagBubble
                tag={mockTag}
                position={mockPosition}
                isHighlighted={true}
                onClick={handleClick}
            />
        );
        
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('cursor-pointer');
    });

    it('应该包含正确的无障碍标签', () => {
        const handleClick = vi.fn();
        render(
            <TagBubble
                tag={mockTag}
                position={mockPosition}
                isHighlighted={true}
                onClick={handleClick}
            />
        );
        
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', '标签: React, 10 篇文章');
    });
});
