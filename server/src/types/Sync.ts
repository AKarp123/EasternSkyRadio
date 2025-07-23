
export interface Sync<T> {
    type: string;
    data: T;
    lastSynced: Date;
}