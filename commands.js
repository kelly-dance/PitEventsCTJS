import * as CM from '../CommandManager';
import { settings } from './settings'; 

const commandBuilder = CM.buildCommandHostBuilder({})

const setSubCommand = commandBuilder({
  name: 'set',
  aliases: ['s'],
  description: {
    short: 'Configure pit events settings',
  },
  subcommands: [
    {
      name: 'x',
      description: {
        full: 'Provide a number [0-100]. This is when the events hud will render horizontally. 0 is all the way left, and 100 is all the way right.',
        short: 'Position your events hud horizontally.'
      },
      fn(args){
        if(args.length === 0) return ChatLib.chat('Provide a number [0-100]. This is when the events hud will render. 0 is all the way left, and 100 is all the way right.');
        const percent = parseFloat(args[0]);
        if(isNaN(percent)) return ChatLib.chat('&cI couldn\'t understand that number, try again.')
        if(percent < -10 || percent > 150) return ChatLib.chat('&cPlease provide a number 0 <= x <= 100.')
        settings.x = percent;
        ChatLib.chat('&aSet.')
      },
      params: CM.paramOptionList(['0', '100']),
    },
    {
      name: 'y',
      description: {
        full: 'Provide a number [0-100]. This is when the events hud will render vertically. 0 is the top, and 100 is the bottom.',
        short: 'Position your events hud vertically.'
      },
      fn(args){
        if(args.length === 0) return ChatLib.chat('Provide a number [0-100]. This is when the events hud will render vertically. 0 is the top, and 100 is the bottom.');
        const percent = parseFloat(args[0]);
        if(isNaN(percent)) return ChatLib.chat('&cI couldn\'t understand that number, try again.')
        if(percent < -10 || percent > 150) return ChatLib.chat('&cPlease provide a number 0 <= x <= 100.')
        settings.y = percent;
        ChatLib.chat('&aSet.')
      },
      params: CM.paramOptionList(['0', '100']),
    },
    {
      name: 'horizonalalign',
      aliases: ['ha'],
      description: {
        full: 'Use either "left" or "right" to tell which direction to align against.',
        short: 'Set the horizonal alignment.'
      },
      fn(args){
        if(args.length === 0) return ChatLib.chat('Use either "left" or "right" to tell which direction to align against.');
        const input = args[0].toLowerCase();
        if(input != 'left' && input != 'right') return ChatLib.chat('Use either "left" or "right" to tell which direction to align against.');
        settings.alignHorizontal = input;
        ChatLib.chat('&aSet.')
      },
      params: CM.paramOptionList(['left', 'right']),
    },
    {
      name: 'verticalalign',
      aliases: ['va'],
      description: {
        full: 'Use either "top" or "bottom" to tell which direction to align against.',
        short: 'Set the vertical alignment.'
      },
      fn(args){
        if(args.length === 0) return ChatLib.chat('Use either "top" or "bottom" to tell which direction to align against.');
        const input = args[0].toLowerCase();
        if(input != 'top' && input != 'bottom') return ChatLib.chat('Use either "top" or "bottom" to tell which direction to align against.');
        settings.alignVertical = input;
        ChatLib.chat('&aSet.')
      },
      params: CM.paramOptionList(['top', 'bottom']),
    },
    {
      name: 'direction',
      aliases: ['d'],
      description: {
        full: 'Use either "down" or "up" to tell which direction events should be ordered.',
        short: 'Set the events order.'
      },
      fn(args){
        if(args.length === 0) return ChatLib.chat('Use either "down" or "up" to tell which direction events should be ordered.');
        const input = args[0].toLowerCase();
        if(input != 'down' && input != 'up') return ChatLib.chat('Use either "down" or "up" to tell which direction events should be ordered.');
        settings.reversed = input == 'up';
        ChatLib.chat('&aSet.')
      },
      params: CM.paramOptionList(['up', 'bottom']),
    },
    {
      name: 'limitmode',
      aliases: ['lm'],
      description: {
        full: 'Use either "events" or "time" to tell which category to limit displayed events by.',
        short: 'Set by what category events are ordered.'
      },
      fn(args){
        if(args.length === 0) return ChatLib.chat('Use either "events" or "time" to tell which category to limit displayed events by.');
        const input = args[0].toLowerCase();
        if(input != 'events' && input != 'time') return ChatLib.chat('Use either "events" or "time" to tell which category to limit displayed events by.');
        settings.limitMode = input;
        ChatLib.chat('&aSet. You may need to do /ct reload for it to take effect.');
      }
    },
    {
      name: 'timelimit',
      aliases: ['tl'],
      description: {
        full: 'Show events up to given number of minutes in the future.',
        short: 'Limit number of events by time.'
      },
      fn(args){
        if(args.length === 0) return ChatLib.chat('Provide a number of minutes for which to show events.');
        if(settings.limitMode != 'time') ChatLib.chat(`&cWarning: Your limitmode is currently set to "${settings.limitMode}" so this will not be in effect until you change that to "time".`)
        const time = parseFloat(args[0]);
        if(isNaN(time)) return ChatLib.chat('&cI couldn\'t understand that number, try again.')
        settings.timeLimit = time;
        ChatLib.chat('&aSet. You may need to do /ct reload for it to take effect.');
      }
    },
    {
      name: 'eventslimit',
      aliases: ['el'],
      description: {
        full: 'Show events up to given number of events in the future.',
        short: 'Limit number of events.'
      },
      fn(args){
        if(args.length === 0) return ChatLib.chat('Provide a number of events to show.');
        if(settings.limitMode != 'events') ChatLib.chat(`&cWarning: Your limitmode is currently set to "${settings.limitMode}" so this will not be in effect until you change that to "events".`)
        const time = parseFloat(args[0]);
        if(isNaN(time)) return ChatLib.chat('&cI couldn\'t understand that number, try again.')
        settings.eventsLimit = time;
        ChatLib.chat('&aSet. You may need to do /ct reload for it to take effect.');
      }
    },
    {
      name: 'api',
      description: {
        full: 'Don\'t do this if you don\'t know what you are doing. The API output needs to be identical to the default for it to work. Check GitHub for relevant info.',
        short: 'Use a different events API. (Advanced users)'
      },
      fn(args){
        if(args.length === 0) return ChatLib.chat('Provide a link ex: "https://events.mcpqndq.dev" or use "reset" to go back to the default.');
        if(args[0] === 'reset') {
          settings.api = 'https://events.mcpqndq.dev';
          ChatLib.chat('&aReset.')
        }else{
          settings.api = args[0];
          ChatLib.chat('&aSet. You may need to do /ct reload for it to take effect.');
        }
      }
    },
    {
      name: 'global',
      description: {
        full: 'Toggle events hud outside of pit. Default disabled.',
        short: 'Toggle events hud outside of pit.'
      },
      fn(args){
        if(args.length === 0) return ChatLib.chat('Use either "true" or "false" to enable or disable.');
        const input = args[0].toLowerCase();
        if(input != 'true' && input != 'false') return ChatLib.chat('Use either "true" or "false" to enable or disable.');
        settings.global = input === 'true';
        ChatLib.chat('&aSet. You may need to do /ct reload for it to take effect.');
      },
      params: CM.paramOptionList(['true','false']),
    },
    {
      name: 'boldmajors',
      description: {
        full: 'Toggle bold on major events on the events list. Default disabled.',
        short: 'Toggle bold on major events.'
      },
      fn(args){
        if(args.length === 0) return ChatLib.chat('Use either "true" or "false" to enable or disable.');
        const input = args[0].toLowerCase();
        if(input != 'true' && input != 'false') return ChatLib.chat('Use either "true" or "false" to enable or disable.');
        settings.boldMajors = input === 'true';
        ChatLib.chat('&aSet. You may need to do /ct reload for it to take effect.');
      },
    },
  ]
});

/** @type {{name:string, config: Partial<import('./settings').Settings>}[]} */
const presets = [
  {
    name: 'defaults',
    config: {
      alignHorizontal: 'left',
      alignVertical: 'top',
      x: 0,
      y: 0,
      reversed: false,
      limitMode: 'events',
      eventsLimit: 12,
      timeLimit: 60,
      global: false,
    },
  },
  {
    name: 'mcpqndqs',
    config: {
      alignHorizontal: 'right',
      alignVertical: 'bottom',
      x: 100,
      y: 100,
      reversed: true,
      limitMode: 'time',
      timeLimit: 60,
      global: true,
    },
  },
  {
    name: 'bottomright',
    config: {
      alignHorizontal: 'right',
      alignVertical: 'bottom',
      x: 100,
      y: 100,
      reversed: true,
    },
  },
  {
    name: 'topright',
    config: {
      alignHorizontal: 'right',
      alignVertical: 'top',
      x: 100,
      y: 0,
      reversed: false,
    },
  },
  {
    name: 'topleft',
    config: {
      alignHorizontal: 'left',
      alignVertical: 'top',
      x: 0,
      y: 0,
      reversed: false,
    },
  },
]

const piteventsCommand = commandBuilder({
  name: 'pitevents',
  subcommands: [
    {
      name: 'info',
      aliases: ['about'],
      description: {
        short: 'Info about the module.'
      },
      fn(){
        ChatLib.chat(new Message(
          'This module pulls events from an API hosted at: ',
          new TextComponent('&nhttps://events.mcpqndq.dev').setClickAction('open_url').setClickValue('https://events.mcpqndq.dev').setHoverAction('show_text').setHoverValue('Open Link')
        ))
        ChatLib.chat('');
        ChatLib.chat('In order to not bypass owning Pit Supporter this module uses a PitPanda API Key to ensure the user has Pit Supporter (or atleast an account with it).')
      }
    },
    {
      name: 'github',
      aliases: ['gh'],
      description: {
        short: 'Associated repositories.'
      },
      fn(){
        ChatLib.chat(new Message(
          'Repos: ',
          new TextComponent('&nThis Module').setClickAction('open_url').setClickValue('https://github.com/mcbobby123/PitEventsCTJS').setHoverAction('show_text').setHoverValue('Open Link &nhttps://github.com/mcbobby123/PitEventsCTJS'),
          '   ',
          new TextComponent('&nEvents API').setClickAction('open_url').setClickValue('https://github.com/mcbobby123/pit-events').setHoverAction('show_text').setHoverValue('Open Link &nhttps://github.com/mcbobby123/pit-events'),
          '   ',
          new TextComponent('&nPitPanda').setClickAction('open_url').setClickValue('https://github.com/PitPanda').setHoverAction('show_text').setHoverValue('Open Link &nhttps://github.com/PitPanda'),
        ))
      }
    },
    {
      name: 'preset',
      aliases: ['presets'],
      description: {
        short: 'Load a preset setting configuation.'
      },
      fn(args){
        const arg = args[0]?.toLowerCase() || 'list';
        if(arg === 'list'){
          ChatLib.chat(`&aThe available preset configs are: ${presets.map(c => c.name).join(', ')}.`)
        }else{
          const config = presets.find(c => c.name === arg);
          if(!config){
            ChatLib.chat('&cInvalid preset name. Use &a/pitevents presets &cto see available presets.')
            return;
          }
          for(const key in config.config){
            settings[key] = config.config[key];
          }
          ChatLib.chat('&aLoaded preset. May take a few seconds to take effect.')
        }
      },
      params: CM.paramOptionList(presets.map(c => c.name)),
    },
    setSubCommand,
  ]
});

CM.registerCommand(piteventsCommand);
