let aggregation = (baseClass: any, ...mixins: any[]) => {
  class base extends baseClass {
    constructor (...args: any) {
      super(...args);
      mixins.forEach((mixin) => {
        copyProps(this,(new mixin));
      });
    }
  }
  let copyProps = (target:any, source: any) => {  // this function copies all properties and symbols, filtering out some special ones
    Object.getOwnPropertyNames(source)
      // @ts-ignore
      .concat(Object.getOwnPropertySymbols(source))
      .forEach((prop) => {
        if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
          { // @ts-ignore
            Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
          }
      })
  }
  mixins.forEach((mixin) => { // outside contructor() to allow aggregation(A,B,C).staticFunction() to be called etc.
    copyProps(base.prototype, mixin.prototype);
    copyProps(base, mixin);
  });
  return base;
}

export {aggregation}
