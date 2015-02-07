import 'core-js/shim';

import {expect} from 'chai';
import whilePromised from '../lib/while-promised';

describe('whilePromised', () => {

	it('should loop while promise resolves to value !== false', function() {

		let cnt = 0;

		function counter() {
			return new Promise((resolve, reject) => {

				if(cnt > 5) {
					setImmediate(resolve, false);
					return;
				}

				setImmediate(resolve, ++cnt);
			});
		}

		// Loop while promise is not returning false
		return whilePromised(counter)
			.then(value => {
				expect(cnt).to.equal(6);
				expect(value).to.equal(false);
			});
	});

	it('should loop while promise does not resolve to value', () => {
		let cnt = 0;

		function counter() {
			return new Promise((resolve, reject) => {
				setImmediate(resolve, ++cnt);	
			});
		}

		// Loop while resolved value is not 6
		return whilePromised(counter, 6)
			.then(value => {
				expect(cnt).to.equal(6);
				expect(value).to.equal(6);
			});
	});

	it('should loop with compare function', () => {
		let cnt = 0;

		function counter() {
			return new Promise((resolve, reject) => {
				if(cnt === 4) {
					setImmediate(resolve, 'done');
					return;
				}

				setImmediate(resolve, ++cnt);
			});
		}

		return whilePromised(counter, (value) => {
				return value !== 'done';
			})
			.then(value => {
				expect(cnt).to.equal(4);
				expect(value).to.equal('done');
			});
	});

	it('should stop on reject', () => {
		let cnt = 0;

		function counter() {
			return new Promise((resolve, reject) => {
				if(cnt === 4) {
					reject(new Error('Stop loop'));
					return;
				}

				setImmediate(resolve, ++cnt);
			});
		}

		return whilePromised(counter)
			.catch(err => {
				expect(cnt).to.equal(4);
				expect(err).to.be.instanceof(Error);
			});
	});
});