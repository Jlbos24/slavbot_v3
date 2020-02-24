// It's slav time
const Discord = require('discord.js');
const fs = require('fs').promises;
const client = new Discord.Client();
const { prefix, TOKEN, ADMIN_ID } = require('./config.json');
const { playSound, randSound } = require('./slavsound');
const { createSoundManifest } = require('./slav_utils');
const soundManifest = require('./sound_manifest');

client.once('ready', () => {
  console.log('READY!');
});

// When get message, do thing
client.on('message', async message => {
  // If message author is bot or no prefix, don't do thing
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  // Strip prefix from message to get command
  const command = message.content.substring(1);

  // Log some info to console
  console.log('----------');
  const timeStamp = new Date();
  console.log(timeStamp.toLocaleDateString(), timeStamp.toLocaleTimeString());
  console.log(`User: ${message.author.username}`);
  console.log(`Admin: ${message.author.id === ADMIN_ID}`);
  console.log(`Command: ${command}`);

  // Create possible list of sound commands based on if user is admin
  let soundCommands = soundManifest.regularSounds;
  if (message.author.id === ADMIN_ID) {
    soundCommands += soundManifest.randSounds;
  }

  // Admin commands
  if (command === 'create' && message.author.id === ADMIN_ID) {
    createSoundManifest();
  } else if (command === 'read' && message.author.id === ADMIN_ID) {
    console.log(soundManifest);
  }

  // User commands

  // Random sounds
  // Random sound picked from all lists
  else if (command === 'rand') {
    randSound([soundManifest.regularSounds, soundManifest.randSounds], message);
  }
  // Random sound picked from anomaly sound list
  else if (command === 'randomaly') {
    randSound(soundManifest.anomalySounds, message);
  }
  // Random sound picked from anime sound list
  else if (command === 'randime') {
    randSound(soundManifest.animeSounds, message);
  }

  // Specific sound command
  // Check if command is referencing a sound using array we made earlier
  else if (soundCommands.includes(command)) {
    console.log(`playing sound ${command}`);
    playSound(command, message);
  }

  // If command not recognised
  else {
    message.author.send(`"${command}" is not a recognised command, урод.`);
    console.log('Command not recognised');
  }
  //delete message when done
  message.delete();
});

client.on('voiceStateUpdate', (oldState, newState) => {
  if (oldState.id === client.user.id) {
    return;
  }
  const oldStateChannel = oldState.channel;
  const newStateChannel = newState.channel;

  if (oldStateChannel === null) {
    console.log(
      `${newState.member.user.username} has joined ${newStateChannel.name}`
    );
  } else if (newStateChannel === null) {
    console.log(
      `${newState.member.user.username} has left ${oldStateChannel.name}`
    );
  }
});

client.login(TOKEN);

module.exports = { client };
