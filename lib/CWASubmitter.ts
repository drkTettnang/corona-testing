import axios from 'axios';
import { Agent } from 'https';
import fs from 'fs';
import CWA from './CWA';
import Config from './Config';
import { AgentOptions } from 'node:https';

enum CWAResult {
    negativ = 6,
    positiv = 7,
    invalid = 8,
}

const sleep = (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds));

export class CWASubmitter {
    public static isEnabled(): boolean {
        return Config.CWA && !!process.env.CWA_SERVER && !!process.env.CWA_CLIENT_CRT && !!process.env.CWA_CLIENT_KEY;
    }

    public static async submitResult(cwa: CWA, result: 'invalid' | 'unknown' | 'positiv' | 'negativ'): Promise<boolean> {
        const serverUrl = process.env.CWA_SERVER;

        if (!serverUrl) {
            throw new Error('No CWA server url configured');
        }

        if (!process.env.CWA_CLIENT_CRT || !process.env.CWA_CLIENT_KEY) {
            throw new Error('No CWA client certificate configured. Path to certificate or key are mising.');
        }

        if (!CWAResult[result]) {
            throw new Error('Invalid result for CWA');
        }

        let agentOptions: AgentOptions;

        try {
            agentOptions = {
                cert: fs.readFileSync(process.env.CWA_CLIENT_CRT),
                key: fs.readFileSync(process.env.CWA_CLIENT_KEY),
            };

            if (process.env.CWA_CLIENT_CA) {
                agentOptions.ca = [fs.readFileSync(process.env.CWA_CLIENT_CA)];
            }

            if (process.env.CWA_CLIENT_PASSPHRASE) {
                agentOptions.passphrase = process.env.CWA_CLIENT_PASSPHRASE;
            }
        } catch(err) {
            console.log('Could not create https agent', err);
            return false;
        }

        const apiEndpoint = serverUrl.replace(/\/$/, '') + '/api/v1/quicktest/results';
        const agent = new Agent(agentOptions);

        for (let i = 0; i < 3; i++) {
            try {
                const response = await axios.post(apiEndpoint, {
                    testResults: [{
                        id: cwa.getHash(),
                        result: CWAResult[result],
                    }],
                }, {
                    httpsAgent: agent,
                });

                if (response.status === 204) {
                    return true;
                }

                if (response.status >= 200 && response.status < 300) {
                    console.log(`CWA responded with status ${response.status}.`);
                    return true;
                }
            } catch (err) {
                if (err.response) {
                    if (err.response.status === 400) {
                        console.log('CWA does not accept our certificate');
                        break;
                    }

                    console.log('CWA responded with an error', {
                        status: err.response.status,
                        data: err.response.data,
                    });
                } else {
                    console.log('Unknown error during CWA request', err.toString(), err.code);
                }

                await sleep(i * 1000);
            }
        }

        return false;
    }
}