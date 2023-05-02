import { commonTokens, tokens } from '@stryker-mutator/api/plugin';
import { errorToString } from '@stryker-mutator/util';
import { initializerTokens } from './index.js';
const getName = (packageName) => {
    return packageName.replace('@stryker-mutator/', '').replace('stryker-', '').split('-')[0];
};
const mapSearchResultToPromptOption = (searchResults) => searchResults.results.map((result) => ({
    name: getName(result.package.name),
    pkg: result.package,
}));
const handleResult = (from) => (response) => {
    if (response.statusCode === 200 && response.result) {
        return response.result;
    }
    else {
        throw new Error(`Path ${from} resulted in http status code: ${response.statusCode}.`);
    }
};
export class NpmClient {
    constructor(log, searchClient, packageClient) {
        this.log = log;
        this.searchClient = searchClient;
        this.packageClient = packageClient;
    }
    getTestRunnerOptions() {
        return this.search('/v2/search?q=keywords:@stryker-mutator/test-runner-plugin').then(mapSearchResultToPromptOption);
    }
    getTestReporterOptions() {
        return this.search('/v2/search?q=keywords:@stryker-mutator/reporter-plugin').then(mapSearchResultToPromptOption);
    }
    getAdditionalConfig(pkgInfo) {
        const path = `/${pkgInfo.name}@${pkgInfo.version}/package.json`;
        return this.packageClient
            .get(path)
            .then(handleResult(path))
            .catch((err) => {
            this.log.warn(`Could not fetch additional initialization config for dependency ${pkgInfo.name}. You might need to configure it manually`, err);
            return { name: pkgInfo.name };
        });
    }
    search(path) {
        this.log.debug(`Searching: ${path}`);
        return this.searchClient
            .get(path)
            .then(handleResult(path))
            .catch((err) => {
            this.log.error(`Unable to reach npms.io (for query ${path}). Please check your internet connection.`, errorToString(err));
            const result = {
                results: [],
                total: 0,
            };
            return result;
        });
    }
}
NpmClient.inject = tokens(commonTokens.logger, initializerTokens.restClientNpmSearch, initializerTokens.restClientNpm);
//# sourceMappingURL=npm-client.js.map