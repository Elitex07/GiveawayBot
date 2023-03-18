const { EmbedBuilder, userMention } = require("discord.js")
const emoji = require("../config/emoji.json")
/**
 * 
 * @param {import("discord.js").EmbedData} oldData 
 * @param {*} options 
 * @param {*} type 
 * @returns 
 */
module.exports = function generateGawEmbed(oldData, options, type = "main") {
    const embed = new EmbedBuilder(oldData)
    if (type && !["noEntries", "End"].includes(type)) {

        embed.setColor(options.color ?? "#ff4c0a")
            .setAuthor(options.EmbedAuthor || null)
            .setImage(options.banner || null)
            .setDescription(`
    ${emoji.point} **Giveaway Details**
    ${emoji.blankspace}${emoji.replyc} Prize: **${options.prize}**
    ${emoji.blankspace}${emoji.replyc} No. of Winners: ${options.winnerCount}
    ${emoji.blankspace}${emoji.replyc} Host: ${options.host} ${options.entriesLimit != 'infinite' ? `\n ${emoji.blankspace}${emoji.replyc} Entry will stop at ${options.entriesLimit} Entries` : ``}
    ${emoji.blankspace}${emoji.reply} Ends: <t:${((Date.now() + options.time) / 1000).toFixed(0)}>  [<t:${((Date.now() + options.time) / 1000).toFixed(0)}:R>]
    ${options?.multi?.length == 0 ? `` : `\n${emoji.point} **Multiplier**\n`.concat(options.multi)}
    ${options?.requirements?.length == 0 ? `` : `${emoji.point} **Requirements**\n`.concat(options.requirements)}
    `)

        return embed;
    }
    /**
     * generates Giveaway noEntries Embed
     */
    else if (type && type == "noEntries") {
        embed.setColor(typeof oldData == "undefined" ? options.color ?? "#ff4c0a" : oldData.color ?? "#ff4c0a")
            .setAuthor(typeof oldData == "undefined" ? options.EmbedAuthor ?? null : oldData.author ?? null)
            .setImage(typeof oldData == "undefined" ? options.banner ?? null : oldData.image ?? null)
            .setDescription(`
    ${emoji.point} **Giveaway Details**
    ${emoji.blankspace}${emoji.replyc} Prize: **${options.prize}**
    ${emoji.blankspace}${emoji.replyc} Winners: **No Winners**
    ${emoji.blankspace}${emoji.replyc} Host: ${userMention(options.host)} ${options.entriesLimit != 'infinite' ? `\n ${emoji.blankspace}${emoji.replyc} Entry stopped at ${options.entriesLimit} Entries` : ``}
    ${emoji.blankspace}${emoji.reply} Ends: Giveaway Cancelled 
    ${options.multi.length == 0 ? `` : `\n${emoji.point} **Multiplier**\n`.concat(options.multi)}
    ${options.requirements.length == 0 ? `` : `${emoji.point} **Requirements**\n`.concat(options.requirements)}
    `).setFooter(typeof oldData == "undefined" ? options.footer ?? { text: "Giveaway has been cancelled due to no participation" } : oldData.footer ?? { text: "Giveaway has been cancelled due to no participation" })

        return embed;
    }
    /**
     * Generates Giveaway End Embed
     */
    else if (type && type == "End") {
        embed.setColor(options.color ?? "#ff4c0a")
            .setAuthor(typeof oldData == "undefined" ? options.EmbedAuthor ?? null : oldData.author ?? null)
            .setImage(typeof oldData == "undefined" ? options.banner ?? null : oldData.image ?? null)
            .setDescription(`
    ${emoji.point} **Giveaway Details**
    ${emoji.blankspace}${emoji.replyc} Prize: **${options.prize}**
    ${emoji.blankspace}${emoji.replyc} Winners: ${options.winners.length != 0 ? options.winners : '\`Error came\` :skull:'}
    ${emoji.blankspace}${emoji.replyc} Host: ${userMention(options.host)} ${options.entriesLimit != 'infinite' ? `\n ${emoji.blankspace}${emoji.replyc} Entry stopped at ${options.entriesLimit} Entries` : ``}
    ${emoji.blankspace}${emoji.reply} Ends: <t:${((Date.now()) / 1000).toFixed(0)}>  [<t:${((Date.now()) / 1000).toFixed(0)}:R>]
    ${options.multi.length == 0 ? `` : `\n${emoji.point} **Multiplier**\n`.concat(options.multi)}
    ${options.requirements.length == 0 ? `` : `${emoji.point} **Requirements**\n`.concat(options.requirements)}
    `).setFooter(typeof oldData == "undefined" ? options.footer ?? { text: "Giveaway has been ended." } : oldData.footer ?? { text: "Giveaway has been ended." })

        return embed
    }
}