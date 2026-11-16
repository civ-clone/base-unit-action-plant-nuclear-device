"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plantNuclearDeviceCriteria = void 0;
const Action_1 = require("@civ-clone/core-unit/Rules/Action");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
/**
 * The criteria for planting a nuclear device in the city on `to`, in order: a neighbouring tile, moves left, a city of
 * another player on `to`, and `canPlant(unit, city)` (Civ2: a Spy, whose player knows Rocketry and
 * Nuclear Fission, once the Manhattan Project has been built anywhere). A rule set adds its own peace criteria after these.
 */
const plantNuclearDeviceCriteria = ({ cityRegistry }, canPlant) => [
    Action_1.isNeighbouringTile,
    Action_1.hasMovesLeft,
    new Criterion_1.default((unit, to) => {
        const city = cityRegistry.getByTile(to);
        return city !== null && city.player() !== unit.player();
    }),
    new Criterion_1.default((unit, to) => canPlant(unit, cityRegistry.getByTile(to))),
];
exports.plantNuclearDeviceCriteria = plantNuclearDeviceCriteria;
exports.default = exports.plantNuclearDeviceCriteria;
//# sourceMappingURL=criteria.js.map