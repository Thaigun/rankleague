const tau = 0.5;

export function calculateRatingDeviation(
    ratingDeviation: number,
    volatility: number,
    ratingPeriods: number,
): number {
    const phi = ratingDeviationToGlicko2Scale(ratingDeviation);
    const phiStar = calculatePhiStar(phi, volatility, ratingPeriods);
    return ratingDeviationFromGlicko2Scale(phiStar);
}

interface PlayerRatingData {
    rating: number;
    ratingDeviation: number;
    volatility: number;
}

interface Glicko2PlayerData {
    mu: number;
    phi: number;
}

// https://glicko.net/glicko/glicko2.pdf
export function calculateGlicko2Rating(
    player: PlayerRatingData,
    opponents: PlayerRatingData[],
    scores: (0 | 0.5 | 1)[],
    ratingPeriods: number,
): PlayerRatingData {
    // Step 2
    const mu = ratingToGlicko2Scale(player.rating);
    const phi = ratingDeviationToGlicko2Scale(player.ratingDeviation);
    const convertedOpponents = opponents.map((opp) => ({
        mu: ratingToGlicko2Scale(opp.rating),
        phi: ratingDeviationToGlicko2Scale(opp.ratingDeviation),
    }));

    // Step 3
    const v = calculateV(mu, convertedOpponents);

    // Step 4
    const delta = calculateDelta(v, mu, convertedOpponents, scores);

    // Step 5
    const newSigma = iterateVolatility(player.volatility, phi, delta, v);

    // Step 6
    const phiStar = calculatePhiStar(phi, newSigma, ratingPeriods);

    // Step 7
    const newPhi = calculateNewPhi(phiStar, v);
    const newMu = calculateNewMu(mu, newPhi, convertedOpponents, scores);

    return {
        rating: ratingFromGlicko2Scale(newMu),
        ratingDeviation: ratingDeviationFromGlicko2Scale(newPhi),
        volatility: newSigma,
    };
}

function ratingToGlicko2Scale(rating: number) {
    return (rating - 1500) / 173.7178;
}

function ratingFromGlicko2Scale(mu: number) {
    return mu * 173.7178 + 1500;
}

function ratingDeviationToGlicko2Scale(ratingDeviation: number) {
    return ratingDeviation / 173.7178;
}

function ratingDeviationFromGlicko2Scale(phi: number) {
    return phi * 173.7178;
}

function calculateV(mu: number, opponents: Glicko2PlayerData[]) {
    let sum = 0;
    for (const opponent of opponents) {
        const gRes = g(opponent.phi);
        const ERes = E(mu, opponent.mu, opponent.phi);
        sum += gRes * gRes * ERes * (1 - ERes);
    }
    return 1 / sum;
}

function g(phi: number) {
    return 1 / Math.sqrt(1 + (3 * phi * phi) / (Math.PI * Math.PI));
}

function E(mu: number, mu_j: number, phi_j: number) {
    return 1 / (1 + Math.exp(-g(phi_j) * (mu - mu_j)));
}

function calculateDelta(v: number, mu: number, opponents: Glicko2PlayerData[], scores: (0 | 0.5 | 1)[]) {
    let sum = 0;
    if (opponents.length !== scores.length) {
        throw new Error('Opponents and scores arrays must have the same length');
    }
    for (let i = 0; i < opponents.length; i++) {
        const opponent = opponents[i];
        const score = scores[i];
        sum += g(opponent.phi) * (score - E(mu, opponent.mu, opponent.phi));
    }
    return v * sum;
}

const epsilon = 0.000001;

function f(x: number, delta: number, v: number, phi: number, sigma: number) {
    const a = Math.log(sigma * sigma);
    const tempRes = phi * phi + v + Math.exp(x);
    return (
        (Math.exp(x) * (delta * delta - phi * phi - v - Math.exp(x))) / (2 * tempRes * tempRes) -
        (x - a) / (tau * tau)
    );
}

function iterateVolatility(sigma: number, phi: number, delta: number, v: number) {
    const a = Math.log(sigma * sigma);
    let A = a;
    let B: number;
    if (delta * delta > phi * phi + v) {
        B = Math.log(delta * delta - phi * phi - v);
    } else {
        let k = 1;
        while (f(a - k * tau, delta, v, phi, sigma) < 0) {
            k++;
        }
        B = a - k * tau;
    }
    let fa = f(A, delta, v, phi, sigma);
    let fb = f(B, delta, v, phi, sigma);
    let iterationCount = 0;
    while (Math.abs(A - B) > epsilon) {
        if (++iterationCount > 10000) {
            throw new Error('Iteration limit exceeded');
        }
        const C = A + (fa * (A - B)) / (fb - fa);
        const fc = f(C, delta, v, phi, sigma);
        if (fc * fb <= 0) {
            A = B;
            fa = fb;
        } else {
            fa /= 2;
        }
        B = C;
        fb = fc;
    }
    return Math.exp(A / 2);
}

function calculatePhiStar(phi: number, newSigma: number, ratingPeriods: number) {
    return Math.sqrt(phi * phi + newSigma * newSigma * ratingPeriods);
}

function calculateNewPhi(phiStar: number, v: number) {
    return 1 / Math.sqrt(1 / (phiStar * phiStar) + 1 / v);
}

function calculateNewMu(mu: number, newPhi: number, opponents: Glicko2PlayerData[], scores: (0 | 0.5 | 1)[]) {
    let sum = 0;
    if (opponents.length !== scores.length) {
        throw new Error('Opponents and scores arrays must have the same length');
    }
    for (let i = 0; i < opponents.length; i++) {
        const opponent = opponents[i];
        const score = scores[i];
        sum += g(opponent.phi) * (score - E(mu, opponent.mu, opponent.phi));
    }
    return mu + newPhi * newPhi * sum;
}
