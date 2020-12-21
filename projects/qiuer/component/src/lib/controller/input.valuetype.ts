export abstract class ValueType {
  public type: string;
  constructor() { }
  public setValue(value: any): any {
    return value;
  }
  public transFromParam(urlParam: string): any {
    const param = urlParam;
    return param;
  }

}
export class ValueTypeString extends ValueType {
  constructor() {
    super();
    this.type = 'string';
  }
}
export class ValueTypeNumber extends ValueType {
  constructor() {
    super();
    this.type = 'number';
  }
  public setValue(value: any): any {
    if (!isNaN(value - 0)) {
      return value;
    } else {
      console.error('value:' + value + '变量不是Number类型,无法赋值给numberInput');
      return null;
    }
  }
  public transFromParam(urlParam: string): any {
    const param = urlParam;
    return parseFloat(param);
  }
}
export class ValueTypePassword extends ValueType {
  constructor() {
    super();
    this.type = 'password';
  }
}
export class ValueTypeEmail extends ValueType {
  constructor() {
    super();
    this.type = 'email';
  }
}
