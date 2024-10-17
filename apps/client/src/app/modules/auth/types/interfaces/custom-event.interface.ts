export interface SCustomEvent<T, V = any> {
    type: T,
    payload?: V
}
