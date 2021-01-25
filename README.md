# Send referrer error information to endpoints

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Freport-same-referrer.svg)](https://badge.fury.io/js/%40saekitominaga%2Freport-same-referrer)

If there are referrers from same site, that information will be sent to the endpoint as an error.

As a practical use case, this script put this script in error pages like 403, 404, 410 error pages to detect **the existence of broken links in the same site**.

## Demo

- [Demo page](https://saekitominaga.github.io/report-same-referrer/demo.html)

## Examples

```JavaScript
import ReportSameReferrer from '@saekitominaga/report-same-referrer';

const reportSameReferrer = new ReportSameReferrer('https://report.example.com/referrer', {
  'fetchParam': {
    location: 'loc',
    referrer: 'ref',
  },
  'fetchHeaders': {
    'X-Requested-With': 'hoge',
  },
  'condition': 'origin',
  'denyUAs': [
    /Googlebot\/2.1;/,
  ],
});
reportSameReferrer.init();
```

## Constructor

```TypeScript
new ReportSameReferrer(endpoint: string, option: {
  fetchParam?: {
    location: string; // Field name when sending `location` to an endpoint. The default value when omitted is `location`. (e.g. location=https%3A%2F%2Fexample.com%2Fpath%2Fto&referrer=(omit) )
    referrer: string; // Field name when sending `document.referrer` to an endpoint. The default value when omitted is `referrer`. (e.g. location=(omit)&referrer=https%3A%2F%2Fexternal.example.net%2Fpath%2Fto )
  },
  condition?: 'origin' | 'host' | 'hostname'; // Which parts of the referrer to check. The default value when omitted is `origin`.
  denyUAs?: RegExp[]; // If a user agent matches this regular expression, do not send report.
  allowUAs?: RegExp[]; // If a user agent matches this regular expression, send report.
  fetchHeaders?: HeadersInit; // Header to add to the `fetch()` request. <https://fetch.spec.whatwg.org/#typedefdef-headersinit>
} = {})
```

### Parameters

<dl>
<dt>endpoint [required]</dt>
<dd>URL of the endpoint</dd>
<dt>option [optional]</dt>
<dd>Information such as transmission conditions</dd>
</dl>

- If neither `denyUAs` nor `allowUAs` is specified, any file name will be accepted.
