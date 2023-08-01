/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-expect-error no type
import { stringify } from 'qs';


/**
 *
 * HttpUtils is a namespace that includes functions needed for the requests
 * Most of the functions will probably need to be update to consist with server way of
 * handling of params/formData
 *
 */
export namespace HttpUtils {
	/**
   * * The options of this stringify will probably need to be updated to match the
   * * backend way of dealing with parameters.
   * @param params Convert the params to an acceptable url parameters
   * @returns
   */
	export const paramsSerializer = <K = any> (params: K): string => {
		return stringify(params, {
			skipNulls: true,
			serializeDate: (date: Date) => date.toISOString(),
			allowDots: true,
			arrayFormat: 'comma',
			encode: true
		});
	};

	export const serializeParams = <T extends object> (state: T): string => {
		const params = stringify(state, {
			// skipNulls: true,
			serializeDate: (date: Date) => date.toISOString(),
			allowDots: true,
			encode: false
		});
		return `${params ? '?' : ''}${params}`;
	};

	/**
   * This functions needs to be updated with the project, because different projects have
   * different ways to deal with formData
   * @param files Files to upload
   * @param model Object/Array with additional information to send
   * @returns
   */
	export const formData = (file: Blob, model: any): FormData => {
		const formData: FormData = new FormData();

		formData.append('file', file);
		Object.keys(model).forEach((key: string) => {
			formData.append(key, model[key]);
		});


		return formData;
	};
}
