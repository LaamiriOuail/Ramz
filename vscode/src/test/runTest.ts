import * as path from 'path';
import * as mocha from 'mocha';
import { runTests } from './suite';

export function run(): Promise<void> {
    // Create the mocha test
    const mocha = new mocha({
        ui: 'tdd',
        color: true
    });

    const testsRoot = path.resolve(__dirname, '..', '..');

    return mocha.runAsync([
        testsRoot + '/test/suite/**/*.test.js'
    ]);
}