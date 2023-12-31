module.exports = function roll(entries, winnerCount) {
    let winnerId = ``
    let winners = []
    try {
        for (let i = 0; i < winnerCount && entries?.length != 0; i++) {
            let rid = entries[Math.floor(Math.random() * entries?.length)];
            if (winnerId.length == 0) winnerId = winnerId + `<@${rid}>`;
            else winnerId = winnerId + `, <@${rid}>`;

            winners.push(rid);

            let r = [];
            entries.forEach(x => {
                if (x != rid) r.push(x)
            });
            entries = r;
        };
    } catch (error) { };

    return { entries, winnerId, winners }
}