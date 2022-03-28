export const isTruthy = <T>(val?: T | null): val is T => !!val

export const isTruthyNode = <N, T extends { node?: N | null }>(
  val?: T | null,
): val is NonNullable<T> => !!val?.node

export const filterNodes = <N, T extends { node?: N | null }>(
  edges?: (T | null)[],
) => edges?.filter(isTruthyNode)
