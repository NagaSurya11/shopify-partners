export function betweenInputValidator(from: Number, to: Number) {
    if (to < from) {
        throw new Error(`Validation error: 'to' value (${to}) must be greater than or equal to 'from' value (${from}).`)
    }
}