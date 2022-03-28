import { ObjectRef } from "@pothos/core"

export const nodeIsTypeOf = (objectRef: ObjectRef<unknown>) => ({
  isTypeOf: (node: { _type: string }) => {
    return node._type === objectRef.name
  },
})

export const nodeResolveId = {
  id: {
    resolve: <T>(node: { id: T }) => node.id,
  },
}

export const idSort = () => ({
  sort: <T>(node: { id: T }) => node.id,
})
