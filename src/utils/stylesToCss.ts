/**
 * Converts React/JS styles (camelCase) to CSS string (kebab-case)
 */
export function stylesToCss(styles: Record<string, any>): string {
	const unitlessProperties = new Set([
		'flex',
		'flexGrow',
		'flexShrink',
		'order',
		'opacity',
		'zIndex',
		'fontWeight',
		'lineHeight',
		'zoom',
	]);
	
	const camelToKebab = (str: string): string => {
		return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
	};
	
	// Форматируем значение
	const formatValue = (key: string, value: any): string => {
		if (typeof value === 'number') {
			return unitlessProperties.has(key) ? String(value) : `${value}px`;
		}
		
		if (typeof value === 'string') {
			if (key === 'fontFamily' && !value.startsWith("'") && !value.startsWith('"')) {
				return `'${value}'`;
			}
			return value;
		}
		
		return String(value);
	};
	
	const cssLines = Object.entries(styles).map(([key, value]) => {
		const cssKey = camelToKebab(key);
		const cssValue = formatValue(key, value);
		return `  ${cssKey}: ${cssValue};`;
	});
	
	return cssLines.join('\n');
}
