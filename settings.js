import PDObject from '../PersistentData';

const moduleName = 'PitEvents';

/** @type {Partial<{
 *  alignHorizontal: 'left' | 'right',
 *  alignVertical: 'top' | 'bottom',
 *  x: number,
 *  y: number,
 *  reversed: boolean,
 *  limitMode: 'events' | 'time',
 *  eventsLimit: number,
 *  timeLimit: number,
 *  api: string,
 * }>} */
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
}, 'settings.json');
