# while promised

A small library to make *asyncronous loops* for `Promise` based functions.

You could use it as a wrapper to do *polling* or if you would like to loop but the function is asyncronous.

## Usage


### Installation
Install with `npm`. 
```bash
npm install while-promised
```

*Require* in you code. 
```js
var whilePromised = require('while-promised');

whilePromised(yourFunction);
```

### Example
```js
let cnt = 0;

function counter() {
	return new Promise((resolve, reject) => {
		setImmediate(resolve, ++cnt);	
	});
}

// Loop while resolved until is 6
whilePromised(counter, 6)
	.then(function(value) {
		console.log('Values is: ' + value);
	});
```

### API
This is the *API* of this library. The function returns a `Promise` and is *thenable* for when the loop finishes.

```js
whilePromised(fn)
	.then(function() {
		// Do something
	});
```

#### Resolve to false
The simplest while loop for *resolved value* `!== false`.
```js
whilePromised(fn);
```

This is comparable to:
```js
var a = true;
while(a) {
	a = fn();
}
```

#### Resolve to value
Loop while *resolved value* `!== stopVal`.
```js
whilePromised(fn, stopVal);
```

This is comparable to:
```js
var a = 0;
while(a !== 10) {
	a = fn();
}
```

#### Compare function
Loop while `compareFn` *returns* `true`
```js
whilePromised(fn, compareFn);
```

This is comparable to:
```js
while(compareFn) {
	fn();
}
```

## Contribute
Please do! Write in `es6` and transpile to `es5` with `npm run build`. 

## License
**MIT** &copy; Jacob Carlsson