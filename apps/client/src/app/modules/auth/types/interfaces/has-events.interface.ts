import { Observable, Subject } from "rxjs";
import { SCustomEvent } from "./custom-event.interface";

export interface SHasEventsInterface<T, V = any> {
    readonly events: Subject<SCustomEvent<T, V>>;
    onEvents: () => Observable<SCustomEvent<T, V>>;
}
