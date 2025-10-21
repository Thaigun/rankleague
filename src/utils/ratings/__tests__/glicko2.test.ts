import { describe, expect, test } from 'bun:test';
import { calculateGlicko2Rating, calculateRatingDeviation, expectedScore } from '../glicko2';

describe('calculateRatingDeviation', () => {
    test('should increase monotonically', () => {
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

    test('should avoid runaway RD inflation with high ratingPeriods', () => {
        const rd = calculateRatingDeviation(200, 0.06, 1000);
        expect(rd).toBeLessThan(500);
    });

    test('sequential periods should equal single long period', () => {
        const rdInitial = 100;
        const sigma = 0.06;

        let rdSequential = rdInitial;
        for (let i = 0; i < 10; i++) {
            rdSequential = calculateRatingDeviation(rdSequential, sigma, 1);
        }

        const rdBatch = calculateRatingDeviation(rdInitial, sigma, 10);
        expect(rdBatch).toBeCloseTo(rdSequential, 5);
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
        const updated = calculateGlicko2Rating(player, opponents, scores);

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

        const updatedA = calculateGlicko2Rating(A, [B], [1]);
        const updatedB = calculateGlicko2Rating(B, [A], [0]);

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

        const updatedA = calculateGlicko2Rating(A, [B], [0.5]);
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

        const after = calculateGlicko2Rating(player, [opponent], [0.5]);
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
        const result = calculateGlicko2Rating(player, [opponent], [1]);
        expect(result.rating).toBeGreaterThan(1500);
        expect(result.ratingDeviation).toBeLessThan(350);
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
            const score = i % 2 === 0 ? 1 : 0;
            player = calculateGlicko2Rating(player, [opponent], [score]);
        }

        expect(player.rating).toBeGreaterThan(1500);
        expect(player.ratingDeviation).toBeLessThan(200);
    });

    test('greater rating deviation opponents should have less impact', () => {
        const player = {
            rating: 1500,
            ratingDeviation: 50,
            volatility: 0.06,
        };
        const opponentLowRD = {
            rating: 1600,
            ratingDeviation: 30,
            volatility: 0.06,
        };
        const opponentHighRD = {
            rating: 1600,
            ratingDeviation: 300,
            volatility: 0.06,
        };

        const updatedLowRD = calculateGlicko2Rating(player, [opponentLowRD], [1]);
        const updatedHighRD = calculateGlicko2Rating(player, [opponentHighRD], [1]);

        expect(updatedLowRD.rating - player.rating).toBeGreaterThan(updatedHighRD.rating - player.rating);
    });
});
