# Third party notices

The Coodsz tools include code from the projects below. Each one keeps its own
license. This file ships in every release zip.

## CoopKeep

- Project: https://github.com/Aderimo/bannerlord-coopkeep
- Copyright (c) 2026 aderimo
- License: MIT

Parts of CoopKeep were ported into the Coodsz tools and changed to fit them. Every
ported file keeps the copyright line and the license notice in its header. The ported
parts are:

- `src/BannerlordCoopLauncher.Core/Server/`: the `@DS@` event parser (DsEvent,
  DsEventParser), the server phases (ServerPhase), the exit codes (ServerExit), the
  restart after a crash rules (CrashRestartPolicy), the known console lines
  (KnownLogLines), the server console allow list (ServerCommand), the SteamID64
  check with the ban list written through a temporary file (SteamBanFile), the clamped
  coop.debug command builders (AdminCommand) and the CPU and memory of the server
  process tree (ServerResourceMonitor).
- `src/BannerlordCoopLauncher.Core/Saves/`: the automatic save backups (BackupService)
  and the save name check (SaveSet).
- `src/BannerlordCoopLauncher.Core/Configuration/`: the in place JSONC editor (JsoncEditor), the
  mod-config.json settings list (ModSettingsCatalog), the mod-config.json store (ModConfigStore)
  and the settings kept per campaign save (WorldProfileStore).
- `src/BannerlordCoopLauncher.Core/Modules/ModCompatDatabase.cs`: the community mod list reader. The
  list itself (`compat-list/mods.json`) was seeded from CoopKeep's `compat/mods.json`, and the issue
  form, the tally script and its workflow in `.github/` were adapted from CoopKeep's.
- `src/BannerlordCoopLauncher.Core/Keep/`: the coodsz.* command builders (ToolsCommand), the server
  tools answer reader (ToolsParser), the item categories, search and sort (ItemCatalog), the skill
  sheet layout (SkillLayout), the save .json player list (KeepRoster), the admin log (AuditLog) and
  the Encyclopedia sections, entries, facts and links (Encyclopedia), after CoopKeep's encyclopedia,
  and the live map's layers, names by zoom, party activity and kingdom labels (LiveMap), after
  CoopKeep's map page.
- `compat/CoodszServerTools/`: the Coodsz Server Tools module (DedicatedServer.CoodszTools), whose
  command registration, item commands, hero development, equipment and roster commands come from
  CoopKeep's `src/CoopKeep.ServerTools`; its world command follows CoopKeep's encyclopedia sections
  and its map command CoopKeep's party and owner commands.
- `compat/CoodszImageExporter/`: the Coodsz Image Exporter game module (Build pictures), from
  CoopKeep's `src/CoopKeep.ImageExporter` (the thumbnail export, the PNG writer and the red/blue fix).
- The matching tests in `tests/BannerlordCoopLauncher.Tests/`.

```
MIT License

Copyright (c) 2026 aderimo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

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
