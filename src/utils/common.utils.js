/**
 * @param {array} array array you want to remove objects from
 * @param {string} key key to search the array by 
 * @param {string | number } value value of the key
 * @returns {array} filtered array.
 */
export const removeObjectFromArrayOfObject = (array, key, value) => {
    return array.filter(e => e[key] !== value);
}
/**
 * @param {string} key key field to search the array by 
 * @param {obj} obj object you want to check for its existence 
 * @param {array} list array of objects to search 
 * @returns {boolean} returns true or false.
 */
export const arrayContainsObject = (key, obj, list) => {
    let i;
    for (i = 0; i < list.length; i++) {
        if (list[i][key] === obj[key]) {
            return true;
        }
    }
    return false;
}

export const toTitleCase = (phrase) => {
    return phrase
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
};

export const filterObject = (objArray, key, value ) => {
    var obj = objArray.filter(function (obj) { 
        return obj[key] === value;
    });
    return obj;
}

export const isArrayEmpty = (item) => {
    return Array.isArray(item) && item.length;
}

export const compareArraySize = (item1, item2) => {
    return item1.length !== item2.length
}
 