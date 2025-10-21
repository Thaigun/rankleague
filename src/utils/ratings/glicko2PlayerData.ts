export interface PlayerRatingData {
    rating: number;
    ratingDeviation: number;
    volatility: number;
}

export interface Glicko2PlayerData {
    mu: number;
    phi: number;
}
