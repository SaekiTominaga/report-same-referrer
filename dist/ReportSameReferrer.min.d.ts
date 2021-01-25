declare type referrerErrorCondition = 'origin' | 'host' | 'hostname';
interface referrerErrorFetchParam {
    location: string;
    referrer: string;
}
interface referrerErrorFetchOption {
    fetchParam?: referrerErrorFetchParam;
    fetchHeaders?: HeadersInit;
    condition?: referrerErrorCondition;
    denyUAs?: RegExp[];
    allowUAs?: RegExp[];
}
/**
 * Send referrer error information to endpoints.
 */
export default class {
    #private;
    /**
     * @param {string} endpoint - URL of the endpoint
     * @param {referrerErrorFetchOption} option - Information such as transmission conditions
     */
    constructor(endpoint: string, option?: referrerErrorFetchOption);
    /**
     * Initial processing
     */
    init(): void;
    /**
     * ユーザーエージェントがレポートを行う対象かどうかチェックする
     *
     * @returns {boolean} 対象なら true
     */
    private _checkUserAgent;
    /**
     * レポートを行う
     *
     * @param {URL} referrerUrl - リファラーのURL
     */
    private _report;
}
export {};
//# sourceMappingURL=ReportSameReferrer.d.ts.map