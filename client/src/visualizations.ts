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
import * as vscode from 'vscode';
import { Util } from './utils';
import { QLogger } from './logger';
import { HistogramRenderer } from './visualizations/histogramRenderer';
import { PreformattedRenderer } from './visualizations/preformattedRenderer';

export namespace VizManager {
    export function createViz(codePath: string, result: object): string {
        let config = vscode.workspace.getConfiguration('ibm-q-studio');
        let visualizationsFlag = config.get('config.visualizationsFlag');
        let visualizationType: string;
        if (visualizationsFlag === false) {
            visualizationType = 'TEXT';
        } else {
            visualizationType = this.detectProperViz(codePath);
        }

        if (visualizationType === 'HISTOGRAM') {
            QLogger.verbose('Histogram detected', this);

            let renderer = new HistogramRenderer(result);
            return renderer.render();
        } else if (visualizationType === 'TEXT') {
            QLogger.verbose('Text detected', this);

            let renderer = new PreformattedRenderer(result);
            return renderer.render();
        } else if (visualizationType === 'STATUS') {
            QLogger.verbose('Device status detected', this);
            let templatePath = Util.getOSDependentPath('../../resources/html-templates/temp-devices-status.html');

            let resultString = result.toString().replace(/'/g, '"');
            let execResult = JSON.parse(String(resultString));

            if (execResult[0].hasOwnProperty('status')) {
                return VizManager.createDeviceStatus(execResult, templatePath);
            } else {
                return `${result}`;
            }
        } else {
            return `${result}`;
        }
    }

    export function detectProperViz(codePath: string): string {
        let codeFile = undefined;

        //console.log("codePath", codePath);
        if (codePath === Util.getOSDependentPath('../../resources/qiskitScripts/listRemoteBackends.py')) {
            return 'STATUS';
        }

        codeFile = fs.readFileSync(codePath, { encoding: 'utf8' });
        if (codeFile !== undefined) {
            // console.log(codeFile);
            codeFile = codeFile.split('\n');
            codeFile = codeFile.filter(Boolean);

            let codeFileArray: Array<string> = [];

            for (let key in codeFile) {
                codeFileArray.push(codeFile[key]);
            }

            // console.log(codeFileArray);
            let codeFileArrayRev = codeFileArray.reverse();

            for (let i = 0; i < codeFileArrayRev.length; i++) {
                if (
                    new RegExp(/^\/\/.*/g).test(codeFileArrayRev[i]) === true ||
                    new RegExp(/^#.*/g).test(codeFileArrayRev[i]) === true
                ) {
                    //Comment to end the file, go to the next line
                } else if (new RegExp(/^ *print\(.*\.get_counts\(.*\)\)/g).test(codeFileArrayRev[i]) === true) {
                    // If the result is printed using the get_counts, the proper viz to show is the histogram
                    return 'HISTOGRAM';
                } else if (new RegExp(/^ *print\(.*\._result.*\)\)/g).test(codeFileArrayRev[i]) === true) {
                    // If the result is printed using the _result (probably using QASM), the proper viz to show is the histogram
                    return 'HISTOGRAM';
                } else {
                    // If we don't find the proper viz method, continue seeking for that.
                    // If the array ends without a proper result, we will render it as text.
                }
            }
            return 'TEXT';
        } else {
            return 'TEXT';
        }
    }

    export function createDeviceStatus(devicesArray: Array<object>, templatePath: string): string {
        let html = undefined;
        html = fs.readFileSync(templatePath, { encoding: 'utf8' });
        if (html !== undefined) {
            devicesArray.forEach(element => {
                let str2Replace = `<small class="">[${
                    element['status']['name']
                }]</small></span><div class="pull-right"><ibm-q-tag ng-class="{'label-danger': $ctrl.backendStatus[backend.name].tag.color === 'danger','label-success': $ctrl.backendStatus[backend.name].tag.color === 'success','label-info': $ctrl.backendStatus[backend.name].tag.color === 'info'}"ng-show="$ctrl.backendStatus[backend.name].tag" class="label-success">Active: Calibrating</ibm-q-tag>`;
                let str2ReplaceSimulator = `<small class="">[${
                    element['status']['name']
                }]</small></span><div class="pull-right"><ibm-q-tag class="label-success">ACTIVE</ibm-q-tag>`;

                let statusTag = 'label-success';
                let statusMessage = 'Active';
                if (element['status']['available'] === false) {
                    statusTag = 'label-danger';
                    statusMessage = 'Maintenance';
                }

                let replacement = `<small class="">[${
                    element['status']['name']
                }]</small></span><div class="pull-right"><ibm-q-tag ng-class="{'label-danger': $ctrl.backendStatus[backend.name].tag.color === 'danger','label-success': $ctrl.backendStatus[backend.name].tag.color === 'success', 'label-info': $ctrl.backendStatus[backend.name].tag.color === 'info'}" ng-show="$ctrl.backendStatus[backend.name].tag" class="${statusTag}">${statusMessage}</ibm-q-tag>`;
                let replacementSimulator = `<small class="">[${
                    element['status']['name']
                }]</small></span><div class="pull-right"><ibm-q-tag class="${statusTag}">${statusMessage}</ibm-q-tag>`;

                let str2ReplacePendingJobs = `<div class="pull-right"><ibm-q-tag class="label-info">Jobs pending [${
                    element['status']['name']
                }]: 0</ibm-q-tag></div>`;
                let replacementPendingJobs = `<div class="pull-right"><ibm-q-tag class="label-info">Jobs pending: ${
                    element['status']['pending_jobs']
                }</ibm-q-tag></div>`;

                html = html.replace(str2Replace, replacement);
                html = html.replace(str2ReplaceSimulator, replacementSimulator);
                html = html.replace(str2ReplacePendingJobs, replacementPendingJobs);
            });
            return html;
        } else {
            return `<pre>${devicesArray}</pre>`;
        }
    }
}
