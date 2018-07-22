export const isObject = value => typeof value === 'object';

export const isFunction = f => typeof f === 'function';

export const isNumber = n => typeof Number(n) === 'number' && !isNaN(n);

export const isUndefined = v => typeof v === 'undefined';

export const firstOf = arr => arr[0];

export const copyOf = o => ({ ...o });

export const reducePath = path => path.split('.').slice(1).join('.');

export const filter = arr => arr.filter(v => !isUndefined(v));

export const purifyNode = node => node.replace(/\[.*\]/, '');

export const replaceByIndex = (arr, index, nextValue) =>
  filter(arr.map((value, i) => index !== i ? value : nextValue));

export const replaceByValue = (arr, currentValue, nextValue) =>
  filter(arr.map(value => value !== currentValue ? value : nextValue));

export const getNextValue = (currentValue, _value) =>
  isFunction(_value) ? _value(currentValue) : _value;
