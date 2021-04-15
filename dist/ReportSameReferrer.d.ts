declare type condition = 'origin' | 'host' | 'hostname';
interface FetchParam {
    location: string;
    referrer: string;
}
declare type fetchContentType = 'application/x-www-form-urlencoded' | 'application/json';
interface Option {
    fetchParam?: FetchParam;
    fetchContentType?: fetchContentType;
    fetchHeaders?: HeadersInit;
    condition?: condition;
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
     * @param {Option} option - Information such as transmission conditions
     */
    constructor(endpoint: string, option?: Option);
    /**
     * Initial processing
     */
    init(): void;
    /**
     * ユーザーエージェントがレポートを行う対象かどうかチェックする
     *
     * @returns {boolean} 対象なら true
     */
    private checkUserAgent;
    /**
     * レポートを行う
     *
     * @param {object} referrerUrl - リファラーのURL
     */
    private report;
}
export {};
//# sourceMappingURL=ReportSameReferrer.d.ts.map