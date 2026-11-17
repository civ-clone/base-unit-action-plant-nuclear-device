# base-unit-action-plant-nuclear-device

The `PlantNuclearDevice` unit action: a Spy sets off a nuclear device in a city, with criteria for offering it.

- `PlantNuclearDevice`: `new PlantNuclearDevice(from, to, unit, city, ruleRegistry?)`. `perform()`, in order:
  1. a caught check (base-unit-agent's `AgentSurvives` with `CAUGHT_CHECK`; a rule set that makes several, such as
     Civ2's three and one more for a Palace, answers for them all), after `MissionMode`: a Spy that is caught goes to
     `AgentLost` and is destroyed by the city's owner, and nothing goes off;
  2. the device detonates over the city's square: the rule set's `Detonated` rules run
     (base-unit-action-nuclear-attack's, which a missile's detonation runs too), with this action in place of a
     `NuclearAttack`;
  3. the `DevicePlanted` rules;
  4. `Moved`, then a Spy the blast didn't destroy is used up (`AgentLost`, then destroyed) unless it survives
     `AgentSurvives` with the resolved mode; a rule that keeps it must spend its moves.

  It isn't a `NuclearAttack`, so nothing that checks for one treats a planted device as one. But every `Detonated`
  rule runs for it, and one that reads no action, such as the vendetta rule a rule set registers from base-diplomacy,
  applies to a planted device as to a missile: a Civ2 rule that should tell them apart must check
  `action instanceof NuclearAttack`.
- `Rules/DevicePlanted`: `DevicePlanted(unit, city, action)`, for what follows the blast (Civ2: unless the Spy's
  player is Fundamentalist, the other civilizations may find out, and declare war).
- `lib/criteria`: `plantNuclearDeviceCriteria({ cityRegistry }, canPlant)`, in order: a neighbouring tile, moves left,
  a city of another player on `to`, and `canPlant(unit, city)`. A rule set adds its own peace criteria after these.

A library: it has no `main` and registers no rules.
