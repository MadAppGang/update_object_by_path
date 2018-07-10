const isObject = value => typeof value === 'object';
const isFunction = f => typeof f === 'function';
const isNumber = n => typeof Number(n) === 'number' && !isNaN(n);
const isUndefined = v => typeof v === 'undefined';
const firstOf = arr => arr[0];
const copyOf = o => ({ ...o });
const reducePath = path => path.split('.').slice(1).join('.');
const filter = arr => arr.filter(v => !isUndefined(v));
const replaceByIndex = (arr, index, nextValue) =>
  filter(arr.map((value, i) => index !== i ? value : nextValue));
const replaceByValue = (arr, currentValue, nextValue) =>
  filter(arr.map(value => value !== currentValue ? value : nextValue));
const getNextValue = (currentValue, _value) =>
  isFunction(_value) ? _value(currentValue) : _value;

const ARRAY_QUERY_REGEX = /\[(\w+)\]/;
const ARRAY_QUERY_BY_PROP_REGEX = /\[(\w+)=(\w+)\]/;

const purifyNode = node => node.replace(/\[.*\]/, '');

const update = (source, path, value) => {
  if (isObject(path)) {
    const config = path;

    return Object.keys(config)
      .reduce((output, key) => update(output, key, config[key]), source);
  }

  const output = copyOf(source);
  const pathNodes = path.split('.');
  let node = firstOf(pathNodes);

  const isLastNode = pathNodes.length === 1;

  if (isLastNode) {
    const pureNode = purifyNode(node);

    if (Array.isArray(output[pureNode])) {
      const arr = output[pureNode];
      const arrayQueryMatch = node.match(ARRAY_QUERY_REGEX);
      const queryByPropMatch = node.match(ARRAY_QUERY_BY_PROP_REGEX);

      if (arrayQueryMatch) {
        const query = arrayQueryMatch[1];

        if (isNumber(query)) {
          // searching by index
          const index = Number(query);
          const currentValue = arr[index];
          const nextValue = getNextValue(currentValue, value);
          output[pureNode] = replaceByIndex(arr, index, nextValue);
        } else {
          // searching by value
          const currentValue = arr.find(v => v === query);
          const nextValue = getNextValue(currentValue, value);
          output[pureNode] = replaceByValue(arr, query, nextValue);
        }
      }

      if (queryByPropMatch) {
        const [key, val] = queryByPropMatch.slice(1, 3);
        const currentValue = arr.find(v => v[key] === val);
        const nextValue = getNextValue(currentValue, value);
        output[pureNode] = replaceByValue(arr, currentValue, nextValue);
      }

      return output;
    } else {
      output[pureNode] = getNextValue(output[pureNode], value);
      return output;
    }

  }

  const currentValue = output[node];

  let nextSource;

  if (isObject(currentValue)) {
    nextSource = copyOf(currentValue);
  } else {
    if (isLastNode) {
      nextSource = value;
    } else {
      const pureNode = purifyNode(node);
      const arr = output[pureNode];
      const arrayQueryMatch = node.match(ARRAY_QUERY_REGEX);
      const queryByPropMatch = node.match(ARRAY_QUERY_BY_PROP_REGEX);

      if (arrayQueryMatch) {
        const query = arrayQueryMatch[1];

        if (isNumber(query)) {
          // searching by index
          const index = Number(query);
          const currentValue = arr[index] || {};
          const nextValue = update(currentValue, reducePath(path), value);
          output[pureNode] = replaceByIndex(arr, index, nextValue);
        } else {
          // searching by value
          let currentValue = arr.find(v => v === query);

          if (!isObject(currentValue)) {
            currentValue = {};
          }

          const nextValue = update(currentValue, reducePath(path), value);
          output[pureNode] = replaceByValue(arr, query, nextValue);
        }

        return output;
      }

      if (queryByPropMatch) {
        const [key, val] = queryByPropMatch.slice(1, 3);
        const currentValue = arr.find(item => item[key] == val) || {};
        const nextValue = update(currentValue, reducePath(path), value);
        output[pureNode] = replaceByValue(arr, currentValue, nextValue);
        return output;
      }

      nextSource = {};
    }
  }

  output[node] = update(nextSource, reducePath(path), value);

  return output;
};

export default update;