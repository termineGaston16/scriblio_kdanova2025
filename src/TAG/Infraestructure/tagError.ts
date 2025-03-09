export class DataBaseError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'FirebaseStoreError',
            this.message = message
    }
}

export class DataBaseSystemFailure extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'DataBaseSystemFailure',
            this.message = message
    }
}