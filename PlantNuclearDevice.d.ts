import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Action from '@civ-clone/core-unit/Action';
import City from '@civ-clone/core-city/City';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
/**
 * A Spy sets off a nuclear device in `city()`.
 *
 * `perform()`, in order:
 * 1. the Spy must survive a caught check (base-unit-agent's `AgentSurvives` with `CAUGHT_CHECK`; Civ2 makes three,
 *    and one more for a city with a Palace, all in its one answer), after `MissionMode`: one that is caught goes to
 *    `AgentLost` and is destroyed by the city's owner, and nothing goes off;
 * 2. the device detonates over the city's square: the rule set's `Detonated` rules run
 *    (base-unit-action-nuclear-attack's, which a missile's detonation runs too), with this action in place of a
 *    `NuclearAttack`;
 * 3. the `DevicePlanted` rules, for what follows (Civ2: whether the other civilizations find out);
 * 4. for a Spy the blast didn't destroy, `Moved`, then it is used up (`AgentLost`, then destroyed) unless it survives
 *    `AgentSurvives` with the resolved mode (with no rules, it is used up).
 *
 * It isn't a `NuclearAttack`, so nothing that checks for one (a war it forces, say) treats this as one. But every
 * `Detonated` rule runs for it, and a rule that reads no action, such as the vendetta rule a rule set registers from
 * base-diplomacy, applies to a planted device as to a missile: a Civ2 rule that should tell them apart must check
 * `action instanceof NuclearAttack`.
 */
export declare class PlantNuclearDevice extends Action {
  protected _city: City;
  constructor(
    from: Tile,
    to: Tile,
    unit: Unit,
    city: City,
    ruleRegistry?: RuleRegistry
  );
  city(): City;
  forUnit(unit: Unit): Action;
  perform(): void;
}
export default PlantNuclearDevice;
