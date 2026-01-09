import { describe, it, expect } from 'vitest';
// @ts-expect-error - tailwind config is a JS file
import tailwindConfig from '../../tailwind.config.js';

/**
 * Feature: ui-redesign-brutalist
 * Unit tests for design token configuration
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5
 */
describe('Tailwind Config - Brutalist Design Tokens', () => {
    const colors = tailwindConfig.theme?.extend?.colors;
    const fontFamily = tailwindConfig.theme?.extend?.fontFamily;
    const borderRadius = tailwindConfig.theme?.extend?.borderRadius;
    const boxShadow = tailwindConfig.theme?.extend?.boxShadow;

    describe('Color Configuration', () => {
        it('should define Matrix Green as primary color (#00FF41)', () => {
            expect(colors?.primary).toBe('#00FF41');
        });

        it('should define background-light as #F0F0F0', () => {
            expect(colors?.['background-light']).toBe('#F0F0F0');
        });

        it('should define background-dark as #0A0A0A', () => {
            expect(colors?.['background-dark']).toBe('#0A0A0A');
        });
    });

    describe('Border Radius Configuration', () => {
        it('should configure default border-radius as 0px for brutalist sharp corners', () => {
            expect(borderRadius?.DEFAULT).toBe('0px');
        });

        it('should keep full border-radius for circular elements', () => {
            expect(borderRadius?.full).toBe('9999px');
        });
    });

    describe('Shadow Configuration', () => {
        it('should define brutal shadow utility', () => {
            expect(boxShadow?.brutal).toBe('4px 4px 0px 0px rgba(0,0,0,1)');
        });

        it('should define brutal-hover shadow utility', () => {
            expect(boxShadow?.['brutal-hover']).toBe('8px 8px 0px 0px rgba(0,0,0,1)');
        });

        it('should define brutal-white shadow for dark mode', () => {
            expect(boxShadow?.['brutal-white']).toBe('4px 4px 0px 0px rgba(255,255,255,1)');
        });
    });

    describe('Font Family Configuration', () => {
        it('should configure Ant Design style font stack as sans font', () => {
            expect(fontFamily?.sans).toContain('-apple-system');
            expect(fontFamily?.sans).toContain('"Segoe UI"');
            expect(fontFamily?.sans).toContain('Roboto');
        });

        it('should configure code font stack as mono font', () => {
            expect(fontFamily?.mono).toContain('"Lucida Console"');
            expect(fontFamily?.mono).toContain('Consolas');
            expect(fontFamily?.mono).toContain('monospace');
        });
    });
});
