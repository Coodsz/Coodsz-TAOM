# Third party notices

The Coodsz tools include code from the projects below. Each one keeps its own
license. This file ships in every release zip.

## ModderLords

- Project: https://github.com/PlueRyvius/ModderLords
- Copyright: PlueRyvius (Ryvius, @PlueRyvius)
- License: PolyForm Noncommercial License 1.0.0,
  https://polyformproject.org/licenses/noncommercial/1.0.0

Ryvius gave permission for his settings sync and server rules code to be reused in the Coodsz tools. Parts of it
were adapted to fit them, and every file that reuses it says so in its header. The adapted parts
are:

- `compat/CoodszSettingsSync/`: the settings sync the server module (DedicatedServer.CoodszTools)
  and the client add on (DedicatedServer.CoodszJoinPassword) load. The MCM reflection and the
  capture and apply of values (McmSettings), the value text (SettingsWire), the request and snapshot
  messages (SettingsSyncMessages), the Coop probe and the loader (CoopProbe), the server and client
  handlers (ServerSync, ClientSync), the live settings folder with host overrides (LiveChannel) and
  the reading of the players keep their own list (SettingsFiles) follow his ModderLords.CompatSync
  and ModderLords.CompatSync.Coop. The players keep their own settings list is his recipes.json
  `PlayersOwnSettings`, in his file shape.
- `src/CoodszHost/Services/ModSettingsLive.cs`, `McmKeepOwn.cs` and `MainWindow.ModSettings.cs`: the
  Mod settings area, after his live settings client, host overrides store and Mod settings tab.
- The matching tests in `tests/BannerlordCoopLauncher.Tests/SettingsSyncTests.cs`.
- `compat/CoodszServerTools/src/ServerRules.cs` and `ServerRulesRules.cs`: the offline XP freeze
  (a HeroDeveloper.AddSkillXp prefix for the heroes of offline players, the offline set rebuilt from
  Coop's player manager, and the pass for host edits) follows his OfflineFreeze in
  ModderLords.CompatSync.Coop. His gold prefix is not used.
- `compat/CoodszServerTools/src/KingdomProtection.cs` and the kingdom protection rule in
  `ServerRulesRules.cs`: the Always choice of player kingdom protection (a ConsiderWar prefix and a
  GetRandomWarDecision postfix on KingdomDecisionProposalBehavior, and the player kingdoms rebuilt from
  Coop's player manager) follows his PlayerKingdomProtection in ModderLords.CompatSync.Coop. His peace
  backstop is not used. The matching tests are in `tests/BannerlordCoopLauncher.Tests/ServerRulesTests.cs`.

He also gave permission to use his compat record format and his curated compatibility data, with
credit:

- Data source: the tools download his curated `src/ModderLords.Core/compat-db.json`
  (https://raw.githubusercontent.com/PlueRyvius/ModderLords/main/src/ModderLords.Core/compat-db.json)
  and show its verdicts on the Mods pages, marked "From ModderLords by Ryvius". Coodsz Host stages
  its `DefaultSettings` as host defaults. The reader is `src/BannerlordCoopLauncher.Core/Modules/CompatRecords.cs`.
- Format: `.github/scripts/compat-records.mjs` writes the Coodsz community results in his compat
  record format (`compat-list/compat-records.json`), and `.github/scripts/compat-record.schema.json`
  is a copy of his `docs/compat-record.schema.json`, used by `compat-records.test.mjs`.

Nothing was taken from his TAOM folder.

```
Required Notice: Copyright PlueRyvius (https://github.com/PlueRyvius/ModderLords)
```
