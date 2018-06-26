/**
 * @license
 *
 * Copyright (c) 2018, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

import * as fs from 'fs';
import * as nunjucks from 'nunjucks';
import { RenderStrategy } from './types';
import { Util } from '../utils';

export class DeviceStatusRenderer implements RenderStrategy {
    constructor(private result: object) {}

    render(): string {
        let templatePath = Util.getOSDependentPath('../../resources/html-templates/temp-devices-status.html');

        let resultString = this.result.toString().replace(/'/g, '"');
        let execResult = JSON.parse(String(resultString));

        if (execResult[0].hasOwnProperty('status')) {
            return this.createDeviceStatus(execResult, templatePath);
        } else {
            return `${this.result}`;
        }
    }

    createDeviceStatus(devices: Array<Device>, templatePath: string): string {
        let template = fs.readFileSync(templatePath, { encoding: 'utf8' });
        let sortFunction = (a, b) => this.sortWeight(a) - this.sortWeight(b);

        if (template !== undefined) {
            let context = {
                devices: devices.sort(sortFunction)
            };

            nunjucks.configure({ autoescape: false });
            return nunjucks.renderString(template, context);
        } else {
            return `<pre>${devices}</pre>`;
        }
    }

    sortWeight(device: Device) {
        let weightsDictionary = {
            ibmq_qasm_simulator: 100,
            ibmqx2: 50,
            ibmqx4: 30,
            ibmqx5: 10
        };

        return weightsDictionary[device.status.name] || 1;
    }
}

interface Device {
    name: string;
    status: Status;
}

interface Status {
    available: boolean;
    name: string;
    pending_jobs: number;
}
