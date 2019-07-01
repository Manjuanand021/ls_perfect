/**
 * Get data delegate interface.
 */
export interface IGetDataDelegate<T> {
    getData(request: T): Promise<any>;
}

/**
 * Create data delegate interface.
 */
export interface ICreateDataDelegate<T> {
    createData(request: T): Promise<any>;
}

/**
 * Update data delegate interface.
 */
export interface IUpdateDataDelegate<T> {
    updateData(request: T): Promise<any>;
}

/**
 * Delete data delegate interface.
 */
export interface IDeleteDataDelegate<T> {
    deleteData(request: T): Promise<any>;
}
