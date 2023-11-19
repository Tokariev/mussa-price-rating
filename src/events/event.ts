interface Data {
  id: number;
}

export class EventPayload {
  constructor(type: string, data: Data) {
    this.type = type;
    this.data = data;
  }

  type: string;
  data: Data;
}
