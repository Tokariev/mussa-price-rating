export interface EventData {
  externalCarId: string;
}

export class EventPayload {
  constructor(type: string, data: EventData) {
    this.type = type;
    this.data = data;
  }

  type: string;
  data: EventData;
}
