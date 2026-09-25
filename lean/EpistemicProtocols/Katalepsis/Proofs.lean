module
public import Contract.Katalepsis
public section
open Ground
namespace Katalepsis
variable {P : Type}

instance : Nonempty RouteMap := ⟨⟨[], [], [], []⟩⟩
instance {c : Context P} : Nonempty (Reading c) := ⟨⟨.entrySelection, .pending⟩⟩
instance {c : Context P} : Nonempty (Assessment c) := ⟨⟨[], [], none⟩⟩


theorem earlier_turns_never_reread (c t : Context P) : ∃ more, said (c ++ t) = said c ++ more := by
  have key : ∀ l : List Nat, (∀ i ∈ l, i < c.length) →
      l.filterMap (fun i => ((c ++ t)[i]?.bind asUtterance).map
        (fun u => (i, readRecord ((c ++ t).take i) u))) =
      l.filterMap (fun i => (c[i]?.bind asUtterance).map (fun u => (i, readRecord (c.take i) u))) := by
    intro l hl
    induction l with
    | nil => rfl
    | cons i l ih =>
      have hi := hl i (by simp)
      simp only [List.filterMap_cons, List.getElem?_append_left hi,
        List.take_append_of_le_length (show i ≤ c.length by omega),
        ih (fun j hj => hl j (List.mem_cons_of_mem i hj))]
  simp only [said, List.length_append, List.range_add, List.filterMap_append]
  exact ⟨_, congrArg (· ++ _) (key _ (fun i hi => List.mem_range.mp hi))⟩

theorem responses_say_nothing (c : Context P) (r : Response P) : said (c ++ [r.val]) = said c := by
  have hr : asUtterance r.val = none := by
    obtain ⟨⟨o, x⟩, ho⟩ := r
    simp only at ho; subst ho; rfl
  have key : ∀ l : List Nat, (∀ i ∈ l, i < c.length) →
      l.filterMap (fun i => ((c ++ [r.val])[i]?.bind asUtterance).map
        (fun u => (i, readRecord ((c ++ [r.val]).take i) u))) =
      l.filterMap (fun i => (c[i]?.bind asUtterance).map (fun u => (i, readRecord (c.take i) u))) := by
    intro l hl
    induction l with
    | nil => rfl
    | cons i l ih =>
      have hi := hl i (by simp)
      simp only [List.filterMap_cons, List.getElem?_append_left hi,
        List.take_append_of_le_length (show i ≤ c.length by omega),
        ih (fun j hj => hl j (List.mem_cons_of_mem i hj))]
  simp only [said, List.length_append, List.length_singleton, List.range_succ,
    List.filterMap_append]
  rw [key _ (fun i hi => List.mem_range.mp hi)]
  simp [hr]

theorem said_by_person (c : Context P) (i : Nat) (x : Record) (h : (i, x) ∈ said c) :
    ∃ u : Utterance P, c[i]? = some u.val := by
  simp only [said, List.mem_filterMap, Option.map_eq_some_iff, Option.bind_eq_some_iff] at h
  obtain ⟨j, -, u, ⟨e, he, hu⟩, hji⟩ := h
  cases hji
  obtain ⟨o, x'⟩ := e
  cases o <;> simp [asUtterance] at hu
  exact ⟨⟨⟨.person, x'⟩, rfl⟩, he⟩


theorem silence (respond : (c : Context P) → Round c → Response P)
    (trace : Context P → Trace → Response P) (c : Context P) :
    grasp respond trace c [] = .holding c := rfl

theorem user_conflict_first (c : Context P) (t : RecordId) (g : Gate)
    (k : Contradiction c) (h : userConflict c t = some k) :
    (settle c t g).gate = .conflict t := by simp [settle, h]

theorem horizon_preempts (c : Context P) (t : RecordId) (g : Gate)
    (hu : userConflict c t = none) (h : HorizonCandidate)
    (hd : dueHorizon c t = some h) :
    (settle c t g).gate = .horizonProbe t h.edge := by simp [settle, hu, hd]

theorem asked_not_due (c : Context P) (t : RecordId) (h : HorizonCandidate)
    (ha : admissible (assess c t) = some h) (hk : Asked c t h.edge) :
    dueHorizon c t = none := by simp [dueHorizon, ha, hk]

theorem singleton_admission (a : Assessment (P := P) c) (h : HorizonCandidate)
    (ha : admissible a = some h) : a.candidates = [h] := by
  unfold admissible at ha
  split at ha
  · cases ha; assumption
  · cases ha

theorem miss_discloses_material (c : Context P) (t : RecordId) (edge : String)
    (a : Adjudication c) :
    advance c ⟨.horizonProbe t edge, .correct a⟩ = .gate ⟨.reveal t edge, [.material a]⟩ := rfl

theorem conflict_resolves_material (c : Context P) (t : RecordId) (a : Adjudication c) :
    advance c ⟨.conflict t, .correct a⟩ = .gate ⟨.resolve t, [.material a]⟩ := rfl

theorem inquiry_corrects_material (c : Context P) (t : RecordId) (g : Aspect)
    (a : Adjudication c) :
    advance c ⟨.inquiry t g, .correct a⟩ = .gate ⟨again t g, [.material a]⟩ := rfl

theorem other_intent_redirects (c : Context P) (g : Gate) (e : EntryPoint) (basis : String) :
    advance c ⟨g, .other e basis⟩ = .gate (redirect c e basis) := rfl

theorem steps_cue (c : Context P) (t : RecordId) (edge : String) :
    advance c ⟨.horizonProbe t edge, .steps⟩ = .gate ⟨.cue t edge, []⟩ := rfl

theorem proposal_recorded (c : Context P) (g : Gate) (s : String) :
    advance c ⟨g, .propose s⟩ = .gate ⟨resumeOf g, [.proposal s]⟩ := rfl

theorem no_verdict_without_measure (c : Context P) (g : Gate) (why : String) :
    advance c ⟨g, .accepted why⟩ = .gate (returning c g why) := rfl

theorem no_adjudication_at_probe (c : Context P) (t : RecordId) (g : Selectable)
    (a : Adjudication c) :
    advance c ⟨.probe t g, .correct a⟩ = .gate ⟨.probe t g, []⟩ := rfl

theorem completed_persists (c more : Context P) (t : RecordId) (h : completed c t) :
    completed (c ++ more) t := by
  obtain ⟨tail, ht⟩ := earlier_turns_never_reread c more
  obtain ⟨i, r, hr, hg, ha⟩ := h
  exact ⟨i, r, by rw [ht]; exact List.mem_append_left _ hr, hg, ha⟩

theorem tasks_persist (c more : Context P) : ∃ ts, tasks (c ++ more) = tasks c ++ ts := by
  obtain ⟨tail, ht⟩ := earlier_turns_never_reread c more
  simp only [tasks, ht, List.flatMap_append]
  exact ⟨_, rfl⟩

theorem certified_nonempty (v : VerifiedUnderstanding P) : tasks v.basis ≠ [] := v.closed.1

theorem certified_all_closed (v : VerifiedUnderstanding P) :
    ∀ t ∈ tasks v.basis, completed v.basis t.id := v.closed.2

theorem completed_by_person (c : Context P) (t : RecordId) (h : completed c t) :
    ∃ i r, ∃ u : Utterance P, c[i]? = some u.val ∧ (i, r) ∈ said c ∧
      r.gate.task = some t ∧ r.act = .close := by
  obtain ⟨i, r, hr, hg, ha⟩ := h
  obtain ⟨u, hu⟩ := said_by_person c i r hr
  exact ⟨i, r, u, hu, hr, hg, ha⟩

theorem advance_done_closed (c : Context P) (r : Reading c) (h : AllClosed c)
    (hd : advance c r = .done h) : (recorded r).act = .close := by
  obtain ⟨g, a⟩ := r
  cases a <;> simp only [advance] at hd
  all_goals try contradiction
  all_goals try { split at hd <;> contradiction }
  case choose v =>
    cases g <;> cases v <;> simp only at hd
    all_goals try contradiction
    all_goals simp [recorded]

theorem advance_withdrawn (c : Context P) (r : Reading c)
    (h : advance c r = .withdrawn) : r.answer = .withdraw := by
  obtain ⟨g, a⟩ := r
  cases a <;> simp only [advance] at h
  all_goals try rfl
  all_goals try contradiction
  all_goals repeat first | split at h | contradiction

theorem verified_by_person (respond : (c : Context P) → Round c → Response P)
    (trace : Context P → Trace → Response P) (c : Context P) (us : List (Utterance P))
    (v : VerifiedUnderstanding P) (hv : grasp respond trace c us = .verified v) :
    ∃ (c₀ : Context P) (u : Utterance P), v.basis = consulted c₀ u ∧
      (recorded (read c₀ u)).act = .close ∧ AllClosed v.basis := by
  induction us generalizing c with
  | nil => simp [grasp] at hv
  | cons u us ih =>
    simp only [grasp] at hv
    split at hv
    · rename_i hc he
      cases hv
      exact ⟨c, u, rfl, advance_done_closed _ _ hc he, hc⟩
    · cases hv
    · exact ih _ hv

theorem withdrawn_by_person (respond : (c : Context P) → Round c → Response P)
    (trace : Context P → Trace → Response P) (c : Context P) (us : List (Utterance P))
    (basis : Context P) (presentation : Response P)
    (hw : grasp respond trace c us = .withdrawn basis presentation) :
    ∃ (c₀ : Context P) (u : Utterance P), basis = consulted c₀ u ∧ (read c₀ u).answer = .withdraw := by
  induction us generalizing c with
  | nil => simp [grasp] at hw
  | cons u us ih =>
    simp only [grasp] at hw
    split at hw
    · cases hw
    · rename_i he
      cases hw
      exact ⟨c, u, rfl, advance_withdrawn _ _ he⟩
    · exact ih _ hw

theorem selection_never_horizon (g : Selectable) : g.val ≠ .horizon := by
  intro h
  have hp := g.property
  rw [h] at hp
  simp [offered] at hp

theorem selection_never_conflict (g : Selectable) : g.val ≠ .contradiction := by
  intro h
  have hp := g.property
  rw [h] at hp
  simp [offered] at hp


theorem close_at_closing_gate (c : Context P) (r : Reading c)
    (h : (recorded r).act = .close) : r.gate.closable = true ∧ r.answer = .choose .close := by
  obtain ⟨g, a⟩ := r
  cases a <;> simp only [recorded] at h
  all_goals try contradiction
  all_goals try { split at h <;> contradiction }
  case choose v =>
    cases g <;> cases v <;> simp only at h
    all_goals try contradiction
    all_goals exact ⟨rfl, rfl⟩

theorem shown_requires_measure (c : Context P) (r : Reading c)
    (h : (recorded r).act = .met) : ∃ m, r.answer = .met m := by
  obtain ⟨g, a⟩ := r
  cases a <;> simp only [recorded] at h
  all_goals try contradiction
  all_goals try { split at h <;> contradiction }
  case met m => exact ⟨m, rfl⟩

theorem disclosure_stays_assisted (c : Context P) (t : RecordId) (g : Aspect)
    (h : (said c).any (fun (_, r) => r.gate.task == some t && r.gate.aspect == some g &&
      match r.act with | .correct => true | _ => false) = true) :
    assistance c t g = .afterDisclosure := by
  unfold assistance
  exact ite_eq_left h


theorem other_intent_no_disclosure (c : Context P) (e : EntryPoint) (basis : String)
    (t : RecordId) (edge : String) :
    (redirect c e basis).gate ≠ .reveal t edge ∧ (redirect c e basis).gate ≠ .resolve t := by
  constructor <;> simp only [redirect]
  all_goals split
  all_goals simp only [gateFor, settle, entryRound]
  all_goals repeat first | split | exact fun h => Gate.noConfusion h

end Katalepsis
