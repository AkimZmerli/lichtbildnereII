import * as migration_20251013_184049_initial from './20251013_184049_initial';

export const migrations = [
  {
    up: migration_20251013_184049_initial.up,
    down: migration_20251013_184049_initial.down,
    name: '20251013_184049_initial'
  },
];
