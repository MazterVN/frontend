/**
 * Gets the type at a given dot-notation path in an object type
 * @example
 * type User = { profile: { name: string } }
 * type Name = At<User, 'profile.name'> // string
 */
export type At<T, Path extends PathsIn<T>> =
    Path extends KeysIn<T>
      ? NonNullable<T[Path]> extends Array<infer R>
        ? NonNullable<R>
        : NonNullable<T[Path]>
      : Path extends `${infer First}.${infer Rest}`
        ? First extends KeysIn<T>
          ? NonNullable<T[First]> extends Array<infer R>
            ? Rest extends PathsIn<R>
              ? At<R, Rest>
              : never
            : Rest extends PathsIn<NonNullable<T[First]>>
              ? At<NonNullable<T[First]>, Rest>
              : never
          : never
        : never

/**
 * Gets all possible dot-notation paths through an object type
 * @example
 * type User = { profile: { name: string } }
 * type Paths = PathsIn<User> // 'profile' | 'profile.name'
 */
type PathsIn<T, Path extends string = ''> =
    T extends Array<infer R>
      ? Path | PathsIn<R, `${Path}`>
      : T extends object
        ? {
            [K in KeysIn<T>]:
              | Path
              | PathsIn<T[K], `${Path}${Path extends '' ? '' : '.'}${K}`>;
          }[KeysIn<T>]
        : Path

/**
 * Gets valid keys that can be used to index into an object type
 */
type KeysIn<T> = T extends object
  ? keyof T extends string | number
    ? keyof T
    : never
  : never
