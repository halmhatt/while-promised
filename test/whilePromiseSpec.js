import {Promise} from 'es6-promise';
import chai from 'chai';
import whilePromised from '../lib/while-promised';
import chaiAsPromised from 'chai-as-promised';

let expect = chai.expect;

chai.use(chaiAsPromised);

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

		let p = whilePromised(counter);

		// Loop while promise is not returning false
		return Promise.all([
				expect(p).to.not.be.rejected,
				expect(p).to.be.fulfilled.then((value) => {
					expect(cnt).to.equal(6);
					expect(value).to.equal(false);
				})
			]);
	});

	it('should loop while promise does not resolve to value', () => {
		let cnt = 0;

		function counter() {
			return new Promise((resolve, reject) => {
				setImmediate(resolve, ++cnt);	
			});
		}

		let p = whilePromised(counter, 6);

		// Loop while resolved value is not 6
		return Promise.all([
				expect(p).not.to.be.rejected,
				expect(p).to.be.fulfilled.then((value) => {
					expect(cnt).to.equal(6);
					expect(value).to.equal(6);
				})
			]);
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

		let p = whilePromised(counter, (value) => {
				return value !== 'done';
			});

		return Promise.all([
				expect(p).to.not.be.rejected,
				expect(p).to.be.fulfilled.then((value) => {
					expect(value).to.equal('done');
				}),
				expect(p).to.be.fulfilled.then(() => {
					expect(cnt).to.equal(4);
				})
			]);
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

		let p = whilePromised(counter);

		return Promise.all([
				expect(p).to.eventually.be.rejectedWith(Error, 'Stop loop'),
				expect(p).not.to.be.fulfilled,
				expect(p).to.be.rejected.then(() => {
					expect(cnt).to.equal(4)
				})
			]);
	});
});