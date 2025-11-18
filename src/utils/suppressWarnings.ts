// suppressed all errors and warnings with following strings
const SUPPRESSED_WARNINGS = [
	'is using incorrect casing',
	'is unrecognized in this browser'
];

const originalError = console.error;
const originalWarn = console.warn;

const createSuppressor = (originalFn: typeof console.error) => {
	return (...args: any[]) => {
		const message = args[0]?.toString() || '';
		
		if (SUPPRESSED_WARNINGS.some(warning => message.includes(warning))) {
			return;
		}
		
		originalFn.apply(console, args);
	};
};

console.error = createSuppressor(originalError);
console.warn = createSuppressor(originalWarn);