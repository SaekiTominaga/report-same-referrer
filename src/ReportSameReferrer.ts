type referrerErrorCondition = 'origin' | 'host' | 'hostname';

interface referrerErrorFetchParam {
	location: string; // Field name when sending `location` to an endpoint.
	referrer: string; // Field name when sending `document.referrer` to an endpoint.
}

interface referrerErrorFetchOption {
	fetchParam?: referrerErrorFetchParam;
	fetchHeaders?: HeadersInit; // Header to add to the `fetch()` request. <https://fetch.spec.whatwg.org/#typedefdef-headersinit>
	condition?: referrerErrorCondition; // Which parts of the referrer to check.
	denyUAs?: RegExp[]; // If a user agent matches this regular expression, do not send report.
	allowUAs?: RegExp[]; // If a user agent matches this regular expression, send report.
}

/**
 * Send referrer error information to endpoints.
 */
export default class {
	#endpoint: string; // エンドポイントの URL
	#option: referrerErrorFetchOption;

	/**
	 * @param {string} endpoint - URL of the endpoint
	 * @param {referrerErrorFetchOption} option - Information such as transmission conditions
	 */
	constructor(endpoint: string, option: referrerErrorFetchOption = {}) {
		this.#endpoint = endpoint;

		if (option.fetchParam === undefined) {
			option.fetchParam = {
				location: 'location',
				referrer: 'referrer',
			};
		}
		if (option.condition === undefined) {
			option.condition = 'origin';
		}
		this.#option = option;
	}

	/**
	 * Initial processing
	 */
	init(): void {
		const referrer = document.referrer;
		if (referrer === '') {
			return;
		}

		if (!this._checkUserAgent()) {
			return;
		}

		const referrerUrl = new URL(referrer);

		switch (this.#option.condition) {
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
	private _checkUserAgent(): boolean {
		const ua = navigator.userAgent;

		const denyUAs = this.#option.denyUAs;
		if (denyUAs !== undefined && denyUAs.some((denyUA) => denyUA.test(ua))) {
			console.info('No referrer error report will be sent because the user agent match the deny list.');
			return false;
		}
		const allowUAs = this.#option.allowUAs;
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
	private async _report(referrerUrl: URL): Promise<void> {
		const fetchParam = <referrerErrorFetchParam>this.#option.fetchParam;

		const formData = new FormData();
		formData.append(fetchParam.location, location.toString());
		formData.append(fetchParam.referrer, referrerUrl.toString());

		const response = await fetch(this.#endpoint, {
			method: 'POST',
			headers: this.#option.fetchHeaders,
			body: new URLSearchParams(<string[][]>[...formData]),
		});
		if (!response.ok) {
			throw new Error(`"${response.url}" is ${response.status} ${response.statusText}`);
		}
	}
}
