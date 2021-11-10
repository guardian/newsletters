import SSM from 'aws-sdk/clients/ssm';
import {
	ECSCredentials,
	SharedIniFileCredentials,
	CredentialProviderChain,
} from 'aws-sdk/lib/core';

const Stage = process.env.Stage ?? 'CODE';
const Path = `/frontend/${Stage}/newsletters-api/`;
type Config = { [key: string]: any };

const ssm: SSM = new SSM({
	credentialProvider: new CredentialProviderChain([
		() => new SharedIniFileCredentials({ profile: 'frontend' }),
		() => new ECSCredentials(),
	]),
	region: 'eu-west-1',
});

let state: Config | null = null;

async function fetchConfig(): Promise<Config> {
	if (state == null) {
		state = {};

		const awsParameters = await ssm
			.getParametersByPath({
				Path,
				WithDecryption: true,
			})
			.promise();
		for (const parameter of awsParameters.Parameters ?? []) {
			if (parameter.Name) {
				const name = parameter.Name.replace(Path, '');
				state[name] = parameter.Value;
			}
		}
		return state;
	} else {
		return Promise.resolve(state);
	}
}

export async function getConfigItem(key: string): Promise<any> {
	const config = await fetchConfig();
	if (config[key]) {
		return config[key];
	} else {
		throw new Error(`No config value for key: ${Path}`);
	}
}
