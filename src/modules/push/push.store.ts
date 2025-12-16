type StoredSubscription = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export class PushStore {
  private readonly subs = new Map<string, StoredSubscription>();

  all() {
    return Array.from(this.subs.values());
  }

  save(sub: StoredSubscription) {
    if (!this.subs.has(sub.endpoint)) {
      this.subs.set(sub.endpoint, sub);
    }
    return { ok: true };
  }
}
