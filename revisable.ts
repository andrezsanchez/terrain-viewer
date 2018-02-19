export const InitialRevision = Symbol();
export type Notifier = () => void;
export class Revisable {
  public revision:symbol = InitialRevision;
  public observers:Set<Notifier> = new Set();

  observe(notifier:Notifier):Notifier {
    this.observers.add(notifier);
    return notifier;
  }

  unobserve(notifier:Notifier):boolean {
    return this.observers.delete(notifier);
  }
  revise() {
    this.revision = Symbol();
    this.observers.forEach((observer) => observer());
  }
}
