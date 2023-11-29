import { describe ,test,expect} from "vitest";
import { shallowReadOnly, isReadonly } from "../reactivity/reactive";

describe('shallowReadonly', () => {
  test('should not make non-reactive properties reactive', () => {
    const props = shallowReadOnly({ n: { foo: 1 } })
    expect(isReadonly(props)).toBe(true)
    expect(isReadonly(props.n)).toBe(false)
  })
})
