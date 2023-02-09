import * as fs from 'fs';

interface Valve {
  name: string;
  flow: number;
  adjacent: string[];
}
const valvesMap: Record<string, Valve> = {};

const data = fs.readFileSync('16-input.txt', { encoding: 'utf-8' });
const valves = data.split('\n').map((line): Valve => {
  const splits = line.split('; ');
  const [name, flow] = splits[0].replace(/Valve (\w) has flow rate=(\d+)/, '$1,$2');
  const adjacent = splits[1].replace('tunnels lead to valves ', '').split(', ');
  const valve = {
    name,
    flow: parseInt(flow),
    adjacent,
  };
  valvesMap[name] = valve;
  return valve;
});
console.log(valves)
