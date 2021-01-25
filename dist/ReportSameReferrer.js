var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _endpoint, _option;
/**
 * Send referrer error information to endpoints.
 */
export default class {
    /**
     * @param {string} endpoint - URL of the endpoint
     * @param {referrerErrorFetchOption} option - Information such as transmission conditions
     */
    constructor(endpoint, option = {}) {
        _endpoint.set(this, void 0); // エンドポイントの URL
        _option.set(this, void 0);
        __classPrivateFieldSet(this, _endpoint, endpoint);
        if (option.fetchParam === undefined) {
            option.fetchParam = {
                location: 'location',
                referrer: 'referrer',
            };
        }
        if (option.condition === undefined) {
            option.condition = 'origin';
        }
        __classPrivateFieldSet(this, _option, option);
    }
    /**
     * Initial processing
     */
    init() {
        const referrer = document.referrer;
        if (referrer === '') {
            return;
        }
        if (!this._checkUserAgent()) {
            return;
        }
        const referrerUrl = new URL(referrer);
        switch (__classPrivateFieldGet(this, _option).condition) {
            case 'origin': {
                if (referrerUrl.origin !== location.origin) {
                    return;
                }
                break;
            }
            case 'host': {
                if (referrerUrl.host !== location.host) {
                    return;
                }
                break;
            }
            case 'hostname': {
                if (referrerUrl.hostname !== location.hostname) {
                    return;
                }
                break;
            }
            default:
                throw new Error('An invalid value was specified for the argument `condition`.');
        }
        this._report(referrerUrl);
    }
    /**
     * ユーザーエージェントがレポートを行う対象かどうかチェックする
     *
     * @returns {boolean} 対象なら true
     */
    _checkUserAgent() {
        const ua = navigator.userAgent;
        const denyUAs = __classPrivateFieldGet(this, _option).denyUAs;
        if (denyUAs !== undefined && denyUAs.some((denyUA) => denyUA.test(ua))) {
            console.info('No referrer error report will be sent because the user agent match the deny list.');
            return false;
        }
        const allowUAs = __classPrivateFieldGet(this, _option).allowUAs;
        if (allowUAs !== undefined && !allowUAs.some((allowUA) => allowUA.test(ua))) {
            console.info('No referrer error report will be sent because the user agent does not match the allow list.');
            return false;
        }
        return true;
    }
    /**
     * レポートを行う
     *
     * @param {URL} referrerUrl - リファラーのURL
     */
    async _report(referrerUrl) {
        const fetchParam = __classPrivateFieldGet(this, _option).fetchParam;
        const formData = new FormData();
        formData.append(fetchParam.location, location.toString());
        formData.append(fetchParam.referrer, referrerUrl.toString());
        const response = await fetch(__classPrivateFieldGet(this, _endpoint), {
            method: 'POST',
            headers: __classPrivateFieldGet(this, _option).fetchHeaders,
            body: new URLSearchParams([...formData]),
        });
        if (!response.ok) {
            throw new Error(`"${response.url}" is ${response.status} ${response.statusText}`);
        }
    }
}
_endpoint = new WeakMap(), _option = new WeakMap();
//# sourceMappingURL=ReportSameReferrer.js.map