import { CAUGHT_CHECK, ORDINARY } from '@civ-clone/base-unit-agent/lib/escape';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Action from '@civ-clone/core-unit/Action';
import City from '@civ-clone/core-city/City';
import DevicePlanted from './Rules/DevicePlanted';
import Detonated from '@civ-clone/base-unit-action-nuclear-attack/Rules/Detonated';
import Moved from '@civ-clone/core-unit/Rules/Moved';
import NuclearAttack from '@civ-clone/base-unit-action-nuclear-attack/NuclearAttack';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import { agentSurvives } from '@civ-clone/base-unit-agent/lib/mission';

/**
 * A Spy sets off a nuclear device in `city()`.
 *
 * `perform()`, in order:
 * 1. the Spy must survive a caught check (base-unit-agent's `AgentSurvives` with `CAUGHT_CHECK`; Civ2 makes three,
 *    and one more for a city with a Palace, all in its one answer), or it is destroyed and nothing goes off;
 * 2. the device detonates over the city's square: the rule set's `Detonated` rules run
 *    (base-unit-action-nuclear-attack's, which a missile's detonation runs too), with this action in place of a
 *    `NuclearAttack`;
 * 3. the `DevicePlanted` rules, for what follows (Civ2: whether the other civilizations find out);
 * 4. `Moved`, then a Spy the blast didn't destroy is used up unless it survives an `ORDINARY` check (with no
 *    `AgentSurvives` rules, it is used up).
 *
 * It isn't a `NuclearAttack`, so nothing that treats a missile strike as one (a war it forces, say) treats this as one.
 */
export class PlantNuclearDevice extends Action {
  protected _city: City;

  constructor(
    from: Tile,
    to: Tile,
    unit: Unit,
    city: City,
    ruleRegistry: RuleRegistry = ruleRegistryInstance
  ) {
    super(from, to, unit, ruleRegistry);

    this._city = city;
  }

  city(): City {
    return this._city;
  }

  // `Action.forUnit` rebuilds an action from `(from, to, unit, ruleRegistry)`, which would put the `RuleRegistry` where
  // the `City` goes.
  // Typed as `Action`: a subclass with a member of its own isn't assignable to it (civ-clone/web-renderer#21).
  forUnit(unit: Unit): Action {
    return new PlantNuclearDevice(
      this.from(),
      this.to(),
      unit,
      this._city,
      this.ruleRegistry()
    ) as unknown as Action;
  }

  perform(): void {
    const unit = this.unit(),
      mission = this as unknown as Action,
      ruleRegistry = this.ruleRegistry();

    if (!agentSurvives(unit, mission, CAUGHT_CHECK, ruleRegistry)) {
      ruleRegistry.process(Moved, unit, mission);

      unit.destroy();

      return;
    }

    // `Detonated` is typed for a missile's `NuclearAttack`; its rules read the unit and the square, and may tell the
    //  two apart by the action.
    ruleRegistry.process(
      Detonated,
      unit,
      this._city.tile(),
      this as unknown as NuclearAttack
    );

    ruleRegistry.process(DevicePlanted, unit, this._city, this);

    ruleRegistry.process(Moved, unit, mission);

    if (
      !unit.destroyed() &&
      !agentSurvives(unit, mission, ORDINARY, ruleRegistry)
    ) {
      unit.destroy();
    }
  }
}

export default PlantNuclearDevice;
