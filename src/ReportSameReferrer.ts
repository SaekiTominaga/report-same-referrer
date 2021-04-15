type condition = 'origin' | 'host' | 'hostname';

interface FetchParam {
	location: string; // Field name when sending `location` to an endpoint.
	referrer: string; // Field name when sending `document.referrer` to an endpoint.
}

type fetchContentType = 'application/x-www-form-urlencoded' | 'application/json';

interface Option {
	fetchParam?: FetchParam;
	fetchContentType?: fetchContentType; // `Content-Type` header to be set in `fetch()` request.
	fetchHeaders?: HeadersInit; // Header to add to the `fetch()` request. <https://fetch.spec.whatwg.org/#typedefdef-headersinit>
	condition?: condition; // Which parts of the referrer to check.
	denyUAs?: RegExp[]; // If a user agent matches this regular expression, do not send report.
	allowUAs?: RegExp[]; // If a user agent matches this regular expression, send report.
}

/**
 * Send referrer error information to endpoints.
 */
export default class {
	#endpoint: string; // URL of the endpoint
	#option: Option; // Information such as transmission conditions

	/**
	 * @param {string} endpoint - URL of the endpoint
	 * @param {Option} option - Information such as transmission conditions
	 */
	constructor(endpoint: string, option: Option = {}) {
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

		if (!this.checkUserAgent()) {
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

		this.report(referrerUrl);
	}

	/**
	 * ユーザーエージェントがレポートを行う対象かどうかチェックする
	 *
	 * @returns {boolean} 対象なら true
	 */
	private checkUserAgent(): boolean {
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
	 * @param {object} referrerUrl - リファラーのURL
	 */
	private async report(referrerUrl: URL): Promise<void> {
		const fetchParam = <FetchParam>this.#option.fetchParam;

		const formData = new FormData();
		formData.append(fetchParam.location, location.toString());
		formData.append(fetchParam.referrer, referrerUrl.toString());

		const contentType = this.#option.fetchContentType;

		const fetchHeaders = new Headers(this.#option.fetchHeaders);
		if (contentType !== undefined) {
			fetchHeaders.set('Content-Type', contentType);
		}

		const fetchBody: BodyInit =
			contentType === 'application/json' ? JSON.stringify(Object.fromEntries(formData)) : new URLSearchParams(<string[][]>[...formData]);

		const response = await fetch(this.#endpoint, {
			method: 'POST',
			headers: fetchHeaders,
			body: fetchBody,
		});

		if (!response.ok) {
			throw new Error(`"${response.url}" is ${response.status} ${response.statusText}`);
		}
	}
}
