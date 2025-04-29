
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Center
 * 
 */
export type Center = $Result.DefaultSelection<Prisma.$CenterPayload>
/**
 * Model Department
 * 
 */
export type Department = $Result.DefaultSelection<Prisma.$DepartmentPayload>
/**
 * Model Claim
 * 
 */
export type Claim = $Result.DefaultSelection<Prisma.$ClaimPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  REGISTRY: 'REGISTRY',
  COORDINATOR: 'COORDINATOR',
  LECTURER: 'LECTURER'
};

export type Role = (typeof Role)[keyof typeof Role]


export const ClaimStatus: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export type ClaimStatus = (typeof ClaimStatus)[keyof typeof ClaimStatus]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type ClaimStatus = $Enums.ClaimStatus

export const ClaimStatus: typeof $Enums.ClaimStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.center`: Exposes CRUD operations for the **Center** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Centers
    * const centers = await prisma.center.findMany()
    * ```
    */
  get center(): Prisma.CenterDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.department`: Exposes CRUD operations for the **Department** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Departments
    * const departments = await prisma.department.findMany()
    * ```
    */
  get department(): Prisma.DepartmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.claim`: Exposes CRUD operations for the **Claim** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Claims
    * const claims = await prisma.claim.findMany()
    * ```
    */
  get claim(): Prisma.ClaimDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Center: 'Center',
    Department: 'Department',
    Claim: 'Claim'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "center" | "department" | "claim"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Center: {
        payload: Prisma.$CenterPayload<ExtArgs>
        fields: Prisma.CenterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CenterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CenterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CenterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CenterPayload>
          }
          findFirst: {
            args: Prisma.CenterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CenterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CenterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CenterPayload>
          }
          findMany: {
            args: Prisma.CenterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CenterPayload>[]
          }
          create: {
            args: Prisma.CenterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CenterPayload>
          }
          createMany: {
            args: Prisma.CenterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CenterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CenterPayload>
          }
          update: {
            args: Prisma.CenterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CenterPayload>
          }
          deleteMany: {
            args: Prisma.CenterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CenterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CenterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CenterPayload>
          }
          aggregate: {
            args: Prisma.CenterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCenter>
          }
          groupBy: {
            args: Prisma.CenterGroupByArgs<ExtArgs>
            result: $Utils.Optional<CenterGroupByOutputType>[]
          }
          count: {
            args: Prisma.CenterCountArgs<ExtArgs>
            result: $Utils.Optional<CenterCountAggregateOutputType> | number
          }
        }
      }
      Department: {
        payload: Prisma.$DepartmentPayload<ExtArgs>
        fields: Prisma.DepartmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DepartmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DepartmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          findFirst: {
            args: Prisma.DepartmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DepartmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          findMany: {
            args: Prisma.DepartmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>[]
          }
          create: {
            args: Prisma.DepartmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          createMany: {
            args: Prisma.DepartmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.DepartmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          update: {
            args: Prisma.DepartmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          deleteMany: {
            args: Prisma.DepartmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DepartmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DepartmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          aggregate: {
            args: Prisma.DepartmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDepartment>
          }
          groupBy: {
            args: Prisma.DepartmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DepartmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DepartmentCountArgs<ExtArgs>
            result: $Utils.Optional<DepartmentCountAggregateOutputType> | number
          }
        }
      }
      Claim: {
        payload: Prisma.$ClaimPayload<ExtArgs>
        fields: Prisma.ClaimFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClaimFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClaimFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimPayload>
          }
          findFirst: {
            args: Prisma.ClaimFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClaimFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimPayload>
          }
          findMany: {
            args: Prisma.ClaimFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimPayload>[]
          }
          create: {
            args: Prisma.ClaimCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimPayload>
          }
          createMany: {
            args: Prisma.ClaimCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ClaimDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimPayload>
          }
          update: {
            args: Prisma.ClaimUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimPayload>
          }
          deleteMany: {
            args: Prisma.ClaimDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClaimUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ClaimUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimPayload>
          }
          aggregate: {
            args: Prisma.ClaimAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClaim>
          }
          groupBy: {
            args: Prisma.ClaimGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClaimGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClaimCountArgs<ExtArgs>
            result: $Utils.Optional<ClaimCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    center?: CenterOmit
    department?: DepartmentOmit
    claim?: ClaimOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    submittedClaims: number
    processedClaims: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submittedClaims?: boolean | UserCountOutputTypeCountSubmittedClaimsArgs
    processedClaims?: boolean | UserCountOutputTypeCountProcessedClaimsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSubmittedClaimsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClaimWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProcessedClaimsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClaimWhereInput
  }


  /**
   * Count Type CenterCountOutputType
   */

  export type CenterCountOutputType = {
    lecturers: number
    departments: number
    claims: number
  }

  export type CenterCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lecturers?: boolean | CenterCountOutputTypeCountLecturersArgs
    departments?: boolean | CenterCountOutputTypeCountDepartmentsArgs
    claims?: boolean | CenterCountOutputTypeCountClaimsArgs
  }

  // Custom InputTypes
  /**
   * CenterCountOutputType without action
   */
  export type CenterCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CenterCountOutputType
     */
    select?: CenterCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CenterCountOutputType without action
   */
  export type CenterCountOutputTypeCountLecturersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * CenterCountOutputType without action
   */
  export type CenterCountOutputTypeCountDepartmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepartmentWhereInput
  }

  /**
   * CenterCountOutputType without action
   */
  export type CenterCountOutputTypeCountClaimsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClaimWhereInput
  }


  /**
   * Count Type DepartmentCountOutputType
   */

  export type DepartmentCountOutputType = {
    lecturers: number
  }

  export type DepartmentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lecturers?: boolean | DepartmentCountOutputTypeCountLecturersArgs
  }

  // Custom InputTypes
  /**
   * DepartmentCountOutputType without action
   */
  export type DepartmentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentCountOutputType
     */
    select?: DepartmentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DepartmentCountOutputType without action
   */
  export type DepartmentCountOutputTypeCountLecturersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    password: string | null
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
    lecturerCenterId: string | null
    departmentId: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    password: string | null
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
    lecturerCenterId: string | null
    departmentId: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    password: number
    role: number
    createdAt: number
    updatedAt: number
    lecturerCenterId: number
    departmentId: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    lecturerCenterId?: true
    departmentId?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    lecturerCenterId?: true
    departmentId?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    lecturerCenterId?: true
    departmentId?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string | null
    password: string
    role: $Enums.Role
    createdAt: Date
    updatedAt: Date
    lecturerCenterId: string | null
    departmentId: string | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lecturerCenterId?: boolean
    departmentId?: boolean
    coordinatedCenter?: boolean | User$coordinatedCenterArgs<ExtArgs>
    lecturerCenter?: boolean | User$lecturerCenterArgs<ExtArgs>
    department?: boolean | User$departmentArgs<ExtArgs>
    submittedClaims?: boolean | User$submittedClaimsArgs<ExtArgs>
    processedClaims?: boolean | User$processedClaimsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>



  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lecturerCenterId?: boolean
    departmentId?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "password" | "role" | "createdAt" | "updatedAt" | "lecturerCenterId" | "departmentId", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    coordinatedCenter?: boolean | User$coordinatedCenterArgs<ExtArgs>
    lecturerCenter?: boolean | User$lecturerCenterArgs<ExtArgs>
    department?: boolean | User$departmentArgs<ExtArgs>
    submittedClaims?: boolean | User$submittedClaimsArgs<ExtArgs>
    processedClaims?: boolean | User$processedClaimsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      coordinatedCenter: Prisma.$CenterPayload<ExtArgs> | null
      lecturerCenter: Prisma.$CenterPayload<ExtArgs> | null
      department: Prisma.$DepartmentPayload<ExtArgs> | null
      submittedClaims: Prisma.$ClaimPayload<ExtArgs>[]
      processedClaims: Prisma.$ClaimPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string | null
      password: string
      role: $Enums.Role
      createdAt: Date
      updatedAt: Date
      lecturerCenterId: string | null
      departmentId: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    coordinatedCenter<T extends User$coordinatedCenterArgs<ExtArgs> = {}>(args?: Subset<T, User$coordinatedCenterArgs<ExtArgs>>): Prisma__CenterClient<$Result.GetResult<Prisma.$CenterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    lecturerCenter<T extends User$lecturerCenterArgs<ExtArgs> = {}>(args?: Subset<T, User$lecturerCenterArgs<ExtArgs>>): Prisma__CenterClient<$Result.GetResult<Prisma.$CenterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    department<T extends User$departmentArgs<ExtArgs> = {}>(args?: Subset<T, User$departmentArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    submittedClaims<T extends User$submittedClaimsArgs<ExtArgs> = {}>(args?: Subset<T, User$submittedClaimsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    processedClaims<T extends User$processedClaimsArgs<ExtArgs> = {}>(args?: Subset<T, User$processedClaimsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly lecturerCenterId: FieldRef<"User", 'String'>
    readonly departmentId: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.coordinatedCenter
   */
  export type User$coordinatedCenterArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Center
     */
    select?: CenterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Center
     */
    omit?: CenterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CenterInclude<ExtArgs> | null
    where?: CenterWhereInput
  }

  /**
   * User.lecturerCenter
   */
  export type User$lecturerCenterArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Center
     */
    select?: CenterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Center
     */
    omit?: CenterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CenterInclude<ExtArgs> | null
    where?: CenterWhereInput
  }

  /**
   * User.department
   */
  export type User$departmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    where?: DepartmentWhereInput
  }

  /**
   * User.submittedClaims
   */
  export type User$submittedClaimsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Claim
     */
    omit?: ClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
    where?: ClaimWhereInput
    orderBy?: ClaimOrderByWithRelationInput | ClaimOrderByWithRelationInput[]
    cursor?: ClaimWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClaimScalarFieldEnum | ClaimScalarFieldEnum[]
  }

  /**
   * User.processedClaims
   */
  export type User$processedClaimsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Claim
     */
    omit?: ClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
    where?: ClaimWhereInput
    orderBy?: ClaimOrderByWithRelationInput | ClaimOrderByWithRelationInput[]
    cursor?: ClaimWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClaimScalarFieldEnum | ClaimScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Center
   */

  export type AggregateCenter = {
    _count: CenterCountAggregateOutputType | null
    _min: CenterMinAggregateOutputType | null
    _max: CenterMaxAggregateOutputType | null
  }

  export type CenterMinAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
    coordinatorId: string | null
  }

  export type CenterMaxAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
    coordinatorId: string | null
  }

  export type CenterCountAggregateOutputType = {
    id: number
    name: number
    createdAt: number
    updatedAt: number
    coordinatorId: number
    _all: number
  }


  export type CenterMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    coordinatorId?: true
  }

  export type CenterMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    coordinatorId?: true
  }

  export type CenterCountAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    coordinatorId?: true
    _all?: true
  }

  export type CenterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Center to aggregate.
     */
    where?: CenterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Centers to fetch.
     */
    orderBy?: CenterOrderByWithRelationInput | CenterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CenterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Centers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Centers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Centers
    **/
    _count?: true | CenterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CenterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CenterMaxAggregateInputType
  }

  export type GetCenterAggregateType<T extends CenterAggregateArgs> = {
        [P in keyof T & keyof AggregateCenter]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCenter[P]>
      : GetScalarType<T[P], AggregateCenter[P]>
  }




  export type CenterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CenterWhereInput
    orderBy?: CenterOrderByWithAggregationInput | CenterOrderByWithAggregationInput[]
    by: CenterScalarFieldEnum[] | CenterScalarFieldEnum
    having?: CenterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CenterCountAggregateInputType | true
    _min?: CenterMinAggregateInputType
    _max?: CenterMaxAggregateInputType
  }

  export type CenterGroupByOutputType = {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    coordinatorId: string
    _count: CenterCountAggregateOutputType | null
    _min: CenterMinAggregateOutputType | null
    _max: CenterMaxAggregateOutputType | null
  }

  type GetCenterGroupByPayload<T extends CenterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CenterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CenterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CenterGroupByOutputType[P]>
            : GetScalarType<T[P], CenterGroupByOutputType[P]>
        }
      >
    >


  export type CenterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    coordinatorId?: boolean
    coordinator?: boolean | UserDefaultArgs<ExtArgs>
    lecturers?: boolean | Center$lecturersArgs<ExtArgs>
    departments?: boolean | Center$departmentsArgs<ExtArgs>
    claims?: boolean | Center$claimsArgs<ExtArgs>
    _count?: boolean | CenterCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["center"]>



  export type CenterSelectScalar = {
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    coordinatorId?: boolean
  }

  export type CenterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "createdAt" | "updatedAt" | "coordinatorId", ExtArgs["result"]["center"]>
  export type CenterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    coordinator?: boolean | UserDefaultArgs<ExtArgs>
    lecturers?: boolean | Center$lecturersArgs<ExtArgs>
    departments?: boolean | Center$departmentsArgs<ExtArgs>
    claims?: boolean | Center$claimsArgs<ExtArgs>
    _count?: boolean | CenterCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $CenterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Center"
    objects: {
      coordinator: Prisma.$UserPayload<ExtArgs>
      lecturers: Prisma.$UserPayload<ExtArgs>[]
      departments: Prisma.$DepartmentPayload<ExtArgs>[]
      claims: Prisma.$ClaimPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      createdAt: Date
      updatedAt: Date
      coordinatorId: string
    }, ExtArgs["result"]["center"]>
    composites: {}
  }

  type CenterGetPayload<S extends boolean | null | undefined | CenterDefaultArgs> = $Result.GetResult<Prisma.$CenterPayload, S>

  type CenterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CenterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CenterCountAggregateInputType | true
    }

  export interface CenterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Center'], meta: { name: 'Center' } }
    /**
     * Find zero or one Center that matches the filter.
     * @param {CenterFindUniqueArgs} args - Arguments to find a Center
     * @example
     * // Get one Center
     * const center = await prisma.center.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CenterFindUniqueArgs>(args: SelectSubset<T, CenterFindUniqueArgs<ExtArgs>>): Prisma__CenterClient<$Result.GetResult<Prisma.$CenterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Center that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CenterFindUniqueOrThrowArgs} args - Arguments to find a Center
     * @example
     * // Get one Center
     * const center = await prisma.center.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CenterFindUniqueOrThrowArgs>(args: SelectSubset<T, CenterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CenterClient<$Result.GetResult<Prisma.$CenterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Center that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CenterFindFirstArgs} args - Arguments to find a Center
     * @example
     * // Get one Center
     * const center = await prisma.center.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CenterFindFirstArgs>(args?: SelectSubset<T, CenterFindFirstArgs<ExtArgs>>): Prisma__CenterClient<$Result.GetResult<Prisma.$CenterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Center that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CenterFindFirstOrThrowArgs} args - Arguments to find a Center
     * @example
     * // Get one Center
     * const center = await prisma.center.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CenterFindFirstOrThrowArgs>(args?: SelectSubset<T, CenterFindFirstOrThrowArgs<ExtArgs>>): Prisma__CenterClient<$Result.GetResult<Prisma.$CenterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Centers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CenterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Centers
     * const centers = await prisma.center.findMany()
     * 
     * // Get first 10 Centers
     * const centers = await prisma.center.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const centerWithIdOnly = await prisma.center.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CenterFindManyArgs>(args?: SelectSubset<T, CenterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CenterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Center.
     * @param {CenterCreateArgs} args - Arguments to create a Center.
     * @example
     * // Create one Center
     * const Center = await prisma.center.create({
     *   data: {
     *     // ... data to create a Center
     *   }
     * })
     * 
     */
    create<T extends CenterCreateArgs>(args: SelectSubset<T, CenterCreateArgs<ExtArgs>>): Prisma__CenterClient<$Result.GetResult<Prisma.$CenterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Centers.
     * @param {CenterCreateManyArgs} args - Arguments to create many Centers.
     * @example
     * // Create many Centers
     * const center = await prisma.center.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CenterCreateManyArgs>(args?: SelectSubset<T, CenterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Center.
     * @param {CenterDeleteArgs} args - Arguments to delete one Center.
     * @example
     * // Delete one Center
     * const Center = await prisma.center.delete({
     *   where: {
     *     // ... filter to delete one Center
     *   }
     * })
     * 
     */
    delete<T extends CenterDeleteArgs>(args: SelectSubset<T, CenterDeleteArgs<ExtArgs>>): Prisma__CenterClient<$Result.GetResult<Prisma.$CenterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Center.
     * @param {CenterUpdateArgs} args - Arguments to update one Center.
     * @example
     * // Update one Center
     * const center = await prisma.center.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CenterUpdateArgs>(args: SelectSubset<T, CenterUpdateArgs<ExtArgs>>): Prisma__CenterClient<$Result.GetResult<Prisma.$CenterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Centers.
     * @param {CenterDeleteManyArgs} args - Arguments to filter Centers to delete.
     * @example
     * // Delete a few Centers
     * const { count } = await prisma.center.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CenterDeleteManyArgs>(args?: SelectSubset<T, CenterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Centers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CenterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Centers
     * const center = await prisma.center.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CenterUpdateManyArgs>(args: SelectSubset<T, CenterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Center.
     * @param {CenterUpsertArgs} args - Arguments to update or create a Center.
     * @example
     * // Update or create a Center
     * const center = await prisma.center.upsert({
     *   create: {
     *     // ... data to create a Center
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Center we want to update
     *   }
     * })
     */
    upsert<T extends CenterUpsertArgs>(args: SelectSubset<T, CenterUpsertArgs<ExtArgs>>): Prisma__CenterClient<$Result.GetResult<Prisma.$CenterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Centers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CenterCountArgs} args - Arguments to filter Centers to count.
     * @example
     * // Count the number of Centers
     * const count = await prisma.center.count({
     *   where: {
     *     // ... the filter for the Centers we want to count
     *   }
     * })
    **/
    count<T extends CenterCountArgs>(
      args?: Subset<T, CenterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CenterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Center.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CenterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CenterAggregateArgs>(args: Subset<T, CenterAggregateArgs>): Prisma.PrismaPromise<GetCenterAggregateType<T>>

    /**
     * Group by Center.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CenterGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CenterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CenterGroupByArgs['orderBy'] }
        : { orderBy?: CenterGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CenterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCenterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Center model
   */
  readonly fields: CenterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Center.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CenterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    coordinator<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    lecturers<T extends Center$lecturersArgs<ExtArgs> = {}>(args?: Subset<T, Center$lecturersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    departments<T extends Center$departmentsArgs<ExtArgs> = {}>(args?: Subset<T, Center$departmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    claims<T extends Center$claimsArgs<ExtArgs> = {}>(args?: Subset<T, Center$claimsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Center model
   */
  interface CenterFieldRefs {
    readonly id: FieldRef<"Center", 'String'>
    readonly name: FieldRef<"Center", 'String'>
    readonly createdAt: FieldRef<"Center", 'DateTime'>
    readonly updatedAt: FieldRef<"Center", 'DateTime'>
    readonly coordinatorId: FieldRef<"Center", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Center findUnique
   */
  export type CenterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Center
     */
    select?: CenterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Center
     */
    omit?: CenterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CenterInclude<ExtArgs> | null
    /**
     * Filter, which Center to fetch.
     */
    where: CenterWhereUniqueInput
  }

  /**
   * Center findUniqueOrThrow
   */
  export type CenterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Center
     */
    select?: CenterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Center
     */
    omit?: CenterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CenterInclude<ExtArgs> | null
    /**
     * Filter, which Center to fetch.
     */
    where: CenterWhereUniqueInput
  }

  /**
   * Center findFirst
   */
  export type CenterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Center
     */
    select?: CenterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Center
     */
    omit?: CenterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CenterInclude<ExtArgs> | null
    /**
     * Filter, which Center to fetch.
     */
    where?: CenterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Centers to fetch.
     */
    orderBy?: CenterOrderByWithRelationInput | CenterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Centers.
     */
    cursor?: CenterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Centers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Centers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Centers.
     */
    distinct?: CenterScalarFieldEnum | CenterScalarFieldEnum[]
  }

  /**
   * Center findFirstOrThrow
   */
  export type CenterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Center
     */
    select?: CenterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Center
     */
    omit?: CenterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CenterInclude<ExtArgs> | null
    /**
     * Filter, which Center to fetch.
     */
    where?: CenterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Centers to fetch.
     */
    orderBy?: CenterOrderByWithRelationInput | CenterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Centers.
     */
    cursor?: CenterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Centers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Centers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Centers.
     */
    distinct?: CenterScalarFieldEnum | CenterScalarFieldEnum[]
  }

  /**
   * Center findMany
   */
  export type CenterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Center
     */
    select?: CenterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Center
     */
    omit?: CenterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CenterInclude<ExtArgs> | null
    /**
     * Filter, which Centers to fetch.
     */
    where?: CenterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Centers to fetch.
     */
    orderBy?: CenterOrderByWithRelationInput | CenterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Centers.
     */
    cursor?: CenterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Centers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Centers.
     */
    skip?: number
    distinct?: CenterScalarFieldEnum | CenterScalarFieldEnum[]
  }

  /**
   * Center create
   */
  export type CenterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Center
     */
    select?: CenterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Center
     */
    omit?: CenterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CenterInclude<ExtArgs> | null
    /**
     * The data needed to create a Center.
     */
    data: XOR<CenterCreateInput, CenterUncheckedCreateInput>
  }

  /**
   * Center createMany
   */
  export type CenterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Centers.
     */
    data: CenterCreateManyInput | CenterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Center update
   */
  export type CenterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Center
     */
    select?: CenterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Center
     */
    omit?: CenterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CenterInclude<ExtArgs> | null
    /**
     * The data needed to update a Center.
     */
    data: XOR<CenterUpdateInput, CenterUncheckedUpdateInput>
    /**
     * Choose, which Center to update.
     */
    where: CenterWhereUniqueInput
  }

  /**
   * Center updateMany
   */
  export type CenterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Centers.
     */
    data: XOR<CenterUpdateManyMutationInput, CenterUncheckedUpdateManyInput>
    /**
     * Filter which Centers to update
     */
    where?: CenterWhereInput
    /**
     * Limit how many Centers to update.
     */
    limit?: number
  }

  /**
   * Center upsert
   */
  export type CenterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Center
     */
    select?: CenterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Center
     */
    omit?: CenterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CenterInclude<ExtArgs> | null
    /**
     * The filter to search for the Center to update in case it exists.
     */
    where: CenterWhereUniqueInput
    /**
     * In case the Center found by the `where` argument doesn't exist, create a new Center with this data.
     */
    create: XOR<CenterCreateInput, CenterUncheckedCreateInput>
    /**
     * In case the Center was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CenterUpdateInput, CenterUncheckedUpdateInput>
  }

  /**
   * Center delete
   */
  export type CenterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Center
     */
    select?: CenterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Center
     */
    omit?: CenterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CenterInclude<ExtArgs> | null
    /**
     * Filter which Center to delete.
     */
    where: CenterWhereUniqueInput
  }

  /**
   * Center deleteMany
   */
  export type CenterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Centers to delete
     */
    where?: CenterWhereInput
    /**
     * Limit how many Centers to delete.
     */
    limit?: number
  }

  /**
   * Center.lecturers
   */
  export type Center$lecturersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Center.departments
   */
  export type Center$departmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    where?: DepartmentWhereInput
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    cursor?: DepartmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Center.claims
   */
  export type Center$claimsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Claim
     */
    omit?: ClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
    where?: ClaimWhereInput
    orderBy?: ClaimOrderByWithRelationInput | ClaimOrderByWithRelationInput[]
    cursor?: ClaimWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClaimScalarFieldEnum | ClaimScalarFieldEnum[]
  }

  /**
   * Center without action
   */
  export type CenterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Center
     */
    select?: CenterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Center
     */
    omit?: CenterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CenterInclude<ExtArgs> | null
  }


  /**
   * Model Department
   */

  export type AggregateDepartment = {
    _count: DepartmentCountAggregateOutputType | null
    _min: DepartmentMinAggregateOutputType | null
    _max: DepartmentMaxAggregateOutputType | null
  }

  export type DepartmentMinAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
    centerId: string | null
  }

  export type DepartmentMaxAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
    centerId: string | null
  }

  export type DepartmentCountAggregateOutputType = {
    id: number
    name: number
    createdAt: number
    updatedAt: number
    centerId: number
    _all: number
  }


  export type DepartmentMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    centerId?: true
  }

  export type DepartmentMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    centerId?: true
  }

  export type DepartmentCountAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    centerId?: true
    _all?: true
  }

  export type DepartmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Department to aggregate.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Departments
    **/
    _count?: true | DepartmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DepartmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DepartmentMaxAggregateInputType
  }

  export type GetDepartmentAggregateType<T extends DepartmentAggregateArgs> = {
        [P in keyof T & keyof AggregateDepartment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDepartment[P]>
      : GetScalarType<T[P], AggregateDepartment[P]>
  }




  export type DepartmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepartmentWhereInput
    orderBy?: DepartmentOrderByWithAggregationInput | DepartmentOrderByWithAggregationInput[]
    by: DepartmentScalarFieldEnum[] | DepartmentScalarFieldEnum
    having?: DepartmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DepartmentCountAggregateInputType | true
    _min?: DepartmentMinAggregateInputType
    _max?: DepartmentMaxAggregateInputType
  }

  export type DepartmentGroupByOutputType = {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    centerId: string
    _count: DepartmentCountAggregateOutputType | null
    _min: DepartmentMinAggregateOutputType | null
    _max: DepartmentMaxAggregateOutputType | null
  }

  type GetDepartmentGroupByPayload<T extends DepartmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DepartmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DepartmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DepartmentGroupByOutputType[P]>
            : GetScalarType<T[P], DepartmentGroupByOutputType[P]>
        }
      >
    >


  export type DepartmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    centerId?: boolean
    center?: boolean | CenterDefaultArgs<ExtArgs>
    lecturers?: boolean | Department$lecturersArgs<ExtArgs>
    _count?: boolean | DepartmentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["department"]>



  export type DepartmentSelectScalar = {
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    centerId?: boolean
  }

  export type DepartmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "createdAt" | "updatedAt" | "centerId", ExtArgs["result"]["department"]>
  export type DepartmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    center?: boolean | CenterDefaultArgs<ExtArgs>
    lecturers?: boolean | Department$lecturersArgs<ExtArgs>
    _count?: boolean | DepartmentCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $DepartmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Department"
    objects: {
      center: Prisma.$CenterPayload<ExtArgs>
      lecturers: Prisma.$UserPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      createdAt: Date
      updatedAt: Date
      centerId: string
    }, ExtArgs["result"]["department"]>
    composites: {}
  }

  type DepartmentGetPayload<S extends boolean | null | undefined | DepartmentDefaultArgs> = $Result.GetResult<Prisma.$DepartmentPayload, S>

  type DepartmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DepartmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DepartmentCountAggregateInputType | true
    }

  export interface DepartmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Department'], meta: { name: 'Department' } }
    /**
     * Find zero or one Department that matches the filter.
     * @param {DepartmentFindUniqueArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DepartmentFindUniqueArgs>(args: SelectSubset<T, DepartmentFindUniqueArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Department that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DepartmentFindUniqueOrThrowArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DepartmentFindUniqueOrThrowArgs>(args: SelectSubset<T, DepartmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Department that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindFirstArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DepartmentFindFirstArgs>(args?: SelectSubset<T, DepartmentFindFirstArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Department that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindFirstOrThrowArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DepartmentFindFirstOrThrowArgs>(args?: SelectSubset<T, DepartmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Departments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Departments
     * const departments = await prisma.department.findMany()
     * 
     * // Get first 10 Departments
     * const departments = await prisma.department.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const departmentWithIdOnly = await prisma.department.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DepartmentFindManyArgs>(args?: SelectSubset<T, DepartmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Department.
     * @param {DepartmentCreateArgs} args - Arguments to create a Department.
     * @example
     * // Create one Department
     * const Department = await prisma.department.create({
     *   data: {
     *     // ... data to create a Department
     *   }
     * })
     * 
     */
    create<T extends DepartmentCreateArgs>(args: SelectSubset<T, DepartmentCreateArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Departments.
     * @param {DepartmentCreateManyArgs} args - Arguments to create many Departments.
     * @example
     * // Create many Departments
     * const department = await prisma.department.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DepartmentCreateManyArgs>(args?: SelectSubset<T, DepartmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Department.
     * @param {DepartmentDeleteArgs} args - Arguments to delete one Department.
     * @example
     * // Delete one Department
     * const Department = await prisma.department.delete({
     *   where: {
     *     // ... filter to delete one Department
     *   }
     * })
     * 
     */
    delete<T extends DepartmentDeleteArgs>(args: SelectSubset<T, DepartmentDeleteArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Department.
     * @param {DepartmentUpdateArgs} args - Arguments to update one Department.
     * @example
     * // Update one Department
     * const department = await prisma.department.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DepartmentUpdateArgs>(args: SelectSubset<T, DepartmentUpdateArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Departments.
     * @param {DepartmentDeleteManyArgs} args - Arguments to filter Departments to delete.
     * @example
     * // Delete a few Departments
     * const { count } = await prisma.department.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DepartmentDeleteManyArgs>(args?: SelectSubset<T, DepartmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Departments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Departments
     * const department = await prisma.department.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DepartmentUpdateManyArgs>(args: SelectSubset<T, DepartmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Department.
     * @param {DepartmentUpsertArgs} args - Arguments to update or create a Department.
     * @example
     * // Update or create a Department
     * const department = await prisma.department.upsert({
     *   create: {
     *     // ... data to create a Department
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Department we want to update
     *   }
     * })
     */
    upsert<T extends DepartmentUpsertArgs>(args: SelectSubset<T, DepartmentUpsertArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Departments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentCountArgs} args - Arguments to filter Departments to count.
     * @example
     * // Count the number of Departments
     * const count = await prisma.department.count({
     *   where: {
     *     // ... the filter for the Departments we want to count
     *   }
     * })
    **/
    count<T extends DepartmentCountArgs>(
      args?: Subset<T, DepartmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DepartmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Department.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DepartmentAggregateArgs>(args: Subset<T, DepartmentAggregateArgs>): Prisma.PrismaPromise<GetDepartmentAggregateType<T>>

    /**
     * Group by Department.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DepartmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DepartmentGroupByArgs['orderBy'] }
        : { orderBy?: DepartmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DepartmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDepartmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Department model
   */
  readonly fields: DepartmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Department.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DepartmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    center<T extends CenterDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CenterDefaultArgs<ExtArgs>>): Prisma__CenterClient<$Result.GetResult<Prisma.$CenterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    lecturers<T extends Department$lecturersArgs<ExtArgs> = {}>(args?: Subset<T, Department$lecturersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Department model
   */
  interface DepartmentFieldRefs {
    readonly id: FieldRef<"Department", 'String'>
    readonly name: FieldRef<"Department", 'String'>
    readonly createdAt: FieldRef<"Department", 'DateTime'>
    readonly updatedAt: FieldRef<"Department", 'DateTime'>
    readonly centerId: FieldRef<"Department", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Department findUnique
   */
  export type DepartmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department findUniqueOrThrow
   */
  export type DepartmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department findFirst
   */
  export type DepartmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Departments.
     */
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department findFirstOrThrow
   */
  export type DepartmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Departments.
     */
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department findMany
   */
  export type DepartmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Departments to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department create
   */
  export type DepartmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Department.
     */
    data: XOR<DepartmentCreateInput, DepartmentUncheckedCreateInput>
  }

  /**
   * Department createMany
   */
  export type DepartmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Departments.
     */
    data: DepartmentCreateManyInput | DepartmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Department update
   */
  export type DepartmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Department.
     */
    data: XOR<DepartmentUpdateInput, DepartmentUncheckedUpdateInput>
    /**
     * Choose, which Department to update.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department updateMany
   */
  export type DepartmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Departments.
     */
    data: XOR<DepartmentUpdateManyMutationInput, DepartmentUncheckedUpdateManyInput>
    /**
     * Filter which Departments to update
     */
    where?: DepartmentWhereInput
    /**
     * Limit how many Departments to update.
     */
    limit?: number
  }

  /**
   * Department upsert
   */
  export type DepartmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Department to update in case it exists.
     */
    where: DepartmentWhereUniqueInput
    /**
     * In case the Department found by the `where` argument doesn't exist, create a new Department with this data.
     */
    create: XOR<DepartmentCreateInput, DepartmentUncheckedCreateInput>
    /**
     * In case the Department was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DepartmentUpdateInput, DepartmentUncheckedUpdateInput>
  }

  /**
   * Department delete
   */
  export type DepartmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter which Department to delete.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department deleteMany
   */
  export type DepartmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Departments to delete
     */
    where?: DepartmentWhereInput
    /**
     * Limit how many Departments to delete.
     */
    limit?: number
  }

  /**
   * Department.lecturers
   */
  export type Department$lecturersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Department without action
   */
  export type DepartmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
  }


  /**
   * Model Claim
   */

  export type AggregateClaim = {
    _count: ClaimCountAggregateOutputType | null
    _avg: ClaimAvgAggregateOutputType | null
    _sum: ClaimSumAggregateOutputType | null
    _min: ClaimMinAggregateOutputType | null
    _max: ClaimMaxAggregateOutputType | null
  }

  export type ClaimAvgAggregateOutputType = {
    amount: number | null
  }

  export type ClaimSumAggregateOutputType = {
    amount: number | null
  }

  export type ClaimMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    amount: number | null
    status: $Enums.ClaimStatus | null
    submittedAt: Date | null
    updatedAt: Date | null
    processedAt: Date | null
    submittedById: string | null
    centerId: string | null
    processedById: string | null
  }

  export type ClaimMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    amount: number | null
    status: $Enums.ClaimStatus | null
    submittedAt: Date | null
    updatedAt: Date | null
    processedAt: Date | null
    submittedById: string | null
    centerId: string | null
    processedById: string | null
  }

  export type ClaimCountAggregateOutputType = {
    id: number
    title: number
    description: number
    amount: number
    status: number
    submittedAt: number
    updatedAt: number
    processedAt: number
    submittedById: number
    centerId: number
    processedById: number
    _all: number
  }


  export type ClaimAvgAggregateInputType = {
    amount?: true
  }

  export type ClaimSumAggregateInputType = {
    amount?: true
  }

  export type ClaimMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    amount?: true
    status?: true
    submittedAt?: true
    updatedAt?: true
    processedAt?: true
    submittedById?: true
    centerId?: true
    processedById?: true
  }

  export type ClaimMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    amount?: true
    status?: true
    submittedAt?: true
    updatedAt?: true
    processedAt?: true
    submittedById?: true
    centerId?: true
    processedById?: true
  }

  export type ClaimCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    amount?: true
    status?: true
    submittedAt?: true
    updatedAt?: true
    processedAt?: true
    submittedById?: true
    centerId?: true
    processedById?: true
    _all?: true
  }

  export type ClaimAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Claim to aggregate.
     */
    where?: ClaimWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Claims to fetch.
     */
    orderBy?: ClaimOrderByWithRelationInput | ClaimOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClaimWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Claims from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Claims.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Claims
    **/
    _count?: true | ClaimCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClaimAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClaimSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClaimMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClaimMaxAggregateInputType
  }

  export type GetClaimAggregateType<T extends ClaimAggregateArgs> = {
        [P in keyof T & keyof AggregateClaim]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClaim[P]>
      : GetScalarType<T[P], AggregateClaim[P]>
  }




  export type ClaimGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClaimWhereInput
    orderBy?: ClaimOrderByWithAggregationInput | ClaimOrderByWithAggregationInput[]
    by: ClaimScalarFieldEnum[] | ClaimScalarFieldEnum
    having?: ClaimScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClaimCountAggregateInputType | true
    _avg?: ClaimAvgAggregateInputType
    _sum?: ClaimSumAggregateInputType
    _min?: ClaimMinAggregateInputType
    _max?: ClaimMaxAggregateInputType
  }

  export type ClaimGroupByOutputType = {
    id: string
    title: string
    description: string | null
    amount: number
    status: $Enums.ClaimStatus
    submittedAt: Date
    updatedAt: Date
    processedAt: Date | null
    submittedById: string
    centerId: string
    processedById: string | null
    _count: ClaimCountAggregateOutputType | null
    _avg: ClaimAvgAggregateOutputType | null
    _sum: ClaimSumAggregateOutputType | null
    _min: ClaimMinAggregateOutputType | null
    _max: ClaimMaxAggregateOutputType | null
  }

  type GetClaimGroupByPayload<T extends ClaimGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClaimGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClaimGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClaimGroupByOutputType[P]>
            : GetScalarType<T[P], ClaimGroupByOutputType[P]>
        }
      >
    >


  export type ClaimSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    amount?: boolean
    status?: boolean
    submittedAt?: boolean
    updatedAt?: boolean
    processedAt?: boolean
    submittedById?: boolean
    centerId?: boolean
    processedById?: boolean
    submittedBy?: boolean | UserDefaultArgs<ExtArgs>
    center?: boolean | CenterDefaultArgs<ExtArgs>
    processedBy?: boolean | Claim$processedByArgs<ExtArgs>
  }, ExtArgs["result"]["claim"]>



  export type ClaimSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    amount?: boolean
    status?: boolean
    submittedAt?: boolean
    updatedAt?: boolean
    processedAt?: boolean
    submittedById?: boolean
    centerId?: boolean
    processedById?: boolean
  }

  export type ClaimOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "amount" | "status" | "submittedAt" | "updatedAt" | "processedAt" | "submittedById" | "centerId" | "processedById", ExtArgs["result"]["claim"]>
  export type ClaimInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submittedBy?: boolean | UserDefaultArgs<ExtArgs>
    center?: boolean | CenterDefaultArgs<ExtArgs>
    processedBy?: boolean | Claim$processedByArgs<ExtArgs>
  }

  export type $ClaimPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Claim"
    objects: {
      submittedBy: Prisma.$UserPayload<ExtArgs>
      center: Prisma.$CenterPayload<ExtArgs>
      processedBy: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string | null
      amount: number
      status: $Enums.ClaimStatus
      submittedAt: Date
      updatedAt: Date
      processedAt: Date | null
      submittedById: string
      centerId: string
      processedById: string | null
    }, ExtArgs["result"]["claim"]>
    composites: {}
  }

  type ClaimGetPayload<S extends boolean | null | undefined | ClaimDefaultArgs> = $Result.GetResult<Prisma.$ClaimPayload, S>

  type ClaimCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClaimFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClaimCountAggregateInputType | true
    }

  export interface ClaimDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Claim'], meta: { name: 'Claim' } }
    /**
     * Find zero or one Claim that matches the filter.
     * @param {ClaimFindUniqueArgs} args - Arguments to find a Claim
     * @example
     * // Get one Claim
     * const claim = await prisma.claim.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClaimFindUniqueArgs>(args: SelectSubset<T, ClaimFindUniqueArgs<ExtArgs>>): Prisma__ClaimClient<$Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Claim that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClaimFindUniqueOrThrowArgs} args - Arguments to find a Claim
     * @example
     * // Get one Claim
     * const claim = await prisma.claim.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClaimFindUniqueOrThrowArgs>(args: SelectSubset<T, ClaimFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClaimClient<$Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Claim that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClaimFindFirstArgs} args - Arguments to find a Claim
     * @example
     * // Get one Claim
     * const claim = await prisma.claim.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClaimFindFirstArgs>(args?: SelectSubset<T, ClaimFindFirstArgs<ExtArgs>>): Prisma__ClaimClient<$Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Claim that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClaimFindFirstOrThrowArgs} args - Arguments to find a Claim
     * @example
     * // Get one Claim
     * const claim = await prisma.claim.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClaimFindFirstOrThrowArgs>(args?: SelectSubset<T, ClaimFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClaimClient<$Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Claims that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClaimFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Claims
     * const claims = await prisma.claim.findMany()
     * 
     * // Get first 10 Claims
     * const claims = await prisma.claim.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const claimWithIdOnly = await prisma.claim.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClaimFindManyArgs>(args?: SelectSubset<T, ClaimFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Claim.
     * @param {ClaimCreateArgs} args - Arguments to create a Claim.
     * @example
     * // Create one Claim
     * const Claim = await prisma.claim.create({
     *   data: {
     *     // ... data to create a Claim
     *   }
     * })
     * 
     */
    create<T extends ClaimCreateArgs>(args: SelectSubset<T, ClaimCreateArgs<ExtArgs>>): Prisma__ClaimClient<$Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Claims.
     * @param {ClaimCreateManyArgs} args - Arguments to create many Claims.
     * @example
     * // Create many Claims
     * const claim = await prisma.claim.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClaimCreateManyArgs>(args?: SelectSubset<T, ClaimCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Claim.
     * @param {ClaimDeleteArgs} args - Arguments to delete one Claim.
     * @example
     * // Delete one Claim
     * const Claim = await prisma.claim.delete({
     *   where: {
     *     // ... filter to delete one Claim
     *   }
     * })
     * 
     */
    delete<T extends ClaimDeleteArgs>(args: SelectSubset<T, ClaimDeleteArgs<ExtArgs>>): Prisma__ClaimClient<$Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Claim.
     * @param {ClaimUpdateArgs} args - Arguments to update one Claim.
     * @example
     * // Update one Claim
     * const claim = await prisma.claim.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClaimUpdateArgs>(args: SelectSubset<T, ClaimUpdateArgs<ExtArgs>>): Prisma__ClaimClient<$Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Claims.
     * @param {ClaimDeleteManyArgs} args - Arguments to filter Claims to delete.
     * @example
     * // Delete a few Claims
     * const { count } = await prisma.claim.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClaimDeleteManyArgs>(args?: SelectSubset<T, ClaimDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Claims.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClaimUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Claims
     * const claim = await prisma.claim.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClaimUpdateManyArgs>(args: SelectSubset<T, ClaimUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Claim.
     * @param {ClaimUpsertArgs} args - Arguments to update or create a Claim.
     * @example
     * // Update or create a Claim
     * const claim = await prisma.claim.upsert({
     *   create: {
     *     // ... data to create a Claim
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Claim we want to update
     *   }
     * })
     */
    upsert<T extends ClaimUpsertArgs>(args: SelectSubset<T, ClaimUpsertArgs<ExtArgs>>): Prisma__ClaimClient<$Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Claims.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClaimCountArgs} args - Arguments to filter Claims to count.
     * @example
     * // Count the number of Claims
     * const count = await prisma.claim.count({
     *   where: {
     *     // ... the filter for the Claims we want to count
     *   }
     * })
    **/
    count<T extends ClaimCountArgs>(
      args?: Subset<T, ClaimCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClaimCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Claim.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClaimAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClaimAggregateArgs>(args: Subset<T, ClaimAggregateArgs>): Prisma.PrismaPromise<GetClaimAggregateType<T>>

    /**
     * Group by Claim.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClaimGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClaimGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClaimGroupByArgs['orderBy'] }
        : { orderBy?: ClaimGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClaimGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClaimGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Claim model
   */
  readonly fields: ClaimFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Claim.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClaimClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    submittedBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    center<T extends CenterDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CenterDefaultArgs<ExtArgs>>): Prisma__CenterClient<$Result.GetResult<Prisma.$CenterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    processedBy<T extends Claim$processedByArgs<ExtArgs> = {}>(args?: Subset<T, Claim$processedByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Claim model
   */
  interface ClaimFieldRefs {
    readonly id: FieldRef<"Claim", 'String'>
    readonly title: FieldRef<"Claim", 'String'>
    readonly description: FieldRef<"Claim", 'String'>
    readonly amount: FieldRef<"Claim", 'Float'>
    readonly status: FieldRef<"Claim", 'ClaimStatus'>
    readonly submittedAt: FieldRef<"Claim", 'DateTime'>
    readonly updatedAt: FieldRef<"Claim", 'DateTime'>
    readonly processedAt: FieldRef<"Claim", 'DateTime'>
    readonly submittedById: FieldRef<"Claim", 'String'>
    readonly centerId: FieldRef<"Claim", 'String'>
    readonly processedById: FieldRef<"Claim", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Claim findUnique
   */
  export type ClaimFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Claim
     */
    omit?: ClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
    /**
     * Filter, which Claim to fetch.
     */
    where: ClaimWhereUniqueInput
  }

  /**
   * Claim findUniqueOrThrow
   */
  export type ClaimFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Claim
     */
    omit?: ClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
    /**
     * Filter, which Claim to fetch.
     */
    where: ClaimWhereUniqueInput
  }

  /**
   * Claim findFirst
   */
  export type ClaimFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Claim
     */
    omit?: ClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
    /**
     * Filter, which Claim to fetch.
     */
    where?: ClaimWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Claims to fetch.
     */
    orderBy?: ClaimOrderByWithRelationInput | ClaimOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Claims.
     */
    cursor?: ClaimWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Claims from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Claims.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Claims.
     */
    distinct?: ClaimScalarFieldEnum | ClaimScalarFieldEnum[]
  }

  /**
   * Claim findFirstOrThrow
   */
  export type ClaimFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Claim
     */
    omit?: ClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
    /**
     * Filter, which Claim to fetch.
     */
    where?: ClaimWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Claims to fetch.
     */
    orderBy?: ClaimOrderByWithRelationInput | ClaimOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Claims.
     */
    cursor?: ClaimWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Claims from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Claims.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Claims.
     */
    distinct?: ClaimScalarFieldEnum | ClaimScalarFieldEnum[]
  }

  /**
   * Claim findMany
   */
  export type ClaimFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Claim
     */
    omit?: ClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
    /**
     * Filter, which Claims to fetch.
     */
    where?: ClaimWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Claims to fetch.
     */
    orderBy?: ClaimOrderByWithRelationInput | ClaimOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Claims.
     */
    cursor?: ClaimWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Claims from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Claims.
     */
    skip?: number
    distinct?: ClaimScalarFieldEnum | ClaimScalarFieldEnum[]
  }

  /**
   * Claim create
   */
  export type ClaimCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Claim
     */
    omit?: ClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
    /**
     * The data needed to create a Claim.
     */
    data: XOR<ClaimCreateInput, ClaimUncheckedCreateInput>
  }

  /**
   * Claim createMany
   */
  export type ClaimCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Claims.
     */
    data: ClaimCreateManyInput | ClaimCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Claim update
   */
  export type ClaimUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Claim
     */
    omit?: ClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
    /**
     * The data needed to update a Claim.
     */
    data: XOR<ClaimUpdateInput, ClaimUncheckedUpdateInput>
    /**
     * Choose, which Claim to update.
     */
    where: ClaimWhereUniqueInput
  }

  /**
   * Claim updateMany
   */
  export type ClaimUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Claims.
     */
    data: XOR<ClaimUpdateManyMutationInput, ClaimUncheckedUpdateManyInput>
    /**
     * Filter which Claims to update
     */
    where?: ClaimWhereInput
    /**
     * Limit how many Claims to update.
     */
    limit?: number
  }

  /**
   * Claim upsert
   */
  export type ClaimUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Claim
     */
    omit?: ClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
    /**
     * The filter to search for the Claim to update in case it exists.
     */
    where: ClaimWhereUniqueInput
    /**
     * In case the Claim found by the `where` argument doesn't exist, create a new Claim with this data.
     */
    create: XOR<ClaimCreateInput, ClaimUncheckedCreateInput>
    /**
     * In case the Claim was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClaimUpdateInput, ClaimUncheckedUpdateInput>
  }

  /**
   * Claim delete
   */
  export type ClaimDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Claim
     */
    omit?: ClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
    /**
     * Filter which Claim to delete.
     */
    where: ClaimWhereUniqueInput
  }

  /**
   * Claim deleteMany
   */
  export type ClaimDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Claims to delete
     */
    where?: ClaimWhereInput
    /**
     * Limit how many Claims to delete.
     */
    limit?: number
  }

  /**
   * Claim.processedBy
   */
  export type Claim$processedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Claim without action
   */
  export type ClaimDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Claim
     */
    omit?: ClaimOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    password: 'password',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    lecturerCenterId: 'lecturerCenterId',
    departmentId: 'departmentId'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const CenterScalarFieldEnum: {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    coordinatorId: 'coordinatorId'
  };

  export type CenterScalarFieldEnum = (typeof CenterScalarFieldEnum)[keyof typeof CenterScalarFieldEnum]


  export const DepartmentScalarFieldEnum: {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    centerId: 'centerId'
  };

  export type DepartmentScalarFieldEnum = (typeof DepartmentScalarFieldEnum)[keyof typeof DepartmentScalarFieldEnum]


  export const ClaimScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    amount: 'amount',
    status: 'status',
    submittedAt: 'submittedAt',
    updatedAt: 'updatedAt',
    processedAt: 'processedAt',
    submittedById: 'submittedById',
    centerId: 'centerId',
    processedById: 'processedById'
  };

  export type ClaimScalarFieldEnum = (typeof ClaimScalarFieldEnum)[keyof typeof ClaimScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const UserOrderByRelevanceFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    password: 'password',
    lecturerCenterId: 'lecturerCenterId',
    departmentId: 'departmentId'
  };

  export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum]


  export const CenterOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    coordinatorId: 'coordinatorId'
  };

  export type CenterOrderByRelevanceFieldEnum = (typeof CenterOrderByRelevanceFieldEnum)[keyof typeof CenterOrderByRelevanceFieldEnum]


  export const DepartmentOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    centerId: 'centerId'
  };

  export type DepartmentOrderByRelevanceFieldEnum = (typeof DepartmentOrderByRelevanceFieldEnum)[keyof typeof DepartmentOrderByRelevanceFieldEnum]


  export const ClaimOrderByRelevanceFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    submittedById: 'submittedById',
    centerId: 'centerId',
    processedById: 'processedById'
  };

  export type ClaimOrderByRelevanceFieldEnum = (typeof ClaimOrderByRelevanceFieldEnum)[keyof typeof ClaimOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'ClaimStatus'
   */
  export type EnumClaimStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ClaimStatus'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    lecturerCenterId?: StringNullableFilter<"User"> | string | null
    departmentId?: StringNullableFilter<"User"> | string | null
    coordinatedCenter?: XOR<CenterNullableScalarRelationFilter, CenterWhereInput> | null
    lecturerCenter?: XOR<CenterNullableScalarRelationFilter, CenterWhereInput> | null
    department?: XOR<DepartmentNullableScalarRelationFilter, DepartmentWhereInput> | null
    submittedClaims?: ClaimListRelationFilter
    processedClaims?: ClaimListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lecturerCenterId?: SortOrderInput | SortOrder
    departmentId?: SortOrderInput | SortOrder
    coordinatedCenter?: CenterOrderByWithRelationInput
    lecturerCenter?: CenterOrderByWithRelationInput
    department?: DepartmentOrderByWithRelationInput
    submittedClaims?: ClaimOrderByRelationAggregateInput
    processedClaims?: ClaimOrderByRelationAggregateInput
    _relevance?: UserOrderByRelevanceInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    lecturerCenterId?: StringNullableFilter<"User"> | string | null
    departmentId?: StringNullableFilter<"User"> | string | null
    coordinatedCenter?: XOR<CenterNullableScalarRelationFilter, CenterWhereInput> | null
    lecturerCenter?: XOR<CenterNullableScalarRelationFilter, CenterWhereInput> | null
    department?: XOR<DepartmentNullableScalarRelationFilter, DepartmentWhereInput> | null
    submittedClaims?: ClaimListRelationFilter
    processedClaims?: ClaimListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lecturerCenterId?: SortOrderInput | SortOrder
    departmentId?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    lecturerCenterId?: StringNullableWithAggregatesFilter<"User"> | string | null
    departmentId?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type CenterWhereInput = {
    AND?: CenterWhereInput | CenterWhereInput[]
    OR?: CenterWhereInput[]
    NOT?: CenterWhereInput | CenterWhereInput[]
    id?: StringFilter<"Center"> | string
    name?: StringFilter<"Center"> | string
    createdAt?: DateTimeFilter<"Center"> | Date | string
    updatedAt?: DateTimeFilter<"Center"> | Date | string
    coordinatorId?: StringFilter<"Center"> | string
    coordinator?: XOR<UserScalarRelationFilter, UserWhereInput>
    lecturers?: UserListRelationFilter
    departments?: DepartmentListRelationFilter
    claims?: ClaimListRelationFilter
  }

  export type CenterOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    coordinatorId?: SortOrder
    coordinator?: UserOrderByWithRelationInput
    lecturers?: UserOrderByRelationAggregateInput
    departments?: DepartmentOrderByRelationAggregateInput
    claims?: ClaimOrderByRelationAggregateInput
    _relevance?: CenterOrderByRelevanceInput
  }

  export type CenterWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    coordinatorId?: string
    AND?: CenterWhereInput | CenterWhereInput[]
    OR?: CenterWhereInput[]
    NOT?: CenterWhereInput | CenterWhereInput[]
    createdAt?: DateTimeFilter<"Center"> | Date | string
    updatedAt?: DateTimeFilter<"Center"> | Date | string
    coordinator?: XOR<UserScalarRelationFilter, UserWhereInput>
    lecturers?: UserListRelationFilter
    departments?: DepartmentListRelationFilter
    claims?: ClaimListRelationFilter
  }, "id" | "name" | "coordinatorId">

  export type CenterOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    coordinatorId?: SortOrder
    _count?: CenterCountOrderByAggregateInput
    _max?: CenterMaxOrderByAggregateInput
    _min?: CenterMinOrderByAggregateInput
  }

  export type CenterScalarWhereWithAggregatesInput = {
    AND?: CenterScalarWhereWithAggregatesInput | CenterScalarWhereWithAggregatesInput[]
    OR?: CenterScalarWhereWithAggregatesInput[]
    NOT?: CenterScalarWhereWithAggregatesInput | CenterScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Center"> | string
    name?: StringWithAggregatesFilter<"Center"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Center"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Center"> | Date | string
    coordinatorId?: StringWithAggregatesFilter<"Center"> | string
  }

  export type DepartmentWhereInput = {
    AND?: DepartmentWhereInput | DepartmentWhereInput[]
    OR?: DepartmentWhereInput[]
    NOT?: DepartmentWhereInput | DepartmentWhereInput[]
    id?: StringFilter<"Department"> | string
    name?: StringFilter<"Department"> | string
    createdAt?: DateTimeFilter<"Department"> | Date | string
    updatedAt?: DateTimeFilter<"Department"> | Date | string
    centerId?: StringFilter<"Department"> | string
    center?: XOR<CenterScalarRelationFilter, CenterWhereInput>
    lecturers?: UserListRelationFilter
  }

  export type DepartmentOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    centerId?: SortOrder
    center?: CenterOrderByWithRelationInput
    lecturers?: UserOrderByRelationAggregateInput
    _relevance?: DepartmentOrderByRelevanceInput
  }

  export type DepartmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name_centerId?: DepartmentNameCenterIdCompoundUniqueInput
    AND?: DepartmentWhereInput | DepartmentWhereInput[]
    OR?: DepartmentWhereInput[]
    NOT?: DepartmentWhereInput | DepartmentWhereInput[]
    name?: StringFilter<"Department"> | string
    createdAt?: DateTimeFilter<"Department"> | Date | string
    updatedAt?: DateTimeFilter<"Department"> | Date | string
    centerId?: StringFilter<"Department"> | string
    center?: XOR<CenterScalarRelationFilter, CenterWhereInput>
    lecturers?: UserListRelationFilter
  }, "id" | "name_centerId">

  export type DepartmentOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    centerId?: SortOrder
    _count?: DepartmentCountOrderByAggregateInput
    _max?: DepartmentMaxOrderByAggregateInput
    _min?: DepartmentMinOrderByAggregateInput
  }

  export type DepartmentScalarWhereWithAggregatesInput = {
    AND?: DepartmentScalarWhereWithAggregatesInput | DepartmentScalarWhereWithAggregatesInput[]
    OR?: DepartmentScalarWhereWithAggregatesInput[]
    NOT?: DepartmentScalarWhereWithAggregatesInput | DepartmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Department"> | string
    name?: StringWithAggregatesFilter<"Department"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Department"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Department"> | Date | string
    centerId?: StringWithAggregatesFilter<"Department"> | string
  }

  export type ClaimWhereInput = {
    AND?: ClaimWhereInput | ClaimWhereInput[]
    OR?: ClaimWhereInput[]
    NOT?: ClaimWhereInput | ClaimWhereInput[]
    id?: StringFilter<"Claim"> | string
    title?: StringFilter<"Claim"> | string
    description?: StringNullableFilter<"Claim"> | string | null
    amount?: FloatFilter<"Claim"> | number
    status?: EnumClaimStatusFilter<"Claim"> | $Enums.ClaimStatus
    submittedAt?: DateTimeFilter<"Claim"> | Date | string
    updatedAt?: DateTimeFilter<"Claim"> | Date | string
    processedAt?: DateTimeNullableFilter<"Claim"> | Date | string | null
    submittedById?: StringFilter<"Claim"> | string
    centerId?: StringFilter<"Claim"> | string
    processedById?: StringNullableFilter<"Claim"> | string | null
    submittedBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    center?: XOR<CenterScalarRelationFilter, CenterWhereInput>
    processedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type ClaimOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    amount?: SortOrder
    status?: SortOrder
    submittedAt?: SortOrder
    updatedAt?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    submittedById?: SortOrder
    centerId?: SortOrder
    processedById?: SortOrderInput | SortOrder
    submittedBy?: UserOrderByWithRelationInput
    center?: CenterOrderByWithRelationInput
    processedBy?: UserOrderByWithRelationInput
    _relevance?: ClaimOrderByRelevanceInput
  }

  export type ClaimWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ClaimWhereInput | ClaimWhereInput[]
    OR?: ClaimWhereInput[]
    NOT?: ClaimWhereInput | ClaimWhereInput[]
    title?: StringFilter<"Claim"> | string
    description?: StringNullableFilter<"Claim"> | string | null
    amount?: FloatFilter<"Claim"> | number
    status?: EnumClaimStatusFilter<"Claim"> | $Enums.ClaimStatus
    submittedAt?: DateTimeFilter<"Claim"> | Date | string
    updatedAt?: DateTimeFilter<"Claim"> | Date | string
    processedAt?: DateTimeNullableFilter<"Claim"> | Date | string | null
    submittedById?: StringFilter<"Claim"> | string
    centerId?: StringFilter<"Claim"> | string
    processedById?: StringNullableFilter<"Claim"> | string | null
    submittedBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    center?: XOR<CenterScalarRelationFilter, CenterWhereInput>
    processedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type ClaimOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    amount?: SortOrder
    status?: SortOrder
    submittedAt?: SortOrder
    updatedAt?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    submittedById?: SortOrder
    centerId?: SortOrder
    processedById?: SortOrderInput | SortOrder
    _count?: ClaimCountOrderByAggregateInput
    _avg?: ClaimAvgOrderByAggregateInput
    _max?: ClaimMaxOrderByAggregateInput
    _min?: ClaimMinOrderByAggregateInput
    _sum?: ClaimSumOrderByAggregateInput
  }

  export type ClaimScalarWhereWithAggregatesInput = {
    AND?: ClaimScalarWhereWithAggregatesInput | ClaimScalarWhereWithAggregatesInput[]
    OR?: ClaimScalarWhereWithAggregatesInput[]
    NOT?: ClaimScalarWhereWithAggregatesInput | ClaimScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Claim"> | string
    title?: StringWithAggregatesFilter<"Claim"> | string
    description?: StringNullableWithAggregatesFilter<"Claim"> | string | null
    amount?: FloatWithAggregatesFilter<"Claim"> | number
    status?: EnumClaimStatusWithAggregatesFilter<"Claim"> | $Enums.ClaimStatus
    submittedAt?: DateTimeWithAggregatesFilter<"Claim"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Claim"> | Date | string
    processedAt?: DateTimeNullableWithAggregatesFilter<"Claim"> | Date | string | null
    submittedById?: StringWithAggregatesFilter<"Claim"> | string
    centerId?: StringWithAggregatesFilter<"Claim"> | string
    processedById?: StringNullableWithAggregatesFilter<"Claim"> | string | null
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    coordinatedCenter?: CenterCreateNestedOneWithoutCoordinatorInput
    lecturerCenter?: CenterCreateNestedOneWithoutLecturersInput
    department?: DepartmentCreateNestedOneWithoutLecturersInput
    submittedClaims?: ClaimCreateNestedManyWithoutSubmittedByInput
    processedClaims?: ClaimCreateNestedManyWithoutProcessedByInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    lecturerCenterId?: string | null
    departmentId?: string | null
    coordinatedCenter?: CenterUncheckedCreateNestedOneWithoutCoordinatorInput
    submittedClaims?: ClaimUncheckedCreateNestedManyWithoutSubmittedByInput
    processedClaims?: ClaimUncheckedCreateNestedManyWithoutProcessedByInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coordinatedCenter?: CenterUpdateOneWithoutCoordinatorNestedInput
    lecturerCenter?: CenterUpdateOneWithoutLecturersNestedInput
    department?: DepartmentUpdateOneWithoutLecturersNestedInput
    submittedClaims?: ClaimUpdateManyWithoutSubmittedByNestedInput
    processedClaims?: ClaimUpdateManyWithoutProcessedByNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lecturerCenterId?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: NullableStringFieldUpdateOperationsInput | string | null
    coordinatedCenter?: CenterUncheckedUpdateOneWithoutCoordinatorNestedInput
    submittedClaims?: ClaimUncheckedUpdateManyWithoutSubmittedByNestedInput
    processedClaims?: ClaimUncheckedUpdateManyWithoutProcessedByNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    lecturerCenterId?: string | null
    departmentId?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lecturerCenterId?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CenterCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    coordinator: UserCreateNestedOneWithoutCoordinatedCenterInput
    lecturers?: UserCreateNestedManyWithoutLecturerCenterInput
    departments?: DepartmentCreateNestedManyWithoutCenterInput
    claims?: ClaimCreateNestedManyWithoutCenterInput
  }

  export type CenterUncheckedCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    coordinatorId: string
    lecturers?: UserUncheckedCreateNestedManyWithoutLecturerCenterInput
    departments?: DepartmentUncheckedCreateNestedManyWithoutCenterInput
    claims?: ClaimUncheckedCreateNestedManyWithoutCenterInput
  }

  export type CenterUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coordinator?: UserUpdateOneRequiredWithoutCoordinatedCenterNestedInput
    lecturers?: UserUpdateManyWithoutLecturerCenterNestedInput
    departments?: DepartmentUpdateManyWithoutCenterNestedInput
    claims?: ClaimUpdateManyWithoutCenterNestedInput
  }

  export type CenterUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coordinatorId?: StringFieldUpdateOperationsInput | string
    lecturers?: UserUncheckedUpdateManyWithoutLecturerCenterNestedInput
    departments?: DepartmentUncheckedUpdateManyWithoutCenterNestedInput
    claims?: ClaimUncheckedUpdateManyWithoutCenterNestedInput
  }

  export type CenterCreateManyInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    coordinatorId: string
  }

  export type CenterUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CenterUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coordinatorId?: StringFieldUpdateOperationsInput | string
  }

  export type DepartmentCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    center: CenterCreateNestedOneWithoutDepartmentsInput
    lecturers?: UserCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentUncheckedCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    centerId: string
    lecturers?: UserUncheckedCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    center?: CenterUpdateOneRequiredWithoutDepartmentsNestedInput
    lecturers?: UserUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    centerId?: StringFieldUpdateOperationsInput | string
    lecturers?: UserUncheckedUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentCreateManyInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    centerId: string
  }

  export type DepartmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    centerId?: StringFieldUpdateOperationsInput | string
  }

  export type ClaimCreateInput = {
    id?: string
    title: string
    description?: string | null
    amount: number
    status?: $Enums.ClaimStatus
    submittedAt?: Date | string
    updatedAt?: Date | string
    processedAt?: Date | string | null
    submittedBy: UserCreateNestedOneWithoutSubmittedClaimsInput
    center: CenterCreateNestedOneWithoutClaimsInput
    processedBy?: UserCreateNestedOneWithoutProcessedClaimsInput
  }

  export type ClaimUncheckedCreateInput = {
    id?: string
    title: string
    description?: string | null
    amount: number
    status?: $Enums.ClaimStatus
    submittedAt?: Date | string
    updatedAt?: Date | string
    processedAt?: Date | string | null
    submittedById: string
    centerId: string
    processedById?: string | null
  }

  export type ClaimUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedBy?: UserUpdateOneRequiredWithoutSubmittedClaimsNestedInput
    center?: CenterUpdateOneRequiredWithoutClaimsNestedInput
    processedBy?: UserUpdateOneWithoutProcessedClaimsNestedInput
  }

  export type ClaimUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedById?: StringFieldUpdateOperationsInput | string
    centerId?: StringFieldUpdateOperationsInput | string
    processedById?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ClaimCreateManyInput = {
    id?: string
    title: string
    description?: string | null
    amount: number
    status?: $Enums.ClaimStatus
    submittedAt?: Date | string
    updatedAt?: Date | string
    processedAt?: Date | string | null
    submittedById: string
    centerId: string
    processedById?: string | null
  }

  export type ClaimUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ClaimUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedById?: StringFieldUpdateOperationsInput | string
    centerId?: StringFieldUpdateOperationsInput | string
    processedById?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type CenterNullableScalarRelationFilter = {
    is?: CenterWhereInput | null
    isNot?: CenterWhereInput | null
  }

  export type DepartmentNullableScalarRelationFilter = {
    is?: DepartmentWhereInput | null
    isNot?: DepartmentWhereInput | null
  }

  export type ClaimListRelationFilter = {
    every?: ClaimWhereInput
    some?: ClaimWhereInput
    none?: ClaimWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ClaimOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserOrderByRelevanceInput = {
    fields: UserOrderByRelevanceFieldEnum | UserOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lecturerCenterId?: SortOrder
    departmentId?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lecturerCenterId?: SortOrder
    departmentId?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lecturerCenterId?: SortOrder
    departmentId?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type DepartmentListRelationFilter = {
    every?: DepartmentWhereInput
    some?: DepartmentWhereInput
    none?: DepartmentWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DepartmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CenterOrderByRelevanceInput = {
    fields: CenterOrderByRelevanceFieldEnum | CenterOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CenterCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    coordinatorId?: SortOrder
  }

  export type CenterMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    coordinatorId?: SortOrder
  }

  export type CenterMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    coordinatorId?: SortOrder
  }

  export type CenterScalarRelationFilter = {
    is?: CenterWhereInput
    isNot?: CenterWhereInput
  }

  export type DepartmentOrderByRelevanceInput = {
    fields: DepartmentOrderByRelevanceFieldEnum | DepartmentOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type DepartmentNameCenterIdCompoundUniqueInput = {
    name: string
    centerId: string
  }

  export type DepartmentCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    centerId?: SortOrder
  }

  export type DepartmentMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    centerId?: SortOrder
  }

  export type DepartmentMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    centerId?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type EnumClaimStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ClaimStatus | EnumClaimStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ClaimStatus[]
    notIn?: $Enums.ClaimStatus[]
    not?: NestedEnumClaimStatusFilter<$PrismaModel> | $Enums.ClaimStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type ClaimOrderByRelevanceInput = {
    fields: ClaimOrderByRelevanceFieldEnum | ClaimOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ClaimCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    submittedAt?: SortOrder
    updatedAt?: SortOrder
    processedAt?: SortOrder
    submittedById?: SortOrder
    centerId?: SortOrder
    processedById?: SortOrder
  }

  export type ClaimAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type ClaimMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    submittedAt?: SortOrder
    updatedAt?: SortOrder
    processedAt?: SortOrder
    submittedById?: SortOrder
    centerId?: SortOrder
    processedById?: SortOrder
  }

  export type ClaimMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    submittedAt?: SortOrder
    updatedAt?: SortOrder
    processedAt?: SortOrder
    submittedById?: SortOrder
    centerId?: SortOrder
    processedById?: SortOrder
  }

  export type ClaimSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type EnumClaimStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ClaimStatus | EnumClaimStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ClaimStatus[]
    notIn?: $Enums.ClaimStatus[]
    not?: NestedEnumClaimStatusWithAggregatesFilter<$PrismaModel> | $Enums.ClaimStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumClaimStatusFilter<$PrismaModel>
    _max?: NestedEnumClaimStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type CenterCreateNestedOneWithoutCoordinatorInput = {
    create?: XOR<CenterCreateWithoutCoordinatorInput, CenterUncheckedCreateWithoutCoordinatorInput>
    connectOrCreate?: CenterCreateOrConnectWithoutCoordinatorInput
    connect?: CenterWhereUniqueInput
  }

  export type CenterCreateNestedOneWithoutLecturersInput = {
    create?: XOR<CenterCreateWithoutLecturersInput, CenterUncheckedCreateWithoutLecturersInput>
    connectOrCreate?: CenterCreateOrConnectWithoutLecturersInput
    connect?: CenterWhereUniqueInput
  }

  export type DepartmentCreateNestedOneWithoutLecturersInput = {
    create?: XOR<DepartmentCreateWithoutLecturersInput, DepartmentUncheckedCreateWithoutLecturersInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutLecturersInput
    connect?: DepartmentWhereUniqueInput
  }

  export type ClaimCreateNestedManyWithoutSubmittedByInput = {
    create?: XOR<ClaimCreateWithoutSubmittedByInput, ClaimUncheckedCreateWithoutSubmittedByInput> | ClaimCreateWithoutSubmittedByInput[] | ClaimUncheckedCreateWithoutSubmittedByInput[]
    connectOrCreate?: ClaimCreateOrConnectWithoutSubmittedByInput | ClaimCreateOrConnectWithoutSubmittedByInput[]
    createMany?: ClaimCreateManySubmittedByInputEnvelope
    connect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
  }

  export type ClaimCreateNestedManyWithoutProcessedByInput = {
    create?: XOR<ClaimCreateWithoutProcessedByInput, ClaimUncheckedCreateWithoutProcessedByInput> | ClaimCreateWithoutProcessedByInput[] | ClaimUncheckedCreateWithoutProcessedByInput[]
    connectOrCreate?: ClaimCreateOrConnectWithoutProcessedByInput | ClaimCreateOrConnectWithoutProcessedByInput[]
    createMany?: ClaimCreateManyProcessedByInputEnvelope
    connect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
  }

  export type CenterUncheckedCreateNestedOneWithoutCoordinatorInput = {
    create?: XOR<CenterCreateWithoutCoordinatorInput, CenterUncheckedCreateWithoutCoordinatorInput>
    connectOrCreate?: CenterCreateOrConnectWithoutCoordinatorInput
    connect?: CenterWhereUniqueInput
  }

  export type ClaimUncheckedCreateNestedManyWithoutSubmittedByInput = {
    create?: XOR<ClaimCreateWithoutSubmittedByInput, ClaimUncheckedCreateWithoutSubmittedByInput> | ClaimCreateWithoutSubmittedByInput[] | ClaimUncheckedCreateWithoutSubmittedByInput[]
    connectOrCreate?: ClaimCreateOrConnectWithoutSubmittedByInput | ClaimCreateOrConnectWithoutSubmittedByInput[]
    createMany?: ClaimCreateManySubmittedByInputEnvelope
    connect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
  }

  export type ClaimUncheckedCreateNestedManyWithoutProcessedByInput = {
    create?: XOR<ClaimCreateWithoutProcessedByInput, ClaimUncheckedCreateWithoutProcessedByInput> | ClaimCreateWithoutProcessedByInput[] | ClaimUncheckedCreateWithoutProcessedByInput[]
    connectOrCreate?: ClaimCreateOrConnectWithoutProcessedByInput | ClaimCreateOrConnectWithoutProcessedByInput[]
    createMany?: ClaimCreateManyProcessedByInputEnvelope
    connect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type CenterUpdateOneWithoutCoordinatorNestedInput = {
    create?: XOR<CenterCreateWithoutCoordinatorInput, CenterUncheckedCreateWithoutCoordinatorInput>
    connectOrCreate?: CenterCreateOrConnectWithoutCoordinatorInput
    upsert?: CenterUpsertWithoutCoordinatorInput
    disconnect?: CenterWhereInput | boolean
    delete?: CenterWhereInput | boolean
    connect?: CenterWhereUniqueInput
    update?: XOR<XOR<CenterUpdateToOneWithWhereWithoutCoordinatorInput, CenterUpdateWithoutCoordinatorInput>, CenterUncheckedUpdateWithoutCoordinatorInput>
  }

  export type CenterUpdateOneWithoutLecturersNestedInput = {
    create?: XOR<CenterCreateWithoutLecturersInput, CenterUncheckedCreateWithoutLecturersInput>
    connectOrCreate?: CenterCreateOrConnectWithoutLecturersInput
    upsert?: CenterUpsertWithoutLecturersInput
    disconnect?: CenterWhereInput | boolean
    delete?: CenterWhereInput | boolean
    connect?: CenterWhereUniqueInput
    update?: XOR<XOR<CenterUpdateToOneWithWhereWithoutLecturersInput, CenterUpdateWithoutLecturersInput>, CenterUncheckedUpdateWithoutLecturersInput>
  }

  export type DepartmentUpdateOneWithoutLecturersNestedInput = {
    create?: XOR<DepartmentCreateWithoutLecturersInput, DepartmentUncheckedCreateWithoutLecturersInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutLecturersInput
    upsert?: DepartmentUpsertWithoutLecturersInput
    disconnect?: DepartmentWhereInput | boolean
    delete?: DepartmentWhereInput | boolean
    connect?: DepartmentWhereUniqueInput
    update?: XOR<XOR<DepartmentUpdateToOneWithWhereWithoutLecturersInput, DepartmentUpdateWithoutLecturersInput>, DepartmentUncheckedUpdateWithoutLecturersInput>
  }

  export type ClaimUpdateManyWithoutSubmittedByNestedInput = {
    create?: XOR<ClaimCreateWithoutSubmittedByInput, ClaimUncheckedCreateWithoutSubmittedByInput> | ClaimCreateWithoutSubmittedByInput[] | ClaimUncheckedCreateWithoutSubmittedByInput[]
    connectOrCreate?: ClaimCreateOrConnectWithoutSubmittedByInput | ClaimCreateOrConnectWithoutSubmittedByInput[]
    upsert?: ClaimUpsertWithWhereUniqueWithoutSubmittedByInput | ClaimUpsertWithWhereUniqueWithoutSubmittedByInput[]
    createMany?: ClaimCreateManySubmittedByInputEnvelope
    set?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    disconnect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    delete?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    connect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    update?: ClaimUpdateWithWhereUniqueWithoutSubmittedByInput | ClaimUpdateWithWhereUniqueWithoutSubmittedByInput[]
    updateMany?: ClaimUpdateManyWithWhereWithoutSubmittedByInput | ClaimUpdateManyWithWhereWithoutSubmittedByInput[]
    deleteMany?: ClaimScalarWhereInput | ClaimScalarWhereInput[]
  }

  export type ClaimUpdateManyWithoutProcessedByNestedInput = {
    create?: XOR<ClaimCreateWithoutProcessedByInput, ClaimUncheckedCreateWithoutProcessedByInput> | ClaimCreateWithoutProcessedByInput[] | ClaimUncheckedCreateWithoutProcessedByInput[]
    connectOrCreate?: ClaimCreateOrConnectWithoutProcessedByInput | ClaimCreateOrConnectWithoutProcessedByInput[]
    upsert?: ClaimUpsertWithWhereUniqueWithoutProcessedByInput | ClaimUpsertWithWhereUniqueWithoutProcessedByInput[]
    createMany?: ClaimCreateManyProcessedByInputEnvelope
    set?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    disconnect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    delete?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    connect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    update?: ClaimUpdateWithWhereUniqueWithoutProcessedByInput | ClaimUpdateWithWhereUniqueWithoutProcessedByInput[]
    updateMany?: ClaimUpdateManyWithWhereWithoutProcessedByInput | ClaimUpdateManyWithWhereWithoutProcessedByInput[]
    deleteMany?: ClaimScalarWhereInput | ClaimScalarWhereInput[]
  }

  export type CenterUncheckedUpdateOneWithoutCoordinatorNestedInput = {
    create?: XOR<CenterCreateWithoutCoordinatorInput, CenterUncheckedCreateWithoutCoordinatorInput>
    connectOrCreate?: CenterCreateOrConnectWithoutCoordinatorInput
    upsert?: CenterUpsertWithoutCoordinatorInput
    disconnect?: CenterWhereInput | boolean
    delete?: CenterWhereInput | boolean
    connect?: CenterWhereUniqueInput
    update?: XOR<XOR<CenterUpdateToOneWithWhereWithoutCoordinatorInput, CenterUpdateWithoutCoordinatorInput>, CenterUncheckedUpdateWithoutCoordinatorInput>
  }

  export type ClaimUncheckedUpdateManyWithoutSubmittedByNestedInput = {
    create?: XOR<ClaimCreateWithoutSubmittedByInput, ClaimUncheckedCreateWithoutSubmittedByInput> | ClaimCreateWithoutSubmittedByInput[] | ClaimUncheckedCreateWithoutSubmittedByInput[]
    connectOrCreate?: ClaimCreateOrConnectWithoutSubmittedByInput | ClaimCreateOrConnectWithoutSubmittedByInput[]
    upsert?: ClaimUpsertWithWhereUniqueWithoutSubmittedByInput | ClaimUpsertWithWhereUniqueWithoutSubmittedByInput[]
    createMany?: ClaimCreateManySubmittedByInputEnvelope
    set?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    disconnect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    delete?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    connect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    update?: ClaimUpdateWithWhereUniqueWithoutSubmittedByInput | ClaimUpdateWithWhereUniqueWithoutSubmittedByInput[]
    updateMany?: ClaimUpdateManyWithWhereWithoutSubmittedByInput | ClaimUpdateManyWithWhereWithoutSubmittedByInput[]
    deleteMany?: ClaimScalarWhereInput | ClaimScalarWhereInput[]
  }

  export type ClaimUncheckedUpdateManyWithoutProcessedByNestedInput = {
    create?: XOR<ClaimCreateWithoutProcessedByInput, ClaimUncheckedCreateWithoutProcessedByInput> | ClaimCreateWithoutProcessedByInput[] | ClaimUncheckedCreateWithoutProcessedByInput[]
    connectOrCreate?: ClaimCreateOrConnectWithoutProcessedByInput | ClaimCreateOrConnectWithoutProcessedByInput[]
    upsert?: ClaimUpsertWithWhereUniqueWithoutProcessedByInput | ClaimUpsertWithWhereUniqueWithoutProcessedByInput[]
    createMany?: ClaimCreateManyProcessedByInputEnvelope
    set?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    disconnect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    delete?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    connect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    update?: ClaimUpdateWithWhereUniqueWithoutProcessedByInput | ClaimUpdateWithWhereUniqueWithoutProcessedByInput[]
    updateMany?: ClaimUpdateManyWithWhereWithoutProcessedByInput | ClaimUpdateManyWithWhereWithoutProcessedByInput[]
    deleteMany?: ClaimScalarWhereInput | ClaimScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutCoordinatedCenterInput = {
    create?: XOR<UserCreateWithoutCoordinatedCenterInput, UserUncheckedCreateWithoutCoordinatedCenterInput>
    connectOrCreate?: UserCreateOrConnectWithoutCoordinatedCenterInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedManyWithoutLecturerCenterInput = {
    create?: XOR<UserCreateWithoutLecturerCenterInput, UserUncheckedCreateWithoutLecturerCenterInput> | UserCreateWithoutLecturerCenterInput[] | UserUncheckedCreateWithoutLecturerCenterInput[]
    connectOrCreate?: UserCreateOrConnectWithoutLecturerCenterInput | UserCreateOrConnectWithoutLecturerCenterInput[]
    createMany?: UserCreateManyLecturerCenterInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type DepartmentCreateNestedManyWithoutCenterInput = {
    create?: XOR<DepartmentCreateWithoutCenterInput, DepartmentUncheckedCreateWithoutCenterInput> | DepartmentCreateWithoutCenterInput[] | DepartmentUncheckedCreateWithoutCenterInput[]
    connectOrCreate?: DepartmentCreateOrConnectWithoutCenterInput | DepartmentCreateOrConnectWithoutCenterInput[]
    createMany?: DepartmentCreateManyCenterInputEnvelope
    connect?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
  }

  export type ClaimCreateNestedManyWithoutCenterInput = {
    create?: XOR<ClaimCreateWithoutCenterInput, ClaimUncheckedCreateWithoutCenterInput> | ClaimCreateWithoutCenterInput[] | ClaimUncheckedCreateWithoutCenterInput[]
    connectOrCreate?: ClaimCreateOrConnectWithoutCenterInput | ClaimCreateOrConnectWithoutCenterInput[]
    createMany?: ClaimCreateManyCenterInputEnvelope
    connect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutLecturerCenterInput = {
    create?: XOR<UserCreateWithoutLecturerCenterInput, UserUncheckedCreateWithoutLecturerCenterInput> | UserCreateWithoutLecturerCenterInput[] | UserUncheckedCreateWithoutLecturerCenterInput[]
    connectOrCreate?: UserCreateOrConnectWithoutLecturerCenterInput | UserCreateOrConnectWithoutLecturerCenterInput[]
    createMany?: UserCreateManyLecturerCenterInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type DepartmentUncheckedCreateNestedManyWithoutCenterInput = {
    create?: XOR<DepartmentCreateWithoutCenterInput, DepartmentUncheckedCreateWithoutCenterInput> | DepartmentCreateWithoutCenterInput[] | DepartmentUncheckedCreateWithoutCenterInput[]
    connectOrCreate?: DepartmentCreateOrConnectWithoutCenterInput | DepartmentCreateOrConnectWithoutCenterInput[]
    createMany?: DepartmentCreateManyCenterInputEnvelope
    connect?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
  }

  export type ClaimUncheckedCreateNestedManyWithoutCenterInput = {
    create?: XOR<ClaimCreateWithoutCenterInput, ClaimUncheckedCreateWithoutCenterInput> | ClaimCreateWithoutCenterInput[] | ClaimUncheckedCreateWithoutCenterInput[]
    connectOrCreate?: ClaimCreateOrConnectWithoutCenterInput | ClaimCreateOrConnectWithoutCenterInput[]
    createMany?: ClaimCreateManyCenterInputEnvelope
    connect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutCoordinatedCenterNestedInput = {
    create?: XOR<UserCreateWithoutCoordinatedCenterInput, UserUncheckedCreateWithoutCoordinatedCenterInput>
    connectOrCreate?: UserCreateOrConnectWithoutCoordinatedCenterInput
    upsert?: UserUpsertWithoutCoordinatedCenterInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCoordinatedCenterInput, UserUpdateWithoutCoordinatedCenterInput>, UserUncheckedUpdateWithoutCoordinatedCenterInput>
  }

  export type UserUpdateManyWithoutLecturerCenterNestedInput = {
    create?: XOR<UserCreateWithoutLecturerCenterInput, UserUncheckedCreateWithoutLecturerCenterInput> | UserCreateWithoutLecturerCenterInput[] | UserUncheckedCreateWithoutLecturerCenterInput[]
    connectOrCreate?: UserCreateOrConnectWithoutLecturerCenterInput | UserCreateOrConnectWithoutLecturerCenterInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutLecturerCenterInput | UserUpsertWithWhereUniqueWithoutLecturerCenterInput[]
    createMany?: UserCreateManyLecturerCenterInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutLecturerCenterInput | UserUpdateWithWhereUniqueWithoutLecturerCenterInput[]
    updateMany?: UserUpdateManyWithWhereWithoutLecturerCenterInput | UserUpdateManyWithWhereWithoutLecturerCenterInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type DepartmentUpdateManyWithoutCenterNestedInput = {
    create?: XOR<DepartmentCreateWithoutCenterInput, DepartmentUncheckedCreateWithoutCenterInput> | DepartmentCreateWithoutCenterInput[] | DepartmentUncheckedCreateWithoutCenterInput[]
    connectOrCreate?: DepartmentCreateOrConnectWithoutCenterInput | DepartmentCreateOrConnectWithoutCenterInput[]
    upsert?: DepartmentUpsertWithWhereUniqueWithoutCenterInput | DepartmentUpsertWithWhereUniqueWithoutCenterInput[]
    createMany?: DepartmentCreateManyCenterInputEnvelope
    set?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    disconnect?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    delete?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    connect?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    update?: DepartmentUpdateWithWhereUniqueWithoutCenterInput | DepartmentUpdateWithWhereUniqueWithoutCenterInput[]
    updateMany?: DepartmentUpdateManyWithWhereWithoutCenterInput | DepartmentUpdateManyWithWhereWithoutCenterInput[]
    deleteMany?: DepartmentScalarWhereInput | DepartmentScalarWhereInput[]
  }

  export type ClaimUpdateManyWithoutCenterNestedInput = {
    create?: XOR<ClaimCreateWithoutCenterInput, ClaimUncheckedCreateWithoutCenterInput> | ClaimCreateWithoutCenterInput[] | ClaimUncheckedCreateWithoutCenterInput[]
    connectOrCreate?: ClaimCreateOrConnectWithoutCenterInput | ClaimCreateOrConnectWithoutCenterInput[]
    upsert?: ClaimUpsertWithWhereUniqueWithoutCenterInput | ClaimUpsertWithWhereUniqueWithoutCenterInput[]
    createMany?: ClaimCreateManyCenterInputEnvelope
    set?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    disconnect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    delete?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    connect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    update?: ClaimUpdateWithWhereUniqueWithoutCenterInput | ClaimUpdateWithWhereUniqueWithoutCenterInput[]
    updateMany?: ClaimUpdateManyWithWhereWithoutCenterInput | ClaimUpdateManyWithWhereWithoutCenterInput[]
    deleteMany?: ClaimScalarWhereInput | ClaimScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutLecturerCenterNestedInput = {
    create?: XOR<UserCreateWithoutLecturerCenterInput, UserUncheckedCreateWithoutLecturerCenterInput> | UserCreateWithoutLecturerCenterInput[] | UserUncheckedCreateWithoutLecturerCenterInput[]
    connectOrCreate?: UserCreateOrConnectWithoutLecturerCenterInput | UserCreateOrConnectWithoutLecturerCenterInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutLecturerCenterInput | UserUpsertWithWhereUniqueWithoutLecturerCenterInput[]
    createMany?: UserCreateManyLecturerCenterInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutLecturerCenterInput | UserUpdateWithWhereUniqueWithoutLecturerCenterInput[]
    updateMany?: UserUpdateManyWithWhereWithoutLecturerCenterInput | UserUpdateManyWithWhereWithoutLecturerCenterInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type DepartmentUncheckedUpdateManyWithoutCenterNestedInput = {
    create?: XOR<DepartmentCreateWithoutCenterInput, DepartmentUncheckedCreateWithoutCenterInput> | DepartmentCreateWithoutCenterInput[] | DepartmentUncheckedCreateWithoutCenterInput[]
    connectOrCreate?: DepartmentCreateOrConnectWithoutCenterInput | DepartmentCreateOrConnectWithoutCenterInput[]
    upsert?: DepartmentUpsertWithWhereUniqueWithoutCenterInput | DepartmentUpsertWithWhereUniqueWithoutCenterInput[]
    createMany?: DepartmentCreateManyCenterInputEnvelope
    set?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    disconnect?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    delete?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    connect?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    update?: DepartmentUpdateWithWhereUniqueWithoutCenterInput | DepartmentUpdateWithWhereUniqueWithoutCenterInput[]
    updateMany?: DepartmentUpdateManyWithWhereWithoutCenterInput | DepartmentUpdateManyWithWhereWithoutCenterInput[]
    deleteMany?: DepartmentScalarWhereInput | DepartmentScalarWhereInput[]
  }

  export type ClaimUncheckedUpdateManyWithoutCenterNestedInput = {
    create?: XOR<ClaimCreateWithoutCenterInput, ClaimUncheckedCreateWithoutCenterInput> | ClaimCreateWithoutCenterInput[] | ClaimUncheckedCreateWithoutCenterInput[]
    connectOrCreate?: ClaimCreateOrConnectWithoutCenterInput | ClaimCreateOrConnectWithoutCenterInput[]
    upsert?: ClaimUpsertWithWhereUniqueWithoutCenterInput | ClaimUpsertWithWhereUniqueWithoutCenterInput[]
    createMany?: ClaimCreateManyCenterInputEnvelope
    set?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    disconnect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    delete?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    connect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    update?: ClaimUpdateWithWhereUniqueWithoutCenterInput | ClaimUpdateWithWhereUniqueWithoutCenterInput[]
    updateMany?: ClaimUpdateManyWithWhereWithoutCenterInput | ClaimUpdateManyWithWhereWithoutCenterInput[]
    deleteMany?: ClaimScalarWhereInput | ClaimScalarWhereInput[]
  }

  export type CenterCreateNestedOneWithoutDepartmentsInput = {
    create?: XOR<CenterCreateWithoutDepartmentsInput, CenterUncheckedCreateWithoutDepartmentsInput>
    connectOrCreate?: CenterCreateOrConnectWithoutDepartmentsInput
    connect?: CenterWhereUniqueInput
  }

  export type UserCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<UserCreateWithoutDepartmentInput, UserUncheckedCreateWithoutDepartmentInput> | UserCreateWithoutDepartmentInput[] | UserUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDepartmentInput | UserCreateOrConnectWithoutDepartmentInput[]
    createMany?: UserCreateManyDepartmentInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<UserCreateWithoutDepartmentInput, UserUncheckedCreateWithoutDepartmentInput> | UserCreateWithoutDepartmentInput[] | UserUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDepartmentInput | UserCreateOrConnectWithoutDepartmentInput[]
    createMany?: UserCreateManyDepartmentInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type CenterUpdateOneRequiredWithoutDepartmentsNestedInput = {
    create?: XOR<CenterCreateWithoutDepartmentsInput, CenterUncheckedCreateWithoutDepartmentsInput>
    connectOrCreate?: CenterCreateOrConnectWithoutDepartmentsInput
    upsert?: CenterUpsertWithoutDepartmentsInput
    connect?: CenterWhereUniqueInput
    update?: XOR<XOR<CenterUpdateToOneWithWhereWithoutDepartmentsInput, CenterUpdateWithoutDepartmentsInput>, CenterUncheckedUpdateWithoutDepartmentsInput>
  }

  export type UserUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<UserCreateWithoutDepartmentInput, UserUncheckedCreateWithoutDepartmentInput> | UserCreateWithoutDepartmentInput[] | UserUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDepartmentInput | UserCreateOrConnectWithoutDepartmentInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutDepartmentInput | UserUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: UserCreateManyDepartmentInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutDepartmentInput | UserUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: UserUpdateManyWithWhereWithoutDepartmentInput | UserUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<UserCreateWithoutDepartmentInput, UserUncheckedCreateWithoutDepartmentInput> | UserCreateWithoutDepartmentInput[] | UserUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDepartmentInput | UserCreateOrConnectWithoutDepartmentInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutDepartmentInput | UserUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: UserCreateManyDepartmentInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutDepartmentInput | UserUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: UserUpdateManyWithWhereWithoutDepartmentInput | UserUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSubmittedClaimsInput = {
    create?: XOR<UserCreateWithoutSubmittedClaimsInput, UserUncheckedCreateWithoutSubmittedClaimsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubmittedClaimsInput
    connect?: UserWhereUniqueInput
  }

  export type CenterCreateNestedOneWithoutClaimsInput = {
    create?: XOR<CenterCreateWithoutClaimsInput, CenterUncheckedCreateWithoutClaimsInput>
    connectOrCreate?: CenterCreateOrConnectWithoutClaimsInput
    connect?: CenterWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutProcessedClaimsInput = {
    create?: XOR<UserCreateWithoutProcessedClaimsInput, UserUncheckedCreateWithoutProcessedClaimsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProcessedClaimsInput
    connect?: UserWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumClaimStatusFieldUpdateOperationsInput = {
    set?: $Enums.ClaimStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutSubmittedClaimsNestedInput = {
    create?: XOR<UserCreateWithoutSubmittedClaimsInput, UserUncheckedCreateWithoutSubmittedClaimsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubmittedClaimsInput
    upsert?: UserUpsertWithoutSubmittedClaimsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSubmittedClaimsInput, UserUpdateWithoutSubmittedClaimsInput>, UserUncheckedUpdateWithoutSubmittedClaimsInput>
  }

  export type CenterUpdateOneRequiredWithoutClaimsNestedInput = {
    create?: XOR<CenterCreateWithoutClaimsInput, CenterUncheckedCreateWithoutClaimsInput>
    connectOrCreate?: CenterCreateOrConnectWithoutClaimsInput
    upsert?: CenterUpsertWithoutClaimsInput
    connect?: CenterWhereUniqueInput
    update?: XOR<XOR<CenterUpdateToOneWithWhereWithoutClaimsInput, CenterUpdateWithoutClaimsInput>, CenterUncheckedUpdateWithoutClaimsInput>
  }

  export type UserUpdateOneWithoutProcessedClaimsNestedInput = {
    create?: XOR<UserCreateWithoutProcessedClaimsInput, UserUncheckedCreateWithoutProcessedClaimsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProcessedClaimsInput
    upsert?: UserUpsertWithoutProcessedClaimsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProcessedClaimsInput, UserUpdateWithoutProcessedClaimsInput>, UserUncheckedUpdateWithoutProcessedClaimsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumClaimStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ClaimStatus | EnumClaimStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ClaimStatus[]
    notIn?: $Enums.ClaimStatus[]
    not?: NestedEnumClaimStatusFilter<$PrismaModel> | $Enums.ClaimStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumClaimStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ClaimStatus | EnumClaimStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ClaimStatus[]
    notIn?: $Enums.ClaimStatus[]
    not?: NestedEnumClaimStatusWithAggregatesFilter<$PrismaModel> | $Enums.ClaimStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumClaimStatusFilter<$PrismaModel>
    _max?: NestedEnumClaimStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type CenterCreateWithoutCoordinatorInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lecturers?: UserCreateNestedManyWithoutLecturerCenterInput
    departments?: DepartmentCreateNestedManyWithoutCenterInput
    claims?: ClaimCreateNestedManyWithoutCenterInput
  }

  export type CenterUncheckedCreateWithoutCoordinatorInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lecturers?: UserUncheckedCreateNestedManyWithoutLecturerCenterInput
    departments?: DepartmentUncheckedCreateNestedManyWithoutCenterInput
    claims?: ClaimUncheckedCreateNestedManyWithoutCenterInput
  }

  export type CenterCreateOrConnectWithoutCoordinatorInput = {
    where: CenterWhereUniqueInput
    create: XOR<CenterCreateWithoutCoordinatorInput, CenterUncheckedCreateWithoutCoordinatorInput>
  }

  export type CenterCreateWithoutLecturersInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    coordinator: UserCreateNestedOneWithoutCoordinatedCenterInput
    departments?: DepartmentCreateNestedManyWithoutCenterInput
    claims?: ClaimCreateNestedManyWithoutCenterInput
  }

  export type CenterUncheckedCreateWithoutLecturersInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    coordinatorId: string
    departments?: DepartmentUncheckedCreateNestedManyWithoutCenterInput
    claims?: ClaimUncheckedCreateNestedManyWithoutCenterInput
  }

  export type CenterCreateOrConnectWithoutLecturersInput = {
    where: CenterWhereUniqueInput
    create: XOR<CenterCreateWithoutLecturersInput, CenterUncheckedCreateWithoutLecturersInput>
  }

  export type DepartmentCreateWithoutLecturersInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    center: CenterCreateNestedOneWithoutDepartmentsInput
  }

  export type DepartmentUncheckedCreateWithoutLecturersInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    centerId: string
  }

  export type DepartmentCreateOrConnectWithoutLecturersInput = {
    where: DepartmentWhereUniqueInput
    create: XOR<DepartmentCreateWithoutLecturersInput, DepartmentUncheckedCreateWithoutLecturersInput>
  }

  export type ClaimCreateWithoutSubmittedByInput = {
    id?: string
    title: string
    description?: string | null
    amount: number
    status?: $Enums.ClaimStatus
    submittedAt?: Date | string
    updatedAt?: Date | string
    processedAt?: Date | string | null
    center: CenterCreateNestedOneWithoutClaimsInput
    processedBy?: UserCreateNestedOneWithoutProcessedClaimsInput
  }

  export type ClaimUncheckedCreateWithoutSubmittedByInput = {
    id?: string
    title: string
    description?: string | null
    amount: number
    status?: $Enums.ClaimStatus
    submittedAt?: Date | string
    updatedAt?: Date | string
    processedAt?: Date | string | null
    centerId: string
    processedById?: string | null
  }

  export type ClaimCreateOrConnectWithoutSubmittedByInput = {
    where: ClaimWhereUniqueInput
    create: XOR<ClaimCreateWithoutSubmittedByInput, ClaimUncheckedCreateWithoutSubmittedByInput>
  }

  export type ClaimCreateManySubmittedByInputEnvelope = {
    data: ClaimCreateManySubmittedByInput | ClaimCreateManySubmittedByInput[]
    skipDuplicates?: boolean
  }

  export type ClaimCreateWithoutProcessedByInput = {
    id?: string
    title: string
    description?: string | null
    amount: number
    status?: $Enums.ClaimStatus
    submittedAt?: Date | string
    updatedAt?: Date | string
    processedAt?: Date | string | null
    submittedBy: UserCreateNestedOneWithoutSubmittedClaimsInput
    center: CenterCreateNestedOneWithoutClaimsInput
  }

  export type ClaimUncheckedCreateWithoutProcessedByInput = {
    id?: string
    title: string
    description?: string | null
    amount: number
    status?: $Enums.ClaimStatus
    submittedAt?: Date | string
    updatedAt?: Date | string
    processedAt?: Date | string | null
    submittedById: string
    centerId: string
  }

  export type ClaimCreateOrConnectWithoutProcessedByInput = {
    where: ClaimWhereUniqueInput
    create: XOR<ClaimCreateWithoutProcessedByInput, ClaimUncheckedCreateWithoutProcessedByInput>
  }

  export type ClaimCreateManyProcessedByInputEnvelope = {
    data: ClaimCreateManyProcessedByInput | ClaimCreateManyProcessedByInput[]
    skipDuplicates?: boolean
  }

  export type CenterUpsertWithoutCoordinatorInput = {
    update: XOR<CenterUpdateWithoutCoordinatorInput, CenterUncheckedUpdateWithoutCoordinatorInput>
    create: XOR<CenterCreateWithoutCoordinatorInput, CenterUncheckedCreateWithoutCoordinatorInput>
    where?: CenterWhereInput
  }

  export type CenterUpdateToOneWithWhereWithoutCoordinatorInput = {
    where?: CenterWhereInput
    data: XOR<CenterUpdateWithoutCoordinatorInput, CenterUncheckedUpdateWithoutCoordinatorInput>
  }

  export type CenterUpdateWithoutCoordinatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lecturers?: UserUpdateManyWithoutLecturerCenterNestedInput
    departments?: DepartmentUpdateManyWithoutCenterNestedInput
    claims?: ClaimUpdateManyWithoutCenterNestedInput
  }

  export type CenterUncheckedUpdateWithoutCoordinatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lecturers?: UserUncheckedUpdateManyWithoutLecturerCenterNestedInput
    departments?: DepartmentUncheckedUpdateManyWithoutCenterNestedInput
    claims?: ClaimUncheckedUpdateManyWithoutCenterNestedInput
  }

  export type CenterUpsertWithoutLecturersInput = {
    update: XOR<CenterUpdateWithoutLecturersInput, CenterUncheckedUpdateWithoutLecturersInput>
    create: XOR<CenterCreateWithoutLecturersInput, CenterUncheckedCreateWithoutLecturersInput>
    where?: CenterWhereInput
  }

  export type CenterUpdateToOneWithWhereWithoutLecturersInput = {
    where?: CenterWhereInput
    data: XOR<CenterUpdateWithoutLecturersInput, CenterUncheckedUpdateWithoutLecturersInput>
  }

  export type CenterUpdateWithoutLecturersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coordinator?: UserUpdateOneRequiredWithoutCoordinatedCenterNestedInput
    departments?: DepartmentUpdateManyWithoutCenterNestedInput
    claims?: ClaimUpdateManyWithoutCenterNestedInput
  }

  export type CenterUncheckedUpdateWithoutLecturersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coordinatorId?: StringFieldUpdateOperationsInput | string
    departments?: DepartmentUncheckedUpdateManyWithoutCenterNestedInput
    claims?: ClaimUncheckedUpdateManyWithoutCenterNestedInput
  }

  export type DepartmentUpsertWithoutLecturersInput = {
    update: XOR<DepartmentUpdateWithoutLecturersInput, DepartmentUncheckedUpdateWithoutLecturersInput>
    create: XOR<DepartmentCreateWithoutLecturersInput, DepartmentUncheckedCreateWithoutLecturersInput>
    where?: DepartmentWhereInput
  }

  export type DepartmentUpdateToOneWithWhereWithoutLecturersInput = {
    where?: DepartmentWhereInput
    data: XOR<DepartmentUpdateWithoutLecturersInput, DepartmentUncheckedUpdateWithoutLecturersInput>
  }

  export type DepartmentUpdateWithoutLecturersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    center?: CenterUpdateOneRequiredWithoutDepartmentsNestedInput
  }

  export type DepartmentUncheckedUpdateWithoutLecturersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    centerId?: StringFieldUpdateOperationsInput | string
  }

  export type ClaimUpsertWithWhereUniqueWithoutSubmittedByInput = {
    where: ClaimWhereUniqueInput
    update: XOR<ClaimUpdateWithoutSubmittedByInput, ClaimUncheckedUpdateWithoutSubmittedByInput>
    create: XOR<ClaimCreateWithoutSubmittedByInput, ClaimUncheckedCreateWithoutSubmittedByInput>
  }

  export type ClaimUpdateWithWhereUniqueWithoutSubmittedByInput = {
    where: ClaimWhereUniqueInput
    data: XOR<ClaimUpdateWithoutSubmittedByInput, ClaimUncheckedUpdateWithoutSubmittedByInput>
  }

  export type ClaimUpdateManyWithWhereWithoutSubmittedByInput = {
    where: ClaimScalarWhereInput
    data: XOR<ClaimUpdateManyMutationInput, ClaimUncheckedUpdateManyWithoutSubmittedByInput>
  }

  export type ClaimScalarWhereInput = {
    AND?: ClaimScalarWhereInput | ClaimScalarWhereInput[]
    OR?: ClaimScalarWhereInput[]
    NOT?: ClaimScalarWhereInput | ClaimScalarWhereInput[]
    id?: StringFilter<"Claim"> | string
    title?: StringFilter<"Claim"> | string
    description?: StringNullableFilter<"Claim"> | string | null
    amount?: FloatFilter<"Claim"> | number
    status?: EnumClaimStatusFilter<"Claim"> | $Enums.ClaimStatus
    submittedAt?: DateTimeFilter<"Claim"> | Date | string
    updatedAt?: DateTimeFilter<"Claim"> | Date | string
    processedAt?: DateTimeNullableFilter<"Claim"> | Date | string | null
    submittedById?: StringFilter<"Claim"> | string
    centerId?: StringFilter<"Claim"> | string
    processedById?: StringNullableFilter<"Claim"> | string | null
  }

  export type ClaimUpsertWithWhereUniqueWithoutProcessedByInput = {
    where: ClaimWhereUniqueInput
    update: XOR<ClaimUpdateWithoutProcessedByInput, ClaimUncheckedUpdateWithoutProcessedByInput>
    create: XOR<ClaimCreateWithoutProcessedByInput, ClaimUncheckedCreateWithoutProcessedByInput>
  }

  export type ClaimUpdateWithWhereUniqueWithoutProcessedByInput = {
    where: ClaimWhereUniqueInput
    data: XOR<ClaimUpdateWithoutProcessedByInput, ClaimUncheckedUpdateWithoutProcessedByInput>
  }

  export type ClaimUpdateManyWithWhereWithoutProcessedByInput = {
    where: ClaimScalarWhereInput
    data: XOR<ClaimUpdateManyMutationInput, ClaimUncheckedUpdateManyWithoutProcessedByInput>
  }

  export type UserCreateWithoutCoordinatedCenterInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    lecturerCenter?: CenterCreateNestedOneWithoutLecturersInput
    department?: DepartmentCreateNestedOneWithoutLecturersInput
    submittedClaims?: ClaimCreateNestedManyWithoutSubmittedByInput
    processedClaims?: ClaimCreateNestedManyWithoutProcessedByInput
  }

  export type UserUncheckedCreateWithoutCoordinatedCenterInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    lecturerCenterId?: string | null
    departmentId?: string | null
    submittedClaims?: ClaimUncheckedCreateNestedManyWithoutSubmittedByInput
    processedClaims?: ClaimUncheckedCreateNestedManyWithoutProcessedByInput
  }

  export type UserCreateOrConnectWithoutCoordinatedCenterInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCoordinatedCenterInput, UserUncheckedCreateWithoutCoordinatedCenterInput>
  }

  export type UserCreateWithoutLecturerCenterInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    coordinatedCenter?: CenterCreateNestedOneWithoutCoordinatorInput
    department?: DepartmentCreateNestedOneWithoutLecturersInput
    submittedClaims?: ClaimCreateNestedManyWithoutSubmittedByInput
    processedClaims?: ClaimCreateNestedManyWithoutProcessedByInput
  }

  export type UserUncheckedCreateWithoutLecturerCenterInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    departmentId?: string | null
    coordinatedCenter?: CenterUncheckedCreateNestedOneWithoutCoordinatorInput
    submittedClaims?: ClaimUncheckedCreateNestedManyWithoutSubmittedByInput
    processedClaims?: ClaimUncheckedCreateNestedManyWithoutProcessedByInput
  }

  export type UserCreateOrConnectWithoutLecturerCenterInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLecturerCenterInput, UserUncheckedCreateWithoutLecturerCenterInput>
  }

  export type UserCreateManyLecturerCenterInputEnvelope = {
    data: UserCreateManyLecturerCenterInput | UserCreateManyLecturerCenterInput[]
    skipDuplicates?: boolean
  }

  export type DepartmentCreateWithoutCenterInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lecturers?: UserCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentUncheckedCreateWithoutCenterInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lecturers?: UserUncheckedCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentCreateOrConnectWithoutCenterInput = {
    where: DepartmentWhereUniqueInput
    create: XOR<DepartmentCreateWithoutCenterInput, DepartmentUncheckedCreateWithoutCenterInput>
  }

  export type DepartmentCreateManyCenterInputEnvelope = {
    data: DepartmentCreateManyCenterInput | DepartmentCreateManyCenterInput[]
    skipDuplicates?: boolean
  }

  export type ClaimCreateWithoutCenterInput = {
    id?: string
    title: string
    description?: string | null
    amount: number
    status?: $Enums.ClaimStatus
    submittedAt?: Date | string
    updatedAt?: Date | string
    processedAt?: Date | string | null
    submittedBy: UserCreateNestedOneWithoutSubmittedClaimsInput
    processedBy?: UserCreateNestedOneWithoutProcessedClaimsInput
  }

  export type ClaimUncheckedCreateWithoutCenterInput = {
    id?: string
    title: string
    description?: string | null
    amount: number
    status?: $Enums.ClaimStatus
    submittedAt?: Date | string
    updatedAt?: Date | string
    processedAt?: Date | string | null
    submittedById: string
    processedById?: string | null
  }

  export type ClaimCreateOrConnectWithoutCenterInput = {
    where: ClaimWhereUniqueInput
    create: XOR<ClaimCreateWithoutCenterInput, ClaimUncheckedCreateWithoutCenterInput>
  }

  export type ClaimCreateManyCenterInputEnvelope = {
    data: ClaimCreateManyCenterInput | ClaimCreateManyCenterInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutCoordinatedCenterInput = {
    update: XOR<UserUpdateWithoutCoordinatedCenterInput, UserUncheckedUpdateWithoutCoordinatedCenterInput>
    create: XOR<UserCreateWithoutCoordinatedCenterInput, UserUncheckedCreateWithoutCoordinatedCenterInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCoordinatedCenterInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCoordinatedCenterInput, UserUncheckedUpdateWithoutCoordinatedCenterInput>
  }

  export type UserUpdateWithoutCoordinatedCenterInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lecturerCenter?: CenterUpdateOneWithoutLecturersNestedInput
    department?: DepartmentUpdateOneWithoutLecturersNestedInput
    submittedClaims?: ClaimUpdateManyWithoutSubmittedByNestedInput
    processedClaims?: ClaimUpdateManyWithoutProcessedByNestedInput
  }

  export type UserUncheckedUpdateWithoutCoordinatedCenterInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lecturerCenterId?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: NullableStringFieldUpdateOperationsInput | string | null
    submittedClaims?: ClaimUncheckedUpdateManyWithoutSubmittedByNestedInput
    processedClaims?: ClaimUncheckedUpdateManyWithoutProcessedByNestedInput
  }

  export type UserUpsertWithWhereUniqueWithoutLecturerCenterInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutLecturerCenterInput, UserUncheckedUpdateWithoutLecturerCenterInput>
    create: XOR<UserCreateWithoutLecturerCenterInput, UserUncheckedCreateWithoutLecturerCenterInput>
  }

  export type UserUpdateWithWhereUniqueWithoutLecturerCenterInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutLecturerCenterInput, UserUncheckedUpdateWithoutLecturerCenterInput>
  }

  export type UserUpdateManyWithWhereWithoutLecturerCenterInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutLecturerCenterInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    lecturerCenterId?: StringNullableFilter<"User"> | string | null
    departmentId?: StringNullableFilter<"User"> | string | null
  }

  export type DepartmentUpsertWithWhereUniqueWithoutCenterInput = {
    where: DepartmentWhereUniqueInput
    update: XOR<DepartmentUpdateWithoutCenterInput, DepartmentUncheckedUpdateWithoutCenterInput>
    create: XOR<DepartmentCreateWithoutCenterInput, DepartmentUncheckedCreateWithoutCenterInput>
  }

  export type DepartmentUpdateWithWhereUniqueWithoutCenterInput = {
    where: DepartmentWhereUniqueInput
    data: XOR<DepartmentUpdateWithoutCenterInput, DepartmentUncheckedUpdateWithoutCenterInput>
  }

  export type DepartmentUpdateManyWithWhereWithoutCenterInput = {
    where: DepartmentScalarWhereInput
    data: XOR<DepartmentUpdateManyMutationInput, DepartmentUncheckedUpdateManyWithoutCenterInput>
  }

  export type DepartmentScalarWhereInput = {
    AND?: DepartmentScalarWhereInput | DepartmentScalarWhereInput[]
    OR?: DepartmentScalarWhereInput[]
    NOT?: DepartmentScalarWhereInput | DepartmentScalarWhereInput[]
    id?: StringFilter<"Department"> | string
    name?: StringFilter<"Department"> | string
    createdAt?: DateTimeFilter<"Department"> | Date | string
    updatedAt?: DateTimeFilter<"Department"> | Date | string
    centerId?: StringFilter<"Department"> | string
  }

  export type ClaimUpsertWithWhereUniqueWithoutCenterInput = {
    where: ClaimWhereUniqueInput
    update: XOR<ClaimUpdateWithoutCenterInput, ClaimUncheckedUpdateWithoutCenterInput>
    create: XOR<ClaimCreateWithoutCenterInput, ClaimUncheckedCreateWithoutCenterInput>
  }

  export type ClaimUpdateWithWhereUniqueWithoutCenterInput = {
    where: ClaimWhereUniqueInput
    data: XOR<ClaimUpdateWithoutCenterInput, ClaimUncheckedUpdateWithoutCenterInput>
  }

  export type ClaimUpdateManyWithWhereWithoutCenterInput = {
    where: ClaimScalarWhereInput
    data: XOR<ClaimUpdateManyMutationInput, ClaimUncheckedUpdateManyWithoutCenterInput>
  }

  export type CenterCreateWithoutDepartmentsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    coordinator: UserCreateNestedOneWithoutCoordinatedCenterInput
    lecturers?: UserCreateNestedManyWithoutLecturerCenterInput
    claims?: ClaimCreateNestedManyWithoutCenterInput
  }

  export type CenterUncheckedCreateWithoutDepartmentsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    coordinatorId: string
    lecturers?: UserUncheckedCreateNestedManyWithoutLecturerCenterInput
    claims?: ClaimUncheckedCreateNestedManyWithoutCenterInput
  }

  export type CenterCreateOrConnectWithoutDepartmentsInput = {
    where: CenterWhereUniqueInput
    create: XOR<CenterCreateWithoutDepartmentsInput, CenterUncheckedCreateWithoutDepartmentsInput>
  }

  export type UserCreateWithoutDepartmentInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    coordinatedCenter?: CenterCreateNestedOneWithoutCoordinatorInput
    lecturerCenter?: CenterCreateNestedOneWithoutLecturersInput
    submittedClaims?: ClaimCreateNestedManyWithoutSubmittedByInput
    processedClaims?: ClaimCreateNestedManyWithoutProcessedByInput
  }

  export type UserUncheckedCreateWithoutDepartmentInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    lecturerCenterId?: string | null
    coordinatedCenter?: CenterUncheckedCreateNestedOneWithoutCoordinatorInput
    submittedClaims?: ClaimUncheckedCreateNestedManyWithoutSubmittedByInput
    processedClaims?: ClaimUncheckedCreateNestedManyWithoutProcessedByInput
  }

  export type UserCreateOrConnectWithoutDepartmentInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDepartmentInput, UserUncheckedCreateWithoutDepartmentInput>
  }

  export type UserCreateManyDepartmentInputEnvelope = {
    data: UserCreateManyDepartmentInput | UserCreateManyDepartmentInput[]
    skipDuplicates?: boolean
  }

  export type CenterUpsertWithoutDepartmentsInput = {
    update: XOR<CenterUpdateWithoutDepartmentsInput, CenterUncheckedUpdateWithoutDepartmentsInput>
    create: XOR<CenterCreateWithoutDepartmentsInput, CenterUncheckedCreateWithoutDepartmentsInput>
    where?: CenterWhereInput
  }

  export type CenterUpdateToOneWithWhereWithoutDepartmentsInput = {
    where?: CenterWhereInput
    data: XOR<CenterUpdateWithoutDepartmentsInput, CenterUncheckedUpdateWithoutDepartmentsInput>
  }

  export type CenterUpdateWithoutDepartmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coordinator?: UserUpdateOneRequiredWithoutCoordinatedCenterNestedInput
    lecturers?: UserUpdateManyWithoutLecturerCenterNestedInput
    claims?: ClaimUpdateManyWithoutCenterNestedInput
  }

  export type CenterUncheckedUpdateWithoutDepartmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coordinatorId?: StringFieldUpdateOperationsInput | string
    lecturers?: UserUncheckedUpdateManyWithoutLecturerCenterNestedInput
    claims?: ClaimUncheckedUpdateManyWithoutCenterNestedInput
  }

  export type UserUpsertWithWhereUniqueWithoutDepartmentInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutDepartmentInput, UserUncheckedUpdateWithoutDepartmentInput>
    create: XOR<UserCreateWithoutDepartmentInput, UserUncheckedCreateWithoutDepartmentInput>
  }

  export type UserUpdateWithWhereUniqueWithoutDepartmentInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutDepartmentInput, UserUncheckedUpdateWithoutDepartmentInput>
  }

  export type UserUpdateManyWithWhereWithoutDepartmentInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutDepartmentInput>
  }

  export type UserCreateWithoutSubmittedClaimsInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    coordinatedCenter?: CenterCreateNestedOneWithoutCoordinatorInput
    lecturerCenter?: CenterCreateNestedOneWithoutLecturersInput
    department?: DepartmentCreateNestedOneWithoutLecturersInput
    processedClaims?: ClaimCreateNestedManyWithoutProcessedByInput
  }

  export type UserUncheckedCreateWithoutSubmittedClaimsInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    lecturerCenterId?: string | null
    departmentId?: string | null
    coordinatedCenter?: CenterUncheckedCreateNestedOneWithoutCoordinatorInput
    processedClaims?: ClaimUncheckedCreateNestedManyWithoutProcessedByInput
  }

  export type UserCreateOrConnectWithoutSubmittedClaimsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSubmittedClaimsInput, UserUncheckedCreateWithoutSubmittedClaimsInput>
  }

  export type CenterCreateWithoutClaimsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    coordinator: UserCreateNestedOneWithoutCoordinatedCenterInput
    lecturers?: UserCreateNestedManyWithoutLecturerCenterInput
    departments?: DepartmentCreateNestedManyWithoutCenterInput
  }

  export type CenterUncheckedCreateWithoutClaimsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    coordinatorId: string
    lecturers?: UserUncheckedCreateNestedManyWithoutLecturerCenterInput
    departments?: DepartmentUncheckedCreateNestedManyWithoutCenterInput
  }

  export type CenterCreateOrConnectWithoutClaimsInput = {
    where: CenterWhereUniqueInput
    create: XOR<CenterCreateWithoutClaimsInput, CenterUncheckedCreateWithoutClaimsInput>
  }

  export type UserCreateWithoutProcessedClaimsInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    coordinatedCenter?: CenterCreateNestedOneWithoutCoordinatorInput
    lecturerCenter?: CenterCreateNestedOneWithoutLecturersInput
    department?: DepartmentCreateNestedOneWithoutLecturersInput
    submittedClaims?: ClaimCreateNestedManyWithoutSubmittedByInput
  }

  export type UserUncheckedCreateWithoutProcessedClaimsInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    lecturerCenterId?: string | null
    departmentId?: string | null
    coordinatedCenter?: CenterUncheckedCreateNestedOneWithoutCoordinatorInput
    submittedClaims?: ClaimUncheckedCreateNestedManyWithoutSubmittedByInput
  }

  export type UserCreateOrConnectWithoutProcessedClaimsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProcessedClaimsInput, UserUncheckedCreateWithoutProcessedClaimsInput>
  }

  export type UserUpsertWithoutSubmittedClaimsInput = {
    update: XOR<UserUpdateWithoutSubmittedClaimsInput, UserUncheckedUpdateWithoutSubmittedClaimsInput>
    create: XOR<UserCreateWithoutSubmittedClaimsInput, UserUncheckedCreateWithoutSubmittedClaimsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSubmittedClaimsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSubmittedClaimsInput, UserUncheckedUpdateWithoutSubmittedClaimsInput>
  }

  export type UserUpdateWithoutSubmittedClaimsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coordinatedCenter?: CenterUpdateOneWithoutCoordinatorNestedInput
    lecturerCenter?: CenterUpdateOneWithoutLecturersNestedInput
    department?: DepartmentUpdateOneWithoutLecturersNestedInput
    processedClaims?: ClaimUpdateManyWithoutProcessedByNestedInput
  }

  export type UserUncheckedUpdateWithoutSubmittedClaimsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lecturerCenterId?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: NullableStringFieldUpdateOperationsInput | string | null
    coordinatedCenter?: CenterUncheckedUpdateOneWithoutCoordinatorNestedInput
    processedClaims?: ClaimUncheckedUpdateManyWithoutProcessedByNestedInput
  }

  export type CenterUpsertWithoutClaimsInput = {
    update: XOR<CenterUpdateWithoutClaimsInput, CenterUncheckedUpdateWithoutClaimsInput>
    create: XOR<CenterCreateWithoutClaimsInput, CenterUncheckedCreateWithoutClaimsInput>
    where?: CenterWhereInput
  }

  export type CenterUpdateToOneWithWhereWithoutClaimsInput = {
    where?: CenterWhereInput
    data: XOR<CenterUpdateWithoutClaimsInput, CenterUncheckedUpdateWithoutClaimsInput>
  }

  export type CenterUpdateWithoutClaimsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coordinator?: UserUpdateOneRequiredWithoutCoordinatedCenterNestedInput
    lecturers?: UserUpdateManyWithoutLecturerCenterNestedInput
    departments?: DepartmentUpdateManyWithoutCenterNestedInput
  }

  export type CenterUncheckedUpdateWithoutClaimsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coordinatorId?: StringFieldUpdateOperationsInput | string
    lecturers?: UserUncheckedUpdateManyWithoutLecturerCenterNestedInput
    departments?: DepartmentUncheckedUpdateManyWithoutCenterNestedInput
  }

  export type UserUpsertWithoutProcessedClaimsInput = {
    update: XOR<UserUpdateWithoutProcessedClaimsInput, UserUncheckedUpdateWithoutProcessedClaimsInput>
    create: XOR<UserCreateWithoutProcessedClaimsInput, UserUncheckedCreateWithoutProcessedClaimsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProcessedClaimsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProcessedClaimsInput, UserUncheckedUpdateWithoutProcessedClaimsInput>
  }

  export type UserUpdateWithoutProcessedClaimsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coordinatedCenter?: CenterUpdateOneWithoutCoordinatorNestedInput
    lecturerCenter?: CenterUpdateOneWithoutLecturersNestedInput
    department?: DepartmentUpdateOneWithoutLecturersNestedInput
    submittedClaims?: ClaimUpdateManyWithoutSubmittedByNestedInput
  }

  export type UserUncheckedUpdateWithoutProcessedClaimsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lecturerCenterId?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: NullableStringFieldUpdateOperationsInput | string | null
    coordinatedCenter?: CenterUncheckedUpdateOneWithoutCoordinatorNestedInput
    submittedClaims?: ClaimUncheckedUpdateManyWithoutSubmittedByNestedInput
  }

  export type ClaimCreateManySubmittedByInput = {
    id?: string
    title: string
    description?: string | null
    amount: number
    status?: $Enums.ClaimStatus
    submittedAt?: Date | string
    updatedAt?: Date | string
    processedAt?: Date | string | null
    centerId: string
    processedById?: string | null
  }

  export type ClaimCreateManyProcessedByInput = {
    id?: string
    title: string
    description?: string | null
    amount: number
    status?: $Enums.ClaimStatus
    submittedAt?: Date | string
    updatedAt?: Date | string
    processedAt?: Date | string | null
    submittedById: string
    centerId: string
  }

  export type ClaimUpdateWithoutSubmittedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    center?: CenterUpdateOneRequiredWithoutClaimsNestedInput
    processedBy?: UserUpdateOneWithoutProcessedClaimsNestedInput
  }

  export type ClaimUncheckedUpdateWithoutSubmittedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    centerId?: StringFieldUpdateOperationsInput | string
    processedById?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ClaimUncheckedUpdateManyWithoutSubmittedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    centerId?: StringFieldUpdateOperationsInput | string
    processedById?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ClaimUpdateWithoutProcessedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedBy?: UserUpdateOneRequiredWithoutSubmittedClaimsNestedInput
    center?: CenterUpdateOneRequiredWithoutClaimsNestedInput
  }

  export type ClaimUncheckedUpdateWithoutProcessedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedById?: StringFieldUpdateOperationsInput | string
    centerId?: StringFieldUpdateOperationsInput | string
  }

  export type ClaimUncheckedUpdateManyWithoutProcessedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedById?: StringFieldUpdateOperationsInput | string
    centerId?: StringFieldUpdateOperationsInput | string
  }

  export type UserCreateManyLecturerCenterInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    departmentId?: string | null
  }

  export type DepartmentCreateManyCenterInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClaimCreateManyCenterInput = {
    id?: string
    title: string
    description?: string | null
    amount: number
    status?: $Enums.ClaimStatus
    submittedAt?: Date | string
    updatedAt?: Date | string
    processedAt?: Date | string | null
    submittedById: string
    processedById?: string | null
  }

  export type UserUpdateWithoutLecturerCenterInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coordinatedCenter?: CenterUpdateOneWithoutCoordinatorNestedInput
    department?: DepartmentUpdateOneWithoutLecturersNestedInput
    submittedClaims?: ClaimUpdateManyWithoutSubmittedByNestedInput
    processedClaims?: ClaimUpdateManyWithoutProcessedByNestedInput
  }

  export type UserUncheckedUpdateWithoutLecturerCenterInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    departmentId?: NullableStringFieldUpdateOperationsInput | string | null
    coordinatedCenter?: CenterUncheckedUpdateOneWithoutCoordinatorNestedInput
    submittedClaims?: ClaimUncheckedUpdateManyWithoutSubmittedByNestedInput
    processedClaims?: ClaimUncheckedUpdateManyWithoutProcessedByNestedInput
  }

  export type UserUncheckedUpdateManyWithoutLecturerCenterInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    departmentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DepartmentUpdateWithoutCenterInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lecturers?: UserUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentUncheckedUpdateWithoutCenterInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lecturers?: UserUncheckedUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentUncheckedUpdateManyWithoutCenterInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClaimUpdateWithoutCenterInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedBy?: UserUpdateOneRequiredWithoutSubmittedClaimsNestedInput
    processedBy?: UserUpdateOneWithoutProcessedClaimsNestedInput
  }

  export type ClaimUncheckedUpdateWithoutCenterInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedById?: StringFieldUpdateOperationsInput | string
    processedById?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ClaimUncheckedUpdateManyWithoutCenterInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    status?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedById?: StringFieldUpdateOperationsInput | string
    processedById?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserCreateManyDepartmentInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    lecturerCenterId?: string | null
  }

  export type UserUpdateWithoutDepartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coordinatedCenter?: CenterUpdateOneWithoutCoordinatorNestedInput
    lecturerCenter?: CenterUpdateOneWithoutLecturersNestedInput
    submittedClaims?: ClaimUpdateManyWithoutSubmittedByNestedInput
    processedClaims?: ClaimUpdateManyWithoutProcessedByNestedInput
  }

  export type UserUncheckedUpdateWithoutDepartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lecturerCenterId?: NullableStringFieldUpdateOperationsInput | string | null
    coordinatedCenter?: CenterUncheckedUpdateOneWithoutCoordinatorNestedInput
    submittedClaims?: ClaimUncheckedUpdateManyWithoutSubmittedByNestedInput
    processedClaims?: ClaimUncheckedUpdateManyWithoutProcessedByNestedInput
  }

  export type UserUncheckedUpdateManyWithoutDepartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lecturerCenterId?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}