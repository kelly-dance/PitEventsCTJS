import PDObject from '../PersistentData';

const moduleName = 'PitEvents';

/**
 * @typedef {{
 *  alignHorizontal: 'left' | 'right',
 *  alignVertical: 'top' | 'bottom',
 *  x: number,
 *  y: number,
 *  reversed: boolean,
 *  limitMode: 'events' | 'time',
 *  eventsLimit: number,
 *  timeLimit: number,
 *  api: string,
 *  global: boolean,
 * }} Settings
 */

/** @type {Partial<Settings>} */
export const settings = new PDObject(moduleName, {
  alignHorizontal: 'left',
  alignVertical: 'top',
  x: 0,
  y: 0,
  reversed: false,
  limitMode: 'events',
  eventsLimit: 12,
  timeLimit: 60,
  api: 'https://events.mcpqndq.dev',
  global: false,
  boldMajors: false,
}, 'settings.json');
