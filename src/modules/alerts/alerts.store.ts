import { readFileSync } from 'fs';
import { join } from 'path';

export type Alert = {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  ack?: boolean;
};

const load = (): Alert[] => {
  const raw = readFileSync(join(__dirname, '../../dummyDB/alerts.json'), 'utf8');
  return JSON.parse(raw) as Alert[];
};

export class AlertsStore {
  private alerts = load();

  randomSubset() {
    const take = 1 + Math.floor(Math.random() * this.alerts.length);
    return this.alerts.slice(0, take).map((alert) => ({ ...alert, ack: alert.ack ?? false }));
  }

  all() {
    return this.alerts;
  }

  update(id: string, next: Alert) {
    this.alerts = this.alerts.map((a) => (a.id === id ? next : a));
  }
}
