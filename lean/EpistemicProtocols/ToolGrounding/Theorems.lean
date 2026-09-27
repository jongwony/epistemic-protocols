module

public import EpistemicProtocols.ToolGrounding

/-! The theorems the TOOL GROUNDING vocabulary guarantees, each stated and proved here; every
    public theorem is a guarantee the audit lists. -/

public section

namespace ToolGrounding

/-- Only a Constitution holds the turn: every other interaction proceeds past its presentation. -/
theorem stops_iff_constitution (k : Interaction) : k.realization = .stop ↔ k = .constitution := by
  cases k <;> simp [Interaction.realization]

end ToolGrounding
