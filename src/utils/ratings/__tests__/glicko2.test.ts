import { expect, test, describe } from 'bun:test';
import { calculateRatingDeviation, calculateGlicko2Rating } from '../glicko2';

describe('calculateRatingDeviation', () => {
    test('should increase slowly', () => {
        const originalRD = 20;
        let previousRD = originalRD;
        for (let i = 0; i < 100; i++) {
            const newRD = calculateRatingDeviation(previousRD, 0.06, 1);
            expect(newRD).toBeGreaterThan(previousRD);
            previousRD = newRD;
        }
    });

    test('more time should inflate rating period more', () => {
        const rd1 = calculateRatingDeviation(50, 0.06, 1);
        const rd2 = calculateRatingDeviation(50, 0.06, 10);
        expect(rd2).toBeGreaterThan(rd1);
    });

    test('should not inflate RD unrealistically fast for long inactivity', () => {
        const rdInitial = 50;
        const sigma = 0.06;

        const rd1 = calculateRatingDeviation(rdInitial, sigma, 1);
        const rd100 = calculateRatingDeviation(rdInitial, sigma, 100);

        expect(rd100 / rd1).toBeLessThan(5);
    });
});

describe('calculateGlicko2Rating', () => {
    test('should reproduce the official Glicko-2 example from the paper', () => {
        const player = {
            rating: 1500,
            ratingDeviation: 200,
            volatility: 0.06,
        };

        const opponents = [
            { rating: 1400, ratingDeviation: 30, volatility: 0.06 },
            { rating: 1550, ratingDeviation: 100, volatility: 0.06 },
            { rating: 1700, ratingDeviation: 300, volatility: 0.06 },
        ];

        const scores: (0 | 0.5 | 1)[] = [1, 0, 0];
        const updated = calculateGlicko2Rating(player, opponents, scores, 1);

        expect(updated.rating).toBeCloseTo(1464.06, 1);
        expect(updated.ratingDeviation).toBeCloseTo(151.52, 2);
        expect(updated.volatility).toBeCloseTo(0.05999, 4);
    });

    test("should move winner's rating up and loser's rating down", () => {
        const A = {
            rating: 1500,
            ratingDeviation: 50,
            volatility: 0.06,
        };
        const B = {
            rating: 1500,
            ratingDeviation: 50,
            volatility: 0.06,
        };

        const updatedA = calculateGlicko2Rating(A, [B], [1], 1);
        const updatedB = calculateGlicko2Rating(B, [A], [0], 1);

        expect(updatedA.rating).toBeGreaterThan(A.rating);
        expect(updatedB.rating).toBeLessThan(B.rating);
    });

    test('should not change rating much for a draw between equal players', () => {
        const A = {
            rating: 1500,
            ratingDeviation: 50,
            volatility: 0.06,
        };
        const B = {
            rating: 1500,
            ratingDeviation: 50,
            volatility: 0.06,
        };

        const updatedA = calculateGlicko2Rating(A, [B], [0.5], 1);
        expect(Math.abs(updatedA.rating - 1500)).toBeLessThan(1);
    });

    test('should reduce rating deviation (increase confidence) after a game', () => {
        const beforeRD = 200;
        const player = {
            rating: 1500,
            ratingDeviation: beforeRD,
            volatility: 0.06,
        };
        const opponent = {
            rating: 1500,
            ratingDeviation: 200,
            volatility: 0.06,
        };

        const after = calculateGlicko2Rating(player, [opponent], [0.5], 1);
        expect(after.ratingDeviation).toBeLessThan(beforeRD);
    });

    test('should handle extreme RD gracefully (sanity check)', () => {
        const player = {
            rating: 1500,
            ratingDeviation: 350,
            volatility: 0.06,
        };
        const opponent = {
            rating: 2000,
            ratingDeviation: 30,
            volatility: 0.06,
        };
        const result = calculateGlicko2Rating(player, [opponent], [1], 1);
        expect(result.rating).toBeGreaterThan(1500);
        expect(result.ratingDeviation).toBeLessThan(350);
    });

    test('should show that per-game updates reduce RD too aggressively', () => {
        const player = {
            rating: 1500,
            ratingDeviation: 200,
            volatility: 0.06,
        };
        const opponent = {
            rating: 1500,
            ratingDeviation: 50,
            volatility: 0.06,
        };

        // Simulate 10 sequential updates vs same opponent (as if we were updating after every game)
        let sequential = { ...player };
        for (let i = 0; i < 10; i++) {
            sequential = calculateGlicko2Rating(sequential, [opponent], [0.5], 1);
        }

        // Simulate a single rating-period update (should be more conservative)
        let batch = { ...player };
        for (let i = 0; i < 10; i++) {
            batch = calculateGlicko2Rating(batch, [opponent], [0.5], 10);
        }

        // Sequential RD should typically be smaller (overconfident)
        expect(sequential.ratingDeviation).toBeLessThan(batch.ratingDeviation);

        // Log ratio for manual inspection
        console.log('RD sequential vs batch', sequential.ratingDeviation, batch.ratingDeviation);
    });

    test('should detect runaway RD inflation with high ratingPeriods', () => {
        const rd = calculateRatingDeviation(200, 0.06, 1000);
        // If your phi* computation multiplies σ² * ratingPeriods (instead of c² * t),
        // this will explode unrealistically.
        expect(rd).toBeLessThan(1000);
    });

    test('should preserve reasonable RD bounds over many updates', () => {
        let player = {
            rating: 1500,
            ratingDeviation: 200,
            volatility: 0.06,
        };
        const opponent = {
            rating: 1600,
            ratingDeviation: 50,
            volatility: 0.06,
        };

        for (let i = 0; i < 200; i++) {
            const score = i % 2 === 0 ? 1 : 0; // alternate win/loss
            player = calculateGlicko2Rating(player, [opponent], [score], 1);
        }

        // RD should settle in a plausible range (50–300)
        expect(player.ratingDeviation).toBeGreaterThan(30);
        expect(player.ratingDeviation).toBeLessThan(350);
    });

    test('should reveal phi* drift issues by comparing with known formula', () => {
        const rd0 = 200;
        const sigma = 0.06;
        const t = 10;

        // Your implementation
        const phiStarYours = calculateRatingDeviation(rd0, sigma, t);

        // Correct theoretical version: φ* = sqrt(φ² + (c² × t)), where c = sqrt(σ²)
        // (simplified for t periods)
        const phi = rd0 / 173.7178;
        const phiStarExpected = Math.sqrt(phi * phi + sigma * sigma * t);

        const diff = Math.abs(phiStarExpected - phiStarYours / 173.7178);
        expect(diff).toBeLessThan(0.2); // loose tolerance, just flagging divergence
    });
});
