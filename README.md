# base-unit-action-plant-nuclear-device

The `PlantNuclearDevice` unit action: a Spy sets off a nuclear device in a city, with criteria for offering it.

- `PlantNuclearDevice`: `new PlantNuclearDevice(from, to, unit, city, ruleRegistry?)`. `perform()`, in order:
  1. a caught check (base-unit-agent's `AgentSurvives` with `CAUGHT_CHECK`; a rule set that makes several, such as
     Civ2's three and one more for a Palace, answers for them all): a Spy that is caught is destroyed and nothing goes
     off;
  2. the device detonates over the city's square: the rule set's `Detonated` rules run
     (base-unit-action-nuclear-attack's, which a missile's detonation runs too), with this action in place of a
     `NuclearAttack`;
  3. the `DevicePlanted` rules;
  4. `Moved`, then a Spy the blast didn't destroy is used up unless it survives an `ORDINARY` check.

  It isn't a `NuclearAttack`, so nothing that treats a missile strike as one treats a planted device as one. The
  `Detonated` rules can tell the two apart by the action.
- `Rules/DevicePlanted`: `DevicePlanted(unit, city, action)`, for what follows the blast (Civ2: unless the Spy's
  player is Fundamentalist, the other civilizations may find out, and declare war).
- `lib/criteria`: `plantNuclearDeviceCriteria({ cityRegistry }, canPlant)`, in order: a neighbouring tile, moves left,
  a city of another player on `to`, and `canPlant(unit, city)`. A rule set adds its own peace criteria after these.

A library: it has no `main` and registers no rules.
