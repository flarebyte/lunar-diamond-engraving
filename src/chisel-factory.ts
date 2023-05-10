import {
	type EngravingActionFunction,
	type EngravingOnFinishFunction,
	type EngravingChisel,
	type EngravingLoggerFunction,
	type EngravingValidationFunction,
} from './api-model.js';
import {type EngravingModel, safeParseBuild} from './engraving-model.js';

/** List usage of the references to function */
type EngravingReferenceCheck = {
	/** Unused references */
	unused: string[];
	/** Uses references */
	used: string[];
	/** Missing references that are been used */
	missing: string[];
	/** All the supported references */
	supported: string[];
};
const createKeyRefsForValidation = ({
	opts,
	headers,
	parameters,
	payload,
	context,
}: {
	opts: string;
	headers: string;
	parameters: string;
	payload: string;
	context: string;
}): string[] => [opts, headers, parameters, payload, context];
const byUniqueName = (value: string, index: number, self: string[]): boolean =>
	self.indexOf(value) === index;

const extractCommons = ({
	logger,
	alerter,
	generator,
}: {
	logger?: string;
	alerter?: string;
	generator?: string;
}): string[] => {
	const hasLogger = logger === undefined ? [] : [logger];
	const hasAlerter = alerter === undefined ? [] : [alerter];
	const hasGenerator = generator === undefined ? [] : [generator];
	return [...hasLogger, ...hasAlerter, ...hasGenerator];
};

/**
 * Builder for setting up the different tools (chisel) required to run the engraving
 */
export class EngravingChiselBuilder {
	private model?: EngravingModel;
	private actionFunctions: Record<string, EngravingActionFunction> = {};
	private onFinishFunctions: Record<string, EngravingOnFinishFunction> = {};

	private validationFunctions: Record<string, EngravingValidationFunction> = {};

	private shieldFunctions: Record<string, EngravingValidationFunction> = {};

	private loggerFunctions: Record<string, EngravingLoggerFunction> = {};

	public setModel(model: EngravingModel): this {
		this.model = model;
		return this;
	}

	/** Parse and validate the engraving model */
	public parseModel(model: Record<string, unknown>): this {
		const modelResult = safeParseBuild(model);
		if (modelResult.status === 'success') {
			return this.setModel(modelResult.value);
		}

		throw new Error(
			'Chisel Factory Model is invalid: '
          + JSON.stringify(modelResult.error, null, 2),
		);
	}

	/** Add an action */
	public addActionFunction(
		name: string,
		actionFunction: EngravingActionFunction,
	): this {
		this.actionFunctions[name] = actionFunction;
		return this;
	}

	/** Add an OnFinish function */
	public addOnFinishFunction(
		name: string,
		onFinishFunction: EngravingOnFinishFunction,
	): this {
		this.onFinishFunctions[name] = onFinishFunction;
		return this;
	}

	/** Add a validation function */
	public addValidationFunction(
		name: string,
		validationFunction: EngravingValidationFunction,
	): this {
		this.validationFunctions[name] = validationFunction;
		return this;
	}

	/** Add a shield function that could detect suspicious payload */
	public addShieldFunction(
		name: string,
		shieldFunction: EngravingValidationFunction,
	): this {
		this.shieldFunctions[name] = shieldFunction;
		return this;
	}

	/** Add a logger function  */
	public addLoggerFunction(
		name: string,
		loggerFunction: EngravingLoggerFunction,
	): this {
		this.loggerFunctions[name] = loggerFunction;
		return this;
	}

	/** Build the EngravingChisel object  */
	public build(): EngravingChisel {
		if (this.model === undefined) {
			throw new Error('Model is required');
		}

		return {
			model: this.model,
			actionFunctions: this.actionFunctions,
			onFinishFunctions: this.onFinishFunctions,
			validationFunctions: this.validationFunctions,
			shieldFunctions: this.shieldFunctions,
			loggerFunctions: this.loggerFunctions,
		};
	}

	/**
   * Check that every functions that is been referenced is available
   */
	public checkReferences(): EngravingReferenceCheck {
		if (this.model === undefined) {
			throw new Error('Model is required');
		}

		const supported: string[] = [
			...Object.keys(this.actionFunctions),
			...Object.keys(this.validationFunctions),
			...Object.keys(this.shieldFunctions),
			...Object.keys(this.loggerFunctions),
			...Object.keys(this.onFinishFunctions),
		].filter(byUniqueName);

		const unsortedUsed: string[] = [];
		for (const engraving of Object.values(this.model.engravings)) {
			unsortedUsed.push(...extractCommons(engraving));
			unsortedUsed.push(
				...createKeyRefsForValidation(engraving.phases.validation.check),
			);
			unsortedUsed.push(
				...createKeyRefsForValidation(engraving.phases.shield.check),
			);

			unsortedUsed.push(
				...Object.values(engraving.phases.actions).map(action => action.uses), engraving.phases.onFinish.uses,
			);
		}

		const used = unsortedUsed.filter(byUniqueName).sort();
		const missing = used.filter(u => !supported.includes(u));
		const unused = supported.filter(s => !used.includes(s));
		return {
			supported,
			used,
			missing,
			unused,
		};
	}
}
