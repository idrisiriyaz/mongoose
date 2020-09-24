declare module "mongoose" {
  import mongodb = require('mongodb');
  import mongoose = require('mongoose');

  /** Opens Mongoose's default connection to MongoDB, see [connections docs](https://mongoosejs.com/docs/connections.html) */
  export function connect(uri: string, options: ConnectOptions, callback: (err: Error) => void): void;
  export function connect(uri: string, callback: (err: Error) => void): void;
  export function connect(uri: string, options?: ConnectOptions): Promise<Mongoose>;

  export function model<T extends Document>(name: string, schema?: Schema, collection?: string, skipInit?: boolean): Model<T>;

  type Mongoose = typeof mongoose;

  interface ConnectOptions extends mongodb.MongoClientOptions {
    /** Set to false to [disable buffering](http://mongoosejs.com/docs/faq.html#callback_never_executes) on all models associated with this connection. */
    bufferCommands?: boolean;
    /** The name of the database you want to use. If not provided, Mongoose uses the database name from connection string. */
    dbName?: string;
    /** username for authentication, equivalent to `options.auth.user`. Maintained for backwards compatibility. */
    user?: string;
    /** password for authentication, equivalent to `options.auth.password`. Maintained for backwards compatibility. */
    pass?: string;
    /** Set to false to disable automatic index creation for all models associated with this connection. */
    autoIndex?: boolean;
    /** True by default. Set to `false` to make `findOneAndUpdate()` and `findOneAndRemove()` use native `findOneAndUpdate()` rather than `findAndModify()`. */
    useFindAndModify?: boolean;
    /** Set to `true` to make Mongoose automatically call `createCollection()` on every model created on this connection. */
    autoCreate?: boolean;
  }

  namespace Types {
    class ObjectId extends mongodb.ObjectID {}
  }

  class Document {}

  export var Model: Model<any>;
  interface Model<T extends Document> {
    new(doc?: any): T;

    /** Base Mongoose instance the model uses. */
    base: typeof mongoose;

    /**
     * If this is a discriminator model, `baseModelName` is the name of
     * the base model.
     */
    baseModelName: string | undefined;

    /**
     * Sends multiple `insertOne`, `updateOne`, `updateMany`, `replaceOne`,
     * `deleteOne`, and/or `deleteMany` operations to the MongoDB server in one
     * command. This is faster than sending multiple independent operations (e.g.
     * if you use `create()`) because with `bulkWrite()` there is only one round
     * trip to MongoDB.
     */
    bulkWrite(writes: Array<any>, options?: mongodb.CollectionBulkWriteOptions, cb?: (err: any, res: mongodb.BulkWriteOpResultObject) => void): void;
    bulkWrite(writes: Array<any>, options?: mongodb.CollectionBulkWriteOptions): Promise<mongodb.BulkWriteOpResultObject>;

    /** Creates a new document or documents */
    create(doc: T | DocumentDefinition<T>): Promise<T>;
    create(docs: Array<T | DocumentDefinition<T>>, options?: SaveOptions): Promise<Array<T>>;
    create(...docs: Array<T | DocumentDefinition<T>>): Promise<T>;
    create(doc: T | DocumentDefinition<T>, callback: (err: Error | null, doc: T) => void): void;
    create(docs: Array<T | DocumentDefinition<T>>, callback: (err: Error | null, docs: Array<T>) => void): void;

    /** Inserts one or more new documents as a single `insertMany` call to the MongoDB server. */
    insertMany(doc: T | DocumentDefinition<T>, options?: InsertManyOptions): Promise<T | InsertManyResult>;
    insertMany(docs: Array<T | DocumentDefinition<T>>, options?: InsertManyOptions): Promise<Array<T> | InsertManyResult>;
    insertMany(doc: T | DocumentDefinition<T>, options?: InsertManyOptions, callback?: (err: Error | null, res: T | InsertManyResult) => void): void;
    insertMany(docs: Array<T | DocumentDefinition<T>>, options?: InsertManyOptions, callback?: (err: Error | null, res: Array<T> | InsertManyResult) => void): void;

    /** Saves this document by inserting a new document into the database if [document.isNew](/docs/api.html#document_Document-isNew) is `true`, or sends an [updateOne](/docs/api.html#document_Document-updateOne) operation with just the modified paths if `isNew` is `false`. */
    save(options?: SaveOptions): Promise<this>;
    save(options?: SaveOptions, fn?: (err: Error | null, doc: this) => void): void;
    save(fn?: (err: Error | null, doc: this) => void): void;

    /**
     * Starts a [MongoDB session](https://docs.mongodb.com/manual/release-notes/3.6/#client-sessions)
     * for benefits like causal consistency, [retryable writes](https://docs.mongodb.com/manual/core/retryable-writes/),
     * and [transactions](http://thecodebarbarian.com/a-node-js-perspective-on-mongodb-4-transactions.html).
     **/
    startSession(options?: mongodb.SessionOptions, cb?: (err: any, session: mongodb.ClientSession) => void): Promise<mongodb.ClientSession>;

    /** Watches the underlying collection for changes using [MongoDB change streams](https://docs.mongodb.com/manual/changeStreams/). */
    watch(pipeline?: Array<object>, options?: mongodb.ChangeStreamOptions): mongodb.ChangeStream;

    /** Adds a `$where` clause to this query */
    $where(argument: string | Function): Query<Array<T>, T>;

    /** Registered discriminators for this model. */
    discriminators: { [name: string]: Model<any> } | undefined;

    /** Translate any aliases fields/conditions so the final query or document object is pure */
    translateAliases(raw: any): any;

    /** Creates a `count` query: counts the number of documents that match `filter`. */
    count(callback?: (err: any, count: number) => void): Query<number, T>;
    count(filter: FilterQuery<T>, callback?: (err: any, count: number) => void): Query<number, T>;

    /** Creates a `countDocuments` query: counts the number of documents that match `filter`. */
    countDocuments(callback?: (err: any, count: number) => void): Query<number, T>;
    countDocuments(filter: FilterQuery<T>, callback?: (err: any, count: number) => void): Query<number, T>;

    /** Creates a `estimatedDocumentCount` query: counts the number of documents in the collection. */
    estimatedDocumentCount(options?: QueryOptions, callback?: (err: any, count: number) => void): Query<number, T>;

    /** Creates a `distinct` query: returns the distinct values of the given `field` that match `filter`. */
    distinct(field: string, filter?: FilterQuery<T>, callback?: (err: any, count: number) => void): Query<Array<any>, T>;

    /** Creates a `find` query: gets a list of documents that match `filter`. */
    find(callback?: (err: any, count: number) => void): Query<Array<T>, T>;
    find(filter: FilterQuery<T>, callback?: (err: any, count: number) => void): Query<Array<T>, T>;
    find(filter: FilterQuery<T>, projection?: any | null, options?: QueryOptions | null, callback?: (err: any, count: number) => void): Query<Array<T>, T>;

    /** Creates a `findByIdAndDelete` query, filtering by the given `_id`. */
    findByIdAndDelete(id?: mongodb.ObjectId | any, options?: QueryOptions | null, callback?: (err: any, doc: T | null, res: any) => void): Query<T | null, T>;

    /** Creates a `findByIdAndRemove` query, filtering by the given `_id`. */
    findByIdAndRemove(id?: mongodb.ObjectId | any, options?: QueryOptions | null, callback?: (err: any, doc: T | null, res: any) => void): Query<T | null, T>;

    /** Creates a `findOneAndUpdate` query, filtering by the given `_id`. */
    findByIdAndUpdate(id?: mongodb.ObjectId | any, update?: UpdateQuery<T>, options?: QueryOptions | null, callback?: (err: any, doc: T | null, res: any) => void): Query<T | null, T>;

    /** Creates a `findOneAndDelete` query: atomically finds the given document, deletes it, and returns the document as it was before deletion. */
    findOneAndDelete(filter?: FilterQuery<T>, options?: QueryOptions | null, callback?: (err: any, doc: T | null, res: any) => void): Query<T | null, T>;

    /** Creates a `findOneAndRemove` query: atomically finds the given document and deletes it. */
    findOneAndRemove(filter?: FilterQuery<T>, options?: QueryOptions | null, callback?: (err: any, doc: T | null, res: any) => void): Query<T | null, T>;

    /** Creates a `findOneAndReplace` query: atomically finds the given document and replaces it with `replacement`. */
    findOneAndReplace(filter?: FilterQuery<T>, replacement?: DocumentDefinition<T>, options?: QueryOptions | null, callback?: (err: any, doc: T | null, res: any) => void): Query<T | null, T>;

    /** Creates a `findOneAndUpdate` query: atomically find the first document that matches `filter` and apply `update`. */
    findOneAndUpdate(filter?: FilterQuery<T>, update?: UpdateQuery<T>, options?: QueryOptions | null, callback?: (err: any, doc: T | null, res: any) => void): Query<T | null, T>;

    remove(filter?: any, callback?: (err: Error | null) => void): Query<any, T>;

    /** Creates a Query, applies the passed conditions, and returns the Query. */
    where(path: string, val?: any): Query<Array<T>, T>;
  }

  interface QueryOptions {
    tailable?: number;
    sort?: any;
    limit?: number;
    skip?: number;
    maxscan?: number;
    batchSize?: number;
    comment?: any;
    snapshot?: any;
    readPreference?: mongodb.ReadPreferenceMode;
    hint?: any;
    upsert?: boolean;
    writeConcern?: any;
    timestamps?: boolean;
    omitUndefined?: boolean;
    overwriteDiscriminatorKey?: boolean;
    lean?: boolean | any;
    populate?: string;
    projection?: any;
    maxTimeMS?: number;
    useFindAndModify?: boolean;
    rawResult?: boolean;
    collation?: mongodb.CollationDocument;
    session?: mongodb.ClientSession;
    explain?: any;
  }

  interface SaveOptions {
    checkKeys?: boolean;
    validateBeforeSave?: boolean;
    validateModifiedOnly?: boolean;
    timestamps?: boolean;
    j?: boolean;
    w?: number | string;
    wtimeout?: number;
  }

  interface InsertManyOptions {
    limit?: number;
    rawResult?: boolean;
    ordered?: boolean;
    lean?: boolean;
    session?: mongodb.ClientSession;
  }

  interface InsertManyResult extends mongodb.InsertWriteOpResult<any> {
    mongoose?: { validationErrors?: Array<Error> }
  }

  class Schema {
    /**
     * Create a new schema
     */
    constructor(definition?: SchemaDefinition);

    /** Adds key path / schema type pairs to this schema. */
    add(obj: SchemaDefinition | Schema, prefix?: string): this;
  }

  interface SchemaDefinition {
    [path: string]: SchemaTypeOptions<any> | Function | string | Schema | Array<Schema> | Array<SchemaTypeOptions<any>>;
  }

  interface SchemaTypeOptions<T> {
    type?: T;

    /** Defines a virtual with the given name that gets/sets this path. */
    alias?: string;

    /** Function or object describing how to validate this schematype. See [validation docs](https://mongoosejs.com/docs/validation.html). */
    validate?: RegExp | [RegExp, string] | Function;

    /** Allows overriding casting logic for this individual path. If a string, the given string overwrites Mongoose's default cast error message. */
    cast?: string;

    /**
     * If true, attach a required validator to this path, which ensures this path
     * path cannot be set to a nullish value. If a function, Mongoose calls the
     * function and only checks for nullish values if the function returns a truthy value.
     */
    required?: boolean | (() => boolean);

    /**
     * The default value for this path. If a function, Mongoose executes the function
     * and uses the return value as the default.
     */
    default?: T | ((this: any, doc: any) => T);

    /**
     * The model that `populate()` should use if populating this path.
     */
    ref?: string | Model<any> | ((this: any, doc: any) => string | Model<any>);

    /**
     * Whether to include or exclude this path by default when loading documents
     * using `find()`, `findOne()`, etc.
     */
    select?: boolean | number;

    /**
     * If [truthy](https://masteringjs.io/tutorials/fundamentals/truthy), Mongoose will
     * build an index on this path when the model is compiled.
     */
    index?: boolean | number | IndexOptions;

    /**
     * If [truthy](https://masteringjs.io/tutorials/fundamentals/truthy), Mongoose
     * will build a unique index on this path when the
     * model is compiled. [The `unique` option is **not** a validator](/docs/validation.html#the-unique-option-is-not-a-validator).
     */
    unique?: boolean | number;

    /**
     * If [truthy](https://masteringjs.io/tutorials/fundamentals/truthy), Mongoose will
     * disallow changes to this path once the document is saved to the database for the first time. Read more
     * about [immutability in Mongoose here](http://thecodebarbarian.com/whats-new-in-mongoose-5-6-immutable-properties.html).
     */
    immutable?: boolean | ((this: any, doc: any) => boolean);

    /**
     * If [truthy](https://masteringjs.io/tutorials/fundamentals/truthy), Mongoose will
     * build a sparse index on this path.
     */
    sparse?: boolean | number;

    /**
     * If [truthy](https://masteringjs.io/tutorials/fundamentals/truthy), Mongoose
     * will build a text index on this path.
     */
    text?: boolean | number | any;

    /**
     * Define a transform function for this individual schema type.
     * Only called when calling `toJSON()` or `toObject()`.
     */
    transform?: (this: any, val: T) => any;

    /** defines a custom getter for this property using [`Object.defineProperty()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). */
    get?: (value: T, schematype?: this) => any;

    /** defines a custom setter for this property using [`Object.defineProperty()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). */
    set?: (value: T, schematype?: this) => any;

    /** array of allowed values for this path. Allowed for strings, numbers, and arrays of strings */
    enum?: Array<string | number>

    /** The default [subtype](http://bsonspec.org/spec.html) associated with this buffer when it is stored in MongoDB. Only allowed for buffer paths */
    subtype?: number

    /** The minimum value allowed for this path. Only allowed for numbers and dates. */
    min?: number | Date;

    /** The maximum value allowed for this path. Only allowed for numbers and dates. */
    max?: number | Date;

    /** Defines a TTL index on this path. Only allowed for dates. */
    expires?: Date;

    /** If `true`, Mongoose will skip gathering indexes on subpaths. Only allowed for subdocuments and subdocument arrays. */
    excludeIndexes?: boolean;

    /** If set, overrides the child schema's `_id` option. Only allowed for subdocuments and subdocument arrays. */
    _id?: boolean;

    /** If set, specifies the type of this map's values. Mongoose will cast this map's values to the given type. */
    of?: Function | SchemaTypeOptions<any>;

    /** If true, uses Mongoose's default `_id` settings. Only allowed for ObjectIds */
    auto?: boolean;

    /** Attaches a validator that succeeds if the data string matches the given regular expression, and fails otherwise. */
    match?: RegExp;

    /** If truthy, Mongoose will add a custom setter that lowercases this string using JavaScript's built-in `String#toLowerCase()`. */
    lowercase?: boolean;

    /** If truthy, Mongoose will add a custom setter that removes leading and trailing whitespace using JavaScript's built-in `String#trim()`. */
    trim?: boolean;

    /** If truthy, Mongoose will add a custom setter that uppercases this string using JavaScript's built-in `String#toUpperCase()`. */
    uppercase?: boolean;

    /** If set, Mongoose will add a custom validator that ensures the given string's `length` is at least the given number. */
    minlength?: number;

    /** If set, Mongoose will add a custom validator that ensures the given string's `length` is at most the given number. */
    maxlength?: number;
  }

  interface IndexOptions {
    background?: boolean,
    expires?: number | string
    sparse?: boolean,
    type?: string,
    unique?: boolean
  }

  interface Query<ResultType, DocType extends Document> {
    exec(): Promise<ResultType>;
    exec(callback?: (err: Error | null, res: ResultType) => void): void;

    $where(argument: string | Function): Query<Array<DocType>, DocType>;

    /** Specifies this query as a `count` query. */
    count(callback?: (err: any, count: number) => void): Query<number, DocType>;
    count(criteria: FilterQuery<DocType>, callback?: (err: any, count: number) => void): Query<number, DocType>;

    /** Specifies this query as a `countDocuments` query. */
    countDocuments(callback?: (err: any, count: number) => void): Query<number, DocType>;
    countDocuments(criteria: FilterQuery<DocType>, callback?: (err: any, count: number) => void): Query<number, DocType>;

    /** Creates a `distinct` query: returns the distinct values of the given `field` that match `filter`. */
    distinct(field: string, filter?: FilterQuery<DocType>, callback?: (err: any, count: number) => void): Query<Array<any>, DocType>;

    /** Creates a `estimatedDocumentCount` query: counts the number of documents in the collection. */
    estimatedDocumentCount(options?: QueryOptions, callback?: (err: any, count: number) => void): Query<number, DocType>;

    /** Creates a `find` query: gets a list of documents that match `filter`. */
    find(callback?: (err: any, count: number) => void): Query<Array<DocType>, DocType>;
    find(filter: FilterQuery<DocType>, callback?: (err: any, count: number) => void): Query<Array<DocType>, DocType>;
    find(filter: FilterQuery<DocType>, projection?: any | null, options?: QueryOptions | null, callback?: (err: any, count: number) => void): Query<Array<DocType>, DocType>;

    /** Creates a `findOneAndDelete` query: atomically finds the given document, deletes it, and returns the document as it was before deletion. */
    findOneAndDelete(filter?: FilterQuery<DocType>, options?: QueryOptions | null, callback?: (err: any, doc: DocType | null, res: any) => void): Query<DocType | null, DocType>;

    /** Creates a `findOneAndRemove` query: atomically finds the given document and deletes it. */
    findOneAndRemove(filter?: FilterQuery<DocType>, options?: QueryOptions | null, callback?: (err: any, doc: DocType | null, res: any) => void): Query<DocType | null, DocType>;
    
    /** Creates a `findOneAndUpdate` query: atomically find the first document that matches `filter` and apply `update`. */
    findOneAndUpdate(filter?: FilterQuery<DocType>, update?: UpdateQuery<DocType>, options?: QueryOptions | null, callback?: (err: any, doc: DocType | null, res: any) => void): Query<DocType | null, DocType>;

    /** Creates a `findByIdAndDelete` query, filtering by the given `_id`. */
    findByIdAndDelete(id?: mongodb.ObjectId | any, options?: QueryOptions | null, callback?: (err: any, doc: DocType | null, res: any) => void): Query<DocType | null, DocType>;

    /** Creates a `findOneAndUpdate` query, filtering by the given `_id`. */
    findByIdAndUpdate(id?: mongodb.ObjectId | any, update?: UpdateQuery<DocType>, options?: QueryOptions | null, callback?: (err: any, doc: DocType | null, res: any) => void): Query<DocType | null, DocType>;

    /** Creates a Query, applies the passed conditions, and returns the Query. */
    where(path: string, val?: any): Query<Array<DocType>, DocType>;
  }

  export type FilterQuery<T> = {
    [P in keyof T]?: P extends '_id'
      ? [Extract<T[P], mongodb.ObjectId>] extends [never]
        ? mongodb.Condition<T[P]>
        : mongodb.Condition<T[P] | string | { _id: mongodb.ObjectId }>
      : [Extract<T[P], mongodb.ObjectId>] extends [never]
      ? mongodb.Condition<T[P]>
      : mongodb.Condition<T[P] | string>;
  } &
    mongodb.RootQuerySelector<T>;
  
  export type UpdateQuery<T> = mongodb.UpdateQuery<T> & mongodb.MatchKeysAndValues<T>;

  export type DocumentDefinition<T> = Omit<T, Exclude<keyof Model<T>, '_id'>>
}