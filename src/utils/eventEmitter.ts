interface EventHandler<T> {
  (data: T): void;
}

class EventEmitter<T> {
  private eventHandlers: Map<string, EventHandler<T>[]>;

  constructor() {
    this.eventHandlers = new Map<string, EventHandler<T>[]>();
  }

  on(eventName: string, handler: EventHandler<T>): void {
    if (!this.eventHandlers.has(eventName)) {
      this.eventHandlers.set(eventName, []);
    }
    const handlers = this.eventHandlers.get(eventName);
    handlers?.push(handler);
  }

  off(eventName: string, handler?: EventHandler<T>): void {
    if (!this.eventHandlers.has(eventName)) {
      return;
    }
    if (handler) {
      const handlers = this.eventHandlers.get(eventName);
      const index = handlers?.indexOf(handler);
      if (index !== undefined && index >= 0) {
        handlers?.splice(index, 1);
      }
    } else {
      this.eventHandlers.set(eventName, []);
    }
  }

  emit(eventName: string, data: T): void {
    if (!this.eventHandlers.has(eventName)) {
      return;
    }
    const handlers = this.eventHandlers.get(eventName);
    handlers?.forEach((handler) => handler(data));
  }
}

export default EventEmitter;
