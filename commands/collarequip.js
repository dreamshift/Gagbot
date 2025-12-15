const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getHeavy, assignHeavy, commandsheavy, convertheavy } = require('./../functions/heavyfunctions.js')
const { getCollar } = require('./../functions/collarfunctions.js')
const { getChastity, assignChastity } = require('./../functions/vibefunctions.js')
const { assignMitten, getMitten } = require('./../functions/gagfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')

module.exports = {
	data: new SlashCommandBuilder()
		//.setName('collarequip')
        .setName('equip')
		//.setDescription(`Put chastity, mittens or heavy bondage on someone with a collar`)
        .setDescription(`Put chastity, mittens or heavy bondage on anyone`)
        .addSubcommand((subcommand) => 
            subcommand.setName('mittens')
                .setDescription('Apply Mittens...')
                .addUserOption(opt => 
                    opt.setName('user')
                    .setDescription("To who?")
                    .setRequired(true)
                )
        )
        .addSubcommand(subcommand => 
            subcommand.setName('heavy')
                .setDescription('Apply Heavy Bondage...')
                .addUserOption(opt => 
                    opt.setName('user')
                       .setDescription("To who?")
                       .setRequired(true)
                )
                .addStringOption(opt =>
                    opt.setName('type')
                    .setDescription("Which Restraint?")
                    .addChoices(...commandsheavy)
                    .setRequired(true)
                )
        )
        .addSubcommand((subcommand) => 
            subcommand.setName('chastity')
                .setDescription('Apply Chastity...')
                .addUserOption(opt => 
                    opt.setName('user')
                       .setDescription("To who?")
                       .setRequired(true)
                )
                .addUserOption(opt =>
                    opt.setName('keyholder')
                    .setDescription("Who should be the keyholder?")
                )
        ),
    async execute(interaction) {
        let actiontotake = interaction.options.getSubcommand();
		let collareduser = interaction.options.getUser('user')
        let heavybondagetype = interaction.options.getString('type')
        let keyholderuser = interaction.options.getUser('keyholder') ? interaction.options.getUser('keyholder') : interaction.user
		if (getHeavy(interaction.user.id)) {
			interaction.reply(`${interaction.user} tugs against ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}, trying to get ${getPronouns(interaction.user.id, "possessiveDeterminer")} hands on ${collareduser}'s collar, but ${getPronouns(collareduser.id, "subject")} can't reach it!`)
        }
        else if (collareduser == interaction.user) {
            // Don't be cheeky. 
            interaction.reply({ content: `You can't use /equip to apply things to yourself!\nrun the command again without equip to apply to yourself,\ni.e. /mitten, /heavy, /chastity`, flags: MessageFlags.Ephemeral })
        }
        //dreamshift changes, for their private server
		//else if (getCollar(collareduser.id)) {
        //skip checking if someone's wearing a collar, effectively meaning any user can put anything on any other user using /collarequip
        //the people in dreamshift's private server want this change
        else if (true) {
  
            //if ((getCollar(collareduser.id).keyholder == interaction.user) || (!getCollar(collareduser.id).keyholder_only)) {
            //skip checking if you have the key to someone's collar, so that every collar is free use!
            if (true) {
                // Either we're a keyholder or it's a free user collar. 
                if (actiontotake == "mittens") {
                    if (getMitten(collareduser)) {
                        interaction.reply({ content: `${collareduser} is already wearing mittens!`, flags: MessageFlags.Ephemeral })
                    }
                    else {
                        interaction.reply(`${interaction.user} grabs ${collareduser}'s hands, shoving a pair of mittens on, and putting a lock on the straps, sealing away ${getPronouns(collareduser.id, "possessiveDeterminer")} hands!`)
                        assignMitten(collareduser);
                    }
                }
                else if (actiontotake == "heavy") {
                    if (getHeavy(collareduser)) {
                        interaction.reply({ content: `${collareduser} is already in bondage, wearing a ${getHeavy(collareduser.id).type}!`, flags: MessageFlags.Ephemeral })
                    }
                    else {
                        interaction.reply(`${interaction.user} pulls a ${convertheavy(heavybondagetype)} out and grabs ${collareduser}, forcing ${getPronouns(collareduser.id, "possessiveDeterminer")} arms and hands into the tight restraint! ${getPronouns(collareduser.id, "subject", true)} squirm${(getPronouns(collareduser.id, "subject") != "they") ? "s" : ""} in protest, but ${getPronouns(collareduser.id, "subject")} can't do anything about it!`)
                        assignHeavy(collareduser.id, heavybondagetype)
                    }
                }
                else if (actiontotake == "chastity") {
                    if (getChastity(collareduser)) {
                        interaction.reply({ content: `${collareduser} is already in a chastity belt, with keys held by <@${getChastity(collareduser.id).keyholder}>!`, flags: MessageFlags.Ephemeral })
                    }
                    else {
                        if (keyholderuser == interaction.user) {
                            interaction.reply(`${interaction.user} grabs ${collareduser} and wraps a chastity belt around ${getPronouns(collareduser.id, "possessiveDeterminer")} waist and clicking the lock shut before ${getPronouns(collareduser.id, "subject")} can even react!`)
                            assignChastity(collareduser.id, keyholderuser.id)
                        }
                        else {
                            interaction.reply(`${interaction.user} grabs ${collareduser} and wraps a chastity belt around ${getPronouns(collareduser.id, "possessiveDeterminer")} waist before clicking the lock shut and tossing the key over to ${keyholderuser}! ${getPronouns(collareduser.id, "subject", true)} will no doubt have to earn ${getPronouns(collareduser.id, "possessiveDeterminer")} chastity back!`)
                            assignChastity(collareduser.id, keyholderuser.id)
                        }
                    }
                }
            }
            else {
                // We don't have permission to play with that collar.
                //because the keyholder check is skipped, this should never occur.
                interaction.reply({ content: `You don't have the key to ${collareduser}'s collar!`, flags: MessageFlags.Ephemeral })
            }
        }
        else {
            // They aren't wearing a collar.
            //because the collar wearing check is skipped, this should never occur.
            interaction.reply({ content: `${collareduser} is not wearing a collar!`, flags: MessageFlags.Ephemeral })
        }
    }
}