/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import { onEnterPit, interval, registerOnce } from '../PitPanda/utils'
import { promptKey } from '../PitPandaApiKeyManager';
import { request } from '../requestV2';
import { Promise } from '../PromiseV2';
import { settings } from './settings';
import './commands';

const ScaledResolution = Java.type('net.minecraft.client.gui.ScaledResolution');

const eventColors = {
  'Blockhead': '&6',
  'Pizza': '&c',
  'Beast': '&a',
  'Robbery': '&6',
  'Spire': '&5',
  'Squads': '&b',
  'Team Deathmatch': '&5',
  'Raffle': '&6',
  'Rage Pit': '&c',
  '2x Rewards': '&2',
  'Giant Cake': '&d',
  'KOTL': '&a',
  'Dragon Egg': '&5',
  'Auction': '&e',
  'Quick Maths': '&5',
  'KOTH': '&b',
  'Care Package': '&6',
  'All bounty': '&6',
};

/**
 * @typedef {{
 *  timestamp: number,
 *  event: string,
 * }} Event
 */

/** @returns {Promise<Event[]>} */
const getEvents = () => promptKey('PitEvents').then(key => {
  if(!settings.api) settings.api = 'https://events.mcpqndq.dev';
  return request({
    url: settings.api,
    headers: {
      'X-API-Key': key,
    },
    json: true,
  });
});

/** @type {Event[]} */
let events = [];
/** @type {{shadow: string, actual: string, width: number}[]} */
let display = [];

/** @type {number} */
let originX;
/** @type {number} */
let originY;

let lastPoll = 0;

const updateStrings = () => {
  const now = Date.now();
  events = events.filter(e => e.timestamp > Date.now());
  let toUse;
  switch(settings.limitMode){
    default:
    case 'events': 
      const eventsLim = settings.eventsLimit || 12;
      toUse = events.slice(0, eventsLim)
      break;
    case 'time':
      const timeLim = settings.timeLimit || 60;
      toUse = events.filter(e => {
        const minutesTo = Math.round((e.timestamp - now) / 60e3);
        return minutesTo <= timeLim;
      });
      break;
  }
  display = toUse.map(e => {
    let minutesTo = Math.round((e.timestamp - now) / 60e3);
    const hours = Math.floor(minutesTo / 60);
    const minutes = minutesTo % 60;
    let timeString = '';
    if(hours) timeString += `${hours}h`;
    if(minutes) timeString += ` ${minutes}m`;
    if(!timeString) timeString = '0m';
    else timeString = timeString.trim();
    const shadow = `&0${e.event} ${timeString}`;
    const actual = `${eventColors[e.event]}${e.event} &9${timeString}`;
    const width = Renderer.getStringWidth(actual) + 1;
    return { shadow, actual, width };
  });
  const sr = new ScaledResolution(Client.getMinecraft())
  originX = sr.func_78327_c() * ((settings.x || 0) / 100); // getScaledWidth_double
  originY = sr.func_78324_d() * ((settings.y || 0) / 100); // getScaledHeight_double
  if(settings.alignVertical === 'bottom') originY -= 9;
  else originY += 1;
}

const handleLoad = () => {
  // Update event queue
  const reloadEvents = interval(() => {
    if(lastPoll + 8 * 60e3 > Date.now()) return; 
    getEvents().then(newEvents => {
      events = newEvents
      lastPoll = Date.now();
      updateStrings();
    });
  }, 10 * 60e3); // 10 minutes

  // Update hud strings
  const reloadDisplay = interval(updateStrings, 10e3); // 10 seconds

  // render hud
  const renderOverlay = register('renderOverlay', () => {
    const isLeft = settings.alignHorizontal === 'left';
    const reversed = !!settings.reversed;
    const dy = settings.alignVertical === 'top' ? 10 : -10;
    for(let i = 0; i < display.length; i++){
      let line = display[reversed ? display.length - i - 1: i];
      if(isLeft){
        Renderer.drawString(line.shadow, 1 + originX + 1, originY + i * dy + 1);
        Renderer.drawString(line.actual, 1 + originX, originY + i * dy);
      }else{
        Renderer.drawString(line.shadow, originX - line.width + 1, originY + i * dy + 1);
        Renderer.drawString(line.actual, originX - line.width, originY + i * dy);
      }
    }
  });

  // cleanup after leaving pit
  return () => {
    reloadEvents.cancel();
    reloadDisplay.cancel();
    renderOverlay.unregister();
  };
};

if(settings.global) register('gameLoad', () => registerOnce('gameUnload', handleLoad()));
else onEnterPit(handleLoad);
