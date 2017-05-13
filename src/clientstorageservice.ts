import { Injectable } from '@angular/core';
import { ServiceBase } from './servicebase';

import * as Utilities from './utils';

/**
 * A wrapper class to provide a consistent interface to browser based storage
 *
 */
export class ClientStorageWrapper implements ClientStore {

    /**
     * True if the wrapped storage is available; otherwise, false
     */
    public enabled: boolean;

    /**
     * Creates a new instance of the PnPClientStorageWrapper class
     *
     * @constructor
     */
    constructor(private store: Storage, public defaultTimeoutMinutes?: number) {
        this.defaultTimeoutMinutes = (defaultTimeoutMinutes === void 0) ? 5 : defaultTimeoutMinutes;
        this.enabled = this.test();
    }

    /**
     * Get a value from storage, or null if that value does not exist
     *
     * @param key The key whose value we want to retrieve
     */
    public get<T>(key: string): T {

        if (!this.enabled) {
            return null;
        }

        let o = this.store.getItem(key);

        if (o == null) {
            return null;
        }

        let persistable = JSON.parse(o);

        if (new Date(persistable.expiration) <= new Date()) {

            this.delete(key);
            return null;

        } else {

            return persistable.value as T;
        }
    }

    /**
     * Adds a value to the underlying storage
     *
     * @param key The key to use when storing the provided value
     * @param o The value to store
     * @param expire Optional, if provided the expiration of the item, otherwise the default is used
     */
    public put(key: string, o: any, expire?: Date): void {
        if (this.enabled) {
            this.store.setItem(key, this.createPersistable(o, expire));
        }
    }

    /**
     * Deletes a value from the underlying storage
     *
     * @param key The key of the pair we want to remove from storage
     */
    public delete(key: string): void {
        if (this.enabled) {
            this.store.removeItem(key);
        }
    }

    /**
     * Gets an item from the underlying storage, or adds it if it does not exist using the supplied getter function
     *
     * @param key The key to use when storing the provided value
     * @param getter A function which will upon execution provide the desired value
     * @param expire Optional, if provided the expiration of the item, otherwise the default is used
     */
    public getOrPut<T>(key: string, getter: () => Promise<T>, expire?: Date): Promise<T> {
        if (!this.enabled) {
            return getter();
        }

        if (!Utilities.isFunction(getter)) {
            throw 'Function expected for parameter "getter".';
        }

        return new Promise((resolve, reject) => {

            let o = this.get<T>(key);

            if (o == null) {
                getter().then((d) => {
                    this.put(key, d, expire);
                    resolve(d);
                });
            } else {
                resolve(o);
            }
        });
    }

    /**
     * Used to determine if the wrapped storage is available currently
     */
    private test(): boolean {
        let str = 'test';
        try {
            this.store.setItem(str, str);
            this.store.removeItem(str);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Creates the persistable to store
     */
    private createPersistable(o: any, expire?: Date): string {
        if (typeof expire === 'undefined') {
            expire = Utilities.dateAdd(new Date(), 'minute', this.defaultTimeoutMinutes);
        }

        return JSON.stringify({ expiration: expire, value: o });
    }
}

/**
 * Interface which defines the operations provided by a client storage object
 */
export interface ClientStore {
    /**
     * True if the wrapped storage is available; otherwise, false
     */
    enabled: boolean;

    /**
     * Get a value from storage, or null if that value does not exist
     *
     * @param key The key whose value we want to retrieve
     */
    get(key: string): any;

    /**
     * Adds a value to the underlying storage
     *
     * @param key The key to use when storing the provided value
     * @param o The value to store
     * @param expire Optional, if provided the expiration of the item, otherwise the default is used
     */
    put(key: string, o: any, expire?: Date): void;

    /**
     * Deletes a value from the underlying storage
     *
     * @param key The key of the pair we want to remove from storage
     */
    delete(key: string): void;

    /**
     * Gets an item from the underlying storage, or adds it if it does not exist using the supplied getter function
     *
     * @param key The key to use when storing the provided value
     * @param getter A function which will upon execution provide the desired value
     * @param expire Optional, if provided the expiration of the item, otherwise the default is used
     */
    getOrPut(key: string, getter: Function, expire?: Date): any;
}

/**
 * A class that will establish wrappers for both local and session storage
 */
@Injectable()
export class ClientStorageService extends ServiceBase {
    /**
     * Provides access to the local storage of the browser
     */
    public local: ClientStore;

    /**
     * Provides access to the session storage of the browser
     */
    public session: ClientStore;

    /**
     * Creates a new instance of the PnPClientStorage class
     *
     * @constructor
     */
    constructor() {
        super();
        this.local = typeof localStorage !== 'undefined' ? new ClientStorageWrapper(localStorage) : null;
        this.session = typeof sessionStorage !== 'undefined' ? new ClientStorageWrapper(sessionStorage) : null;
    }
}
