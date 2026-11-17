import City from '@civ-clone/core-city/City';
import type PlantNuclearDevice from '../PlantNuclearDevice';
import Rule from '@civ-clone/core-rule/Rule';
import Unit from '@civ-clone/core-unit/Unit';

/**
 * Processed after a Spy's (`Unit`'s) nuclear device has gone off in `City`, by the `PlantNuclearDevice` action: what
 * follows is the rule set's (Civ2: unless the Spy's player is Fundamentalist, the other civilizations may find out, and
 * declare war).
 */
export class DevicePlanted extends Rule<
  [Unit, City, PlantNuclearDevice],
  void
> {}

export default DevicePlanted;
