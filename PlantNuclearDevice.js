"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlantNuclearDevice = void 0;
const escape_1 = require("@civ-clone/base-unit-agent/lib/escape");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Action_1 = require("@civ-clone/core-unit/Action");
const DevicePlanted_1 = require("./Rules/DevicePlanted");
const Detonated_1 = require("@civ-clone/base-unit-action-nuclear-attack/Rules/Detonated");
const Moved_1 = require("@civ-clone/core-unit/Rules/Moved");
const mission_1 = require("@civ-clone/base-unit-agent/lib/mission");
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
class PlantNuclearDevice extends Action_1.default {
    constructor(from, to, unit, city, ruleRegistry = RuleRegistry_1.instance) {
        super(from, to, unit, ruleRegistry);
        this._city = city;
    }
    city() {
        return this._city;
    }
    // `Action.forUnit` rebuilds an action from `(from, to, unit, ruleRegistry)`, which would put the `RuleRegistry` where
    // the `City` goes.
    // Typed as `Action`: a subclass with a member of its own isn't assignable to it (civ-clone/web-renderer#21).
    forUnit(unit) {
        return new PlantNuclearDevice(this.from(), this.to(), unit, this._city, this.ruleRegistry());
    }
    perform() {
        const unit = this.unit(), mission = this, ruleRegistry = this.ruleRegistry();
        if (!(0, mission_1.agentSurvives)(unit, mission, escape_1.CAUGHT_CHECK, ruleRegistry)) {
            ruleRegistry.process(Moved_1.default, unit, mission);
            unit.destroy();
            return;
        }
        // `Detonated` is typed for a missile's `NuclearAttack`; its rules read the unit and the square, and may tell the
        //  two apart by the action.
        ruleRegistry.process(Detonated_1.default, unit, this._city.tile(), this);
        ruleRegistry.process(DevicePlanted_1.default, unit, this._city, this);
        ruleRegistry.process(Moved_1.default, unit, mission);
        if (!unit.destroyed() &&
            !(0, mission_1.agentSurvives)(unit, mission, escape_1.ORDINARY, ruleRegistry)) {
            unit.destroy();
        }
    }
}
exports.PlantNuclearDevice = PlantNuclearDevice;
exports.default = PlantNuclearDevice;
//# sourceMappingURL=PlantNuclearDevice.js.map