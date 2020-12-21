export abstract class ValueType {
  public label: string;
  public value: string;
  constructor(label: string, value: string) {
    this.label = label;
    this.value = value;
  }
  public getValue(value: any): any {
    if (!value || value == null || value instanceof Object !== true) {
      return value;
    } else {
      return value[this.value];
    }
  }
  public setValue(options: any[], value: any): any {
    if (options && options !== null && options.length > 0 && value !== undefined) {
      for (const i of options) {
        if (i instanceof Object !== true) {
          return value;
        }
        if (i[this.value] !== undefined && i[this.value] === value) {
          return i;
        }
      }
      return null;
    } else {
      return value;
    }
  }
  public transFromParam(urlParam: string): any {
    return urlParam;
  }
}
export class ValueTypeString extends ValueType {
  constructor(label: string, value: string) {
    super(label, value);
  }
}
export class ValueTypeNumber extends ValueType {
  constructor(label: string, value: string) {
    super(label, value);
  }
  public transFromParam(urlParam: string): any {
    if (!isNaN(parseFloat(urlParam))) {
      return parseFloat(urlParam);
    } else {
      return null;
    }
  }
}
export class ValueTypeObject extends ValueType {
  constructor(label: string, value: string) {
    super(label, value);
  }
  public getValue(value: any): any {
    // console.log(value);
    return this.value && value !== null ? value[this.value] : value;
  }
  public setValue(options: any[], value: object): any {
    if (this.value && options && options.length > 0) {
      for (const i of options) {
        if (i[this.value] === value) {
          return i;
        }
      }
      return value;
    } else {
      return value;
    }
  }

  public transFromParam(urlParam: string): any {
  }
}

export class ValueTypeSingleLetter extends ValueType {
  constructor(label: string, value: string) {
    super(label, value);
  }
}