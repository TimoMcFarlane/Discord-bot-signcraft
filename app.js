const Discord = require("discord.js");
const client = new Discord.Client();
const template = require("./templates/raid-template.json");
const dotenv = require("dotenv").config();
const debounce = require("debounce");

const ADD = "messageReactionAdd";
const REMOVE = "messageReactionRemove";

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", msg => {
  if (msg.author.username === "Signcraft") {
    console.log(msg.author.username);
    //msg.react(client.emojis.find(el => el.name === "tank"));
    //msg.react(client.emojis.find(el => el.name === "dps"));
    //msg.react(client.emojis.find(el => el.name === "healer"));
  } else {
    const args = msg.content
      .slice(process.env.PREFIX.length)
      .trim()
      .split(/ +/g);

    if (args.includes("new")) {
      if (args.includes("raid")) {
        msg.channel.send(createNewEvent(msg, "raid"));
      } else if (args.includes("m+")) {
        msg.channel.send(createNewEvent(msg, "m+"));
      }
    }
  }
});

client.on(ADD, (reaction, user) => {
  editSignups(ADD, reaction, user);
});

client.on(REMOVE, (reaction, user) => {
  editSignups(REMOVE, reaction, user);
});

editSignups = (type, reaction, user) => {
  if (user.username !== "Signcraft") {
    switch (reaction.emoji.name) {
      case "tank":
        template.tank.list = reaction.users
          .filter(user => user.username !== reaction.message.author.username)
          .map(user => user.username);
        if (type === REMOVE) {
          if (template.tank.list.length == 0) template.tank.list = "-";
        }
        break;
      case "healer":
        template.healer.list = reaction.users
          .filter(user => user.username !== reaction.message.author.username)
          .map(user => user.username);
        if (type === REMOVE) {
          if (template.healer.list.length == 0) template.healer.list = "-";
        }
        break;
      case "dps":
        template.dps.list = reaction.users
          .filter(user => user.username !== reaction.message.author.username)
          .map(user => user.username);
        if (type === REMOVE) {
          if (template.dps.list.length == 0) template.dps.list = "-";
        }
        break;
    }
    debounce(reaction.message.edit(createNewEvent(reaction.message)), 500);
  } else {
    debounce(reaction.message.edit(createNewEvent(reaction.message)), 500);
  }
};

createNewEvent = msg => {
  return new Discord.RichEmbed()
    .setAuthor(msg.guild.name)
    .setTitle(template.title)
    .setColor(0x00ae86)
    .setDescription(template.description)
    .setThumbnail(msg.guild.iconURL)
    .setFooter("Moister than an oyster..")
    .setTimestamp()
    .addField(
      `${client.emojis.find(emoji => emoji.name == template.tank.icon)} ${
        template.tank.title
      }`,
      template.tank.list
    )
    .addField(
      `${client.emojis.find(emoji => emoji.name == template.healer.icon)} ${
        template.healer.title
      }`,
      template.healer.list
    )
    .addField(
      `${client.emojis.find(emoji => emoji.name == template.dps.icon)} ${
        template.dps.title
      }`,
      template.dps.list
    );
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const login = async () => {
  for (let tries = 0; ; tries++) {
    try {
      client.login(process.env.TOKEN).catch(err => console.log(err));
      break;
    } catch (err) {
      if (tries < 10) {
        console.log("Login failed, sleeping");
        sleep(30000);
      } else throw err;
    }
  }
};

login();
