import Tests.Fixture.Foreign.Contract

/-! A guarantee about the contract, so that only the grounding rules fire. -/

namespace Foreign

theorem look_inspects : (grounding .look).1 = .inspect := rfl

end Foreign
