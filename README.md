Update by path
===
This function allows you to update fields of your object any level deep without mutating the original object.

### Features
- update a field of an object any level deep by using a shorthand path string;
- insert new values any level deep using the shorthand path string (not existing path nodes will be created automatically);
- overwrite fields, if they already exist;

### Installation
`npm install --save update-by-path`

Then using es6 import the function:
```javascript
import update from 'update-by-path';
```

### Usage
Lets say we have an object like down below:
```javascript
const person = {
  name: 'John Doe',
  job: {
    company: 'MadAppGang',
    position: 'Software engineer',
    since: {
      year: 2018,
      month: 8,
      day: 14,
    },
    skills: ['html', 'css', 'javascript'],
  },
};
```
If I wanted to update, for example, the month John started the position at MadAppGang, I would have to write something like this:

```javascript
const updatedPerson = {
  ...person,
  job: {
    ...person.job,
    since: {
      ...person.job.since,
      month: 7,
    },
  },
};
```
This does not look compact at all, so there is a way to get rid of that massive piece of code.

Using the shorthand function the code will look like the following:
```javascript
const updatedPerson = update(person, 'job.since.month', 7);
```

I can also update multiple fields at once using a slightly different notation:
```javascript
const updatedPerson = update(person, {
  'job.since.month': 7,
  'job.position': 'Software architect',
});
```

If you I need to apply more complex logic i can pass a function as a value. The function accepts the current value and should return a new one.

```javascript
const updatedPerson = update(person, {
  'job.since.month': month => month + 2,
  'job.position': 'Software architect',
});
```

I also have an ability to reach array elements by specifying the value I am interested in surrounded by brackets:

```javascript
const updatedPerson = update(person, {
  'job.skills[html]': 'HTML',
  'job.skills[css]': value => value.toUpperCase(), // CSS
});
```

Or by index:

```javascript
const updatedPerson = update(person, 'job.skills[0]', v => v.toUpperCase()); // HTML
```

##### Note: the function does not mutate the original object


You should just specify a string path to the property you want to update. Path is a list of nested properties joined by dot.

An example of path string: `'path.to.a.property.any.level.deep'`

If the original object does not contain properties, specified in the path string - they will be created for you automatically.

So the call
```javascript
update({}, 'any.level.deep', 'insertion');
```
will produce the next result:
`{ any: { level: { deep: 'insertion' } } }`

### Why should I use this?
It really helps to reduce a huge amount of code, especially when you have to make a lot of updates to deep immutable objects. It can be very useful in Redux with its reducers.

### Parameters
- `original object` [String](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/String "String") The object to update;
- `path string`  [String](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/String "String") | [Object](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object "Object") Path string, that consists of a list of properties joined by dot; Or it can be an object where keys are paths and values are values for the paths.
- `value` Any? The value to insert; You won't need to specify this if you use an object as a second argument.

Value can be a function that accepts current value (if present) and returns a new one.

Returns updated object;

### Contribute
First off, thanks for taking the time to contribute! Now, take a moment to be sure your contributions make sense to everyone else.

This is written with plain javascript so you will not need any additional environment to run this.