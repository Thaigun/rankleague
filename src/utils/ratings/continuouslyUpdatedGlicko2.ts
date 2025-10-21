import { calculateGlicko2Rating, calculateRatingDeviation } from './glicko2';
import type { PlayerRatingData } from './glicko2PlayerData';

const c = 0.02;
const ratingPeriodLengthDays = 7;
const ratingPeriodLengthMs = ratingPeriodLengthDays * 24 * 60 * 60 * 1000;

interface PlayerRatingWithLastUpdated extends PlayerRatingData {
    lastUpdated: Date;
}

export function applyMatchResult(
    player1: PlayerRatingWithLastUpdated,
    player2: PlayerRatingWithLastUpdated,
    score1: 0 | 0.5 | 1,
    score2: 0 | 0.5 | 1,
    now: Date,
): [PlayerRatingWithLastUpdated, PlayerRatingWithLastUpdated] {
    const player1Inflated = inflatePlayerRatingDeviation(player1, now);
    const player2Inflated = inflatePlayerRatingDeviation(player2, now);
    const player1RatingUpdated = calculateGlicko2Rating(player1Inflated, [player2Inflated], [score1]);
    const player2RatingUpdated = calculateGlicko2Rating(player2Inflated, [player1Inflated], [score2]);
    return [
        {
            ...player1RatingUpdated,
            lastUpdated: now,
        },
        {
            ...player2RatingUpdated,
            lastUpdated: now,
        },
    ];
}

function inflatePlayerRatingDeviation(player: PlayerRatingWithLastUpdated, now: Date): PlayerRatingData {
    const msSinceLastGame = now.valueOf() - player.lastUpdated.valueOf();
    const ratingPeriods = msSinceLastGame / ratingPeriodLengthMs;
    const inflatedRD = calculateRatingDeviation(player.ratingDeviation, c, ratingPeriods);
    return { ...player, ratingDeviation: inflatedRD };
}
