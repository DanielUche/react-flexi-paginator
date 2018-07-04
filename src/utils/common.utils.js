
export const isArrayEmpty = (item) => {
    return Array.isArray(item) && item.length;
}

export const compareArraySize = (item1, item2) => {
    return item1.length !== item2.length
}

export const conditionalPropType = (condition, message) => {
    if(typeof condition !== 'function') throw "Wrong argument type 'condition' supplied to 'conditionalPropType'";
    return function(props, propName, componentName) {
      if (condition(props, propName, componentName)) {
        console.log(propName);
        console.log(props);
        return new Error(`Invalid prop '${propName}'
            '${props[propName]}' supplied to '${componentName}'. ${message}`);
      }
    }
  }
 