const gawModel = require(`../../database/models/giveawaySchema`);
const { EmbedBuilder, roleMention } = require('discord.js')
const emoji = require(`../../config/emoji.json`);
const config = require('../../config/giveaway.json');
const ms = require('ms');
const client = require('../../index');
const generateGawEmbed = require('../../functions/generateGawEmbed');
const roll = require('../../functions/roll');

module.exports = {
    name: 'keepGawAliveAfterRestart'
};

client.on('ready', async client => { await gaw(client) });

async function gaw(client) {
    let l = await gawModel.find({ status: true });

    l.forEach(async i => {
        if (Date.now() - Number(i.endtime) > 0 || Date.now() - Number(i.endtime) == 0) {
            let guild = client.guilds.cache.get(i.serverID);
            if (!guild || !guild.available) await client.guilds.fetch(i.serverID).catch(e => null);
            guild = client.guilds.cache.get(i.serverID);
            if (!guild || !guild.available) return;

            let id = i.msgid;
            if (!id) return;

            if (!i.status) return;

            if (!guild.channels.cache.get(i.chId)) return;

            await guild.channels.cache.get(i.chId).messages.fetch(i.msgid).catch(e => null);

            const { multi, req } = i;
            let desc = '';
            let desc2 = '';
            let rolelist = [];
            let brolelist = [];

            multi.forEach(function (value, key) {
                desc = desc + `${emoji.blankspace} :wh ite_medium_small_square: ${guild.roles.cache.get(key) || '@deletedRole'} - \`x${value}\` Entries.\n`;
            });

            req.forEach(function (value, key) {
                if (key == 'role') {
                    value.forEach(i => rolelist.push(guild.roles.cache.get(i)))
                }
                if (key == 'blackrole') {
                    value.forEach(i => brolelist.push(guild.roles.cache.get(i)))
                }
                if (key == 'join') desc2 = desc2 + `${emoji.blankspace} :white_medium_small_square: You should have stayed for more than ${ms(value)} in this server\n`;
                if (key == 'age') desc2 = desc2 + `${emoji.blankspace} :white_medium_small_square: Your Account should be older than ${ms(value)}\n`;
            });

            if (rolelist.length > 0) desc2 = desc2 + `${emoji.blankspace} :white_medium_small_square: Any of the Required Role(s) - ${rolelist.join(', ')}\n`;
            if (brolelist.length > 0) desc2 = desc2 + `${emoji.blankspace} :white_medium_small_square: Blacklited Role(s) - ${brolelist.join(', ')}\n`;

            let msg = guild.channels.cache.get(i.chId).messages.cache.get(i.msgid);
            if (!msg) return;

            if (!i.entries || i.entries?.length == 0) {
                await msg.edit({
                    components: [], embeds: [generateGawEmbed(msg.embeds[0].data, { prize: i.prize, host: i.host, entriesLimit: i.entrylimit, multi: desc, requirements: desc2 }, "noEntries")]
                });

                i.status = false;
                i.save();
                return;
            }

            // Drawing winner(s)
            let list = i.entries;
            const rolledData = roll(list, Number(i.winCount) || 1)
            list = rolledData.entries
            i.winners.push(...rolledData.winners)
            let role = guild.roles.cache.get(config.winrole);
            rolledData.winners.forEach(async i => {
                if (role) {
                    await guild.members.fetch(i).catch(e => null);
                    await guild.members.cache.get(i).roles.add(role, 'Giveaway Winner Role').catch(e => null);
                }
            });
            await msg.edit({
                components: [], embeds: [generateGawEmbed(msg.embeds[0].data, { prize: i.prize, winners: rolledData.winnerId, host: i.host, entriesLimit: i.entrylimit, multi: desc, requirements: desc2 }, "End")]
            });

            i.status = false;
            i.save();

            msg.channel.send({ content: `${config.emote} Congratulations, ${rolledData.winnerId}! You won **${i.prize}** ${config.emote}`, embeds: [new EmbedBuilder().setColor('#ff4c0a').setDescription(`[**Link to Giveaway**](${msg.url})`)] }).catch(e => null);

        } else {
            let time = Number(i.endtime) - Date.now();

            setTimeout(async () => {
                let guild = client.guilds.cache.get(i.serverID);
                if (!guild || !guild.available) await client.guilds.fetch(i.serverID).catch(e => null);
                guild = client.guilds.cache.get(i.serverID);
                if (!guild || !guild.available) return;

                let id = i.msgid;
                if (!id) return;

                if (!i.status) return;

                if (!guild.channels.cache.get(i.chId)) return;

                await guild.channels.cache.get(i.chId).messages.fetch(i.msgid).catch(e => null);

                const { multi, req } = i;
                let desc = '';
                let desc2 = '';
                let rolelist = [];
                let brolelist = [];

                multi.forEach(function (value, key) {
                    desc = desc + `${emoji.blankspace} :white_medium_small_square: ${guild.roles.cache.get(key) || '@deletedRole'} - \`x${value}\` Entries.\n`;
                });

                req.forEach(function (value, key) {
                    if (key == 'role') {
                        value.forEach(i => rolelist.push(guild.roles.cache.get(i)))
                    }
                    if (key == 'blackrole') {
                        value.forEach(i => brolelist.push(guild.roles.cache.get(i)))
                    }
                    if (key == 'join') desc2 = desc2 + `${emoji.blankspace} :white_medium_small_square: You should have stayed for more than ${ms(value)} in this server\n`;
                    if (key == 'age') desc2 = desc2 + `${emoji.blankspace} :white_medium_small_square: Your Account should be older than ${ms(value)}\n`;
                });

                if (rolelist.length > 0) desc2 = desc2 + `${emoji.blankspace} :white_medium_small_square: Any of the Required Role(s) - ${rolelist.join(', ')}\n`;
                if (brolelist.length > 0) desc2 = desc2 + `${emoji.blankspace} :white_medium_small_square: Blacklited Role(s) - ${brolelist.join(', ')}\n`;

                let msg = guild.channels.cache.get(i.chId).messages.cache.get(i.msgid);
                if (!msg) return;

                if (!i.entries || i.entries?.length == 0) {
                    await msg.edit({
                        components: [], embeds: [generateGawEmbed(msg.embeds[0].data, { prize: i.prize, host: i.host, entriesLimit: i.entrylimit, multi: desc, requirements: desc2 }, "noEntries")]
                    });

                    i.status = false;
                    i.save();
                    return;
                }

                // Drawing winner(s)
                let list = i.entries;

                const rolledData = roll(list, Number(i.winCount) || 1)
                list = rolledData.entries
                i.winners.push(...rolledData.winners)
                let role = guild.roles.cache.get(config.winrole);
                rolledData.winners.forEach(async i => {
                    if (role) {
                        await guild.members.fetch(i).catch(e => null);
                        await guild.members.cache.get(i).roles.add(role, 'Giveaway Winner Role').catch(e => null);
                    }
                });
                await msg.edit({
                    components: [], embeds: [generateGawEmbed(msg.embeds[0].data, { prize: i.prize, winners: rolledData.winnerId, host: i.host, entriesLimit: i.entrylimit, multi: desc, requirements: desc2 }, "End")]
                });

                i.status = false;
                i.save();

                msg.channel.send({ content: `${config.emote} Congratulations, ${rolledData.winnerId}! You won **${i.prize}** ${config.emote}`, embeds: [new EmbedBuilder().setColor('#ff4c0a').setDescription(`[**Link to Giveaway**](${msg.url})`)] }).catch(e => null);
            }, time)
        }
    })
}
