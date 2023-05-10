import {z} from 'zod';

const isSingleLine = (value: string) => value.split(/[\n\r]/).length <= 1;

export const stringy = {
	customKey: z
		.string()
		.min(1)
		.max(60)
		.regex(/[a-z][\d_a-z]+/)
		.describe('A short name that can used as variable'),
	varValue: z
		.string()
		.min(1)
		.max(300)
		.regex(/(([\d._a-z]+)|(\[\d+]))+/)
		.describe('A dot prop path'),
	title: z
		.string()
		.trim()
		.min(1)
		.max(60)
		.refine(isSingleLine, {message: 'title should be a single line'}),
	keywords: z
		.string()
		.trim()
		.min(1)
		.max(150)
		.refine(isSingleLine, {message: 'keywords should be a single line'})
		.describe(
			'A list of custom keywords that can be used as metatadata for documentation',
		),
	uses: z
		.string()
		.trim()
		.min(1)
		.max(60)
		.startsWith('work:')
		.refine(isSingleLine, {message: 'title should be a single line'})
		.describe('A unique key representing a function'),
	finishId: z
		.string()
		.trim()
		.min(1)
		.max(60)
		.startsWith('finish:')
		.refine(isSingleLine, {message: 'title should be a single line'})
		.describe('A unique key representing a finish function'),
	logger: z
		.string()
		.trim()
		.min(1)
		.max(60)
		.startsWith('logger:')
		.refine(isSingleLine, {message: 'title should be a single line'})
		.describe('A unique key representing a logger'),
	validationId: z
		.string()
		.trim()
		.min(1)
		.max(60)
		.startsWith('validation:')
		.refine(isSingleLine, {message: 'title should be a single line'})
		.describe('A unique key representing the validation'),
	shieldId: z
		.string()
		.trim()
		.min(1)
		.max(60)
		.startsWith('shield:')
		.refine(isSingleLine, {message: 'title should be a single line'})
		.describe('A unique key representing the shield'),
	description: z
		.string()
		.trim()
		.min(1)
		.max(300)
		.describe('The main purpose of this section of script'),
	motivation: z
		.string()
		.trim()
		.min(1)
		.max(300)
		.describe('The main reason why this section of script is needed'),
	url: z.string().url().max(300).describe('A https link to the item resource'),
	webpage: z.string().url().max(300).describe('A https link to a webpage'),
	path: z.string().max(300).describe('A relative path to a file'),
	propPath: z.string().max(300).describe('A dot prop path'),
};
export const safeParseField = (
	name: 'title' | 'filename' | string,
	content: unknown,
) => {
	if (name === 'title') {
		return stringy.title.safeParse(content);
	}

	return `${name} is not supported`;
};
