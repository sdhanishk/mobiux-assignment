const assert = require('assert');
const computeInterface = require('../compute.js');

describe('Compute iterface test cases', () => {
    describe('#getDateObjectFromDateString', () => {
        it('Expect to return the date object for the given string', () => {

            const dateObject = computeInterface.getDateObjectFromDateString('2020-02-29');

            assert.deepEqual(dateObject, {
                date: '29',
                month: '02',
                year: '2020'
            })

        });
        it('Expect to throw error if the date string is invalid', () => {

            assert.throws(() => {computeInterface.getDateObjectFromDateString('2020')}, Error, 'INVALID_DATE_STRING');

        });
        it('Expect to throw error if the passed date string is not of type string', () => {

            assert.throws(() => {computeInterface.getDateObjectFromDateString(2020)}, Error, 'STRING_REQUIRED');

        });
    });
});