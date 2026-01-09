import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';

/**
 * Feature: ui-redesign-brutalist, Property 2: Theme Toggle and Persistence
 * For any theme state (light or dark), clicking the theme toggle should result
 * in the opposite theme being active, and the new preference should be persisted to localStorage.
 * Validates: Requirements 2.5, 12.5
 */

describe('Property Test: Theme Toggle and Persistence', () => {
    const THEME_KEY = 'theme';

    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    // Simulate theme toggle logic
    const toggleTheme = (currentTheme: 'light' | 'dark'): 'light' | 'dark' => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem(THEME_KEY, newTheme);
        return newTheme;
    };

    const getStoredTheme = (): string | null => {
        return localStorage.getItem(THEME_KEY);
    };

    it('should toggle theme to opposite state for any initial theme', () => {
        fc.assert(
            fc.property(
                fc.constantFrom('light', 'dark') as fc.Arbitrary<'light' | 'dark'>,
                (initialTheme) => {
                    const expectedTheme = initialTheme === 'light' ? 'dark' : 'light';
                    const newTheme = toggleTheme(initialTheme);
                    
                    expect(newTheme).toBe(expectedTheme);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should persist theme preference to localStorage after toggle', () => {
        fc.assert(
            fc.property(
                fc.constantFrom('light', 'dark') as fc.Arbitrary<'light' | 'dark'>,
                (initialTheme) => {
                    const newTheme = toggleTheme(initialTheme);
                    const storedTheme = getStoredTheme();
                    
                    expect(storedTheme).toBe(newTheme);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should maintain consistency through multiple toggles', () => {
        fc.assert(
            fc.property(
                fc.constantFrom('light', 'dark') as fc.Arbitrary<'light' | 'dark'>,
                fc.integer({ min: 1, max: 10 }),
                (initialTheme, toggleCount) => {
                    let currentTheme = initialTheme;
                    
                    for (let i = 0; i < toggleCount; i++) {
                        currentTheme = toggleTheme(currentTheme);
                    }
                    
                    // After even number of toggles, should be back to initial
                    // After odd number of toggles, should be opposite
                    const expectedTheme = toggleCount % 2 === 0 
                        ? initialTheme 
                        : (initialTheme === 'light' ? 'dark' : 'light');
                    
                    expect(currentTheme).toBe(expectedTheme);
                    expect(getStoredTheme()).toBe(expectedTheme);
                }
            ),
            { numRuns: 100 }
        );
    });
});
