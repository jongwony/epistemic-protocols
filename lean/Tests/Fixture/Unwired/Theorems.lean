import Tests.Fixture.Unwired.Contract

/-! A guarantee that names the hand-off: a Theorems module does not wire it into the contract. -/

namespace Unwired

theorem send_dispatches : (grounding .send).1 = .dispatch := rfl

end Unwired
