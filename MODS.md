# TAOM mod list

Which mods work with TAOM in Coop (TAOM 2.0.29.5, Bannerlord v1.4.8, Coop v0.1.6). This page is made from
[compat/taom-mod-compat.json](compat/taom-mod-compat.json), the list the Coodsz TAOM tools show,
and is written again on its own whenever a player report is counted.

## What the statuses mean

The status is set by hand by Coodsz. Player reports never change it; they show in the Players column.

- **Works**: tested in Coop by Coodsz, a TAOM server with a player joining.
- **Everyone needs it**: works, but the host and every player need the same version.
- **Loads**: passed the automatic server load test of the TAOM server tool. Joining was not tested.
- **Reported working**: reported working in TAOM singleplayer, not tested in Coop yet.
- **Risky**: can work, but it changes campaign logic or battles, or is not tested with TAOM yet. The note says why.
- **Broken**: known to break TAOM or Coop. Leave it off.
- **Not checked yet**: players reported it, Coodsz has not checked it.

**Players** counts the players who reported it works or is broken. **Checked by Coodsz** is the day
Coodsz tested it himself.

## How to report a mod

Click **Report a mod** at the top of the Coodsz TAOM Client Launcher (or **Report** on the bar after a
game) and pick Works or Broken for each mod. No GitHub account is needed. A report counts here about a
day later.
With a GitHub account you can also use the [report form](https://github.com/Coodsz/Coodsz-TAOM/issues/new?template=mod-compat.yml).

| Mod | Status | Players | Checked by Coodsz | Note |
| --- | --- | --- | --- | --- |
| Banner Fix | Works |  | 2026-10-18 | Comes with the launcher. Banner looks only. |
| [Better Exception Window](https://steamcommunity.com/sharedfiles/filedetails/?id=2875478172) | Works |  | 2026-10-18 | Shows a readable crash window. It needs Harmony, which TAOM Dependencies already has. |
| [CC's Banners](https://steamcommunity.com/sharedfiles/filedetails/?id=2877445271) | Works |  | 2026-10-18 | Banner looks only. |
| [Dismemberment Plus](https://steamcommunity.com/sharedfiles/filedetails/?id=2875093027) | Works |  | 2026-10-18 | Battle looks only. TAOM Dependencies knows it brings its own libraries. |
| Immersive Battlefields | Works |  | 2026-10-18 | Comes with the launcher. Battle looks only. |
| Raise your Banner | Works |  | 2026-10-18 | Comes with the launcher. Load Banner Fix before it. |
| Raise your Torch | Works |  | 2026-10-18 | Comes with the launcher. Battle looks only. |
| [RTS Camera](https://steamcommunity.com/sharedfiles/filedetails/?id=3747725551) | Works |  | 2026-10-18 | Camera and battle orders. TAOM players found it works at the very bottom of the load order, after its Harmony link is removed, which the TAOM dependency fix does. One TAOM player saw an endless loading screen when going into battle with a wounded hero. |
| [RTS Camera Command System](https://steamcommunity.com/sharedfiles/filedetails/?id=3747771970) | Works |  | 2026-10-18 | Needs RTS Camera. Keep it at the very bottom, right after RTS Camera. |
| [Xorberax's Legacy](https://steamcommunity.com/sharedfiles/filedetails/?id=2875138158) | Works |  | 2026-10-18 | Client only. Its code crashes a dedicated server, so the server keeps it in the list with its code off. Needs the TAOM Xorberax patch from 2026-10-14 or newer; an older patch says TAOM differs from the inspected build and the cleave patch was not installed. The patch goes last, after Xorberax's Legacy. |
| [CoopModPatch](https://steamcommunity.com/sharedfiles/filedetails/?id=3786391685) | Everyone needs it |  | 2026-10-18 | The Coop adapter Improved Garrisons needs. It goes with Improved Garrisons, so drop both together if one makes trouble. |
| [CustomWeaponMod](https://www.nexusmods.com/mountandblade2bannerlord/mods/13773) | Everyone needs it |  | 2026-10-18 (server load test) | Item pack. Keep it after TAOM; above TAOM it needs many XML changes. The host and every player need the same version, and it can clash with TAOM items. Passed the automatic server load test on 2026-10-18 with version v1.3.0. Joining was not tested. |
| [GT_CarbonBody](https://www.nexusmods.com/mountandblade2bannerlord/mods/4757) | Everyone needs it |  |  | Item pack. Keep it after TAOM; above TAOM it needs many XML changes. The host and every player need the same version, and it can clash with TAOM items. |
| [Hyarti_weapons](https://www.nexusmods.com/mountandblade2bannerlord/mods/9663) | Everyone needs it |  |  | Item pack. Keep it after TAOM; above TAOM it needs many XML changes. The host and every player need the same version, and it can clash with TAOM items. |
| [Improved Garrisons](https://steamcommunity.com/sharedfiles/filedetails/?id=2859265386) | Everyone needs it |  | 2026-10-18 | Works in Coop with the CoopModPatch adapter, tested with its server build on TAOM plus. The host and every player need the same version. |
| MagnumOpus | Everyone needs it |  |  | Item pack. Keep it after TAOM; above TAOM it needs many XML changes. The host and every player need the same version, and it can clash with TAOM items. |
| Orsinium Forge | Everyone needs it |  |  | Item pack. Keep it after TAOM; above TAOM it needs many XML changes. The host and every player need the same version, and it can clash with TAOM items. |
| [People of Middle Earth](https://www.nexusmods.com/mountandblade2bannerlord/mods/13963) | Everyone needs it |  | 2026-10-18 (server load test) | Names on parties. The host and every player need it. Passed the automatic server load test on 2026-10-18 with version v0.2.2. Joining was not tested. |
| [Retinues](https://steamcommunity.com/sharedfiles/filedetails/?id=3599557394) | Everyone needs it |  | 2026-10-18 (server load test) | Needs the TAOM dependency fix, which the launcher applies. Keep it after TAOM. Clan colors still turn grey when joining a kingdom with the 8 October patch. The host and every player need the same version, and it can clash with TAOM items. Passed the automatic server load test on 2026-10-18 with version v1.4.14.32. Joining was not tested. |
| SlopForge | Everyone needs it |  |  | Item pack. Keep it after TAOM; above TAOM it needs many XML changes. The host and every player need the same version, and it can clash with TAOM items. |
| Wolves | Everyone needs it |  |  | Item pack. Keep it after TAOM; above TAOM it needs many XML changes. The host and every player need the same version, and it can clash with TAOM items. |
| [Better Smithing Continued](https://www.nexusmods.com/mountandblade2bannerlord/mods/4318) | Loads |  | 2026-10-18 (server load test) | Works with its latest version. Passed the automatic server load test on 2026-10-18 with version v1.4.5.0. Joining was not tested. |
| [Campaign Map Visibility](https://www.nexusmods.com/mountandblade2bannerlord/mods/13918) | Loads |  | 2026-10-18 (server load test) | Made by the TAOM developer. Shows what goes on across the campaign map when zoomed out. Passed the automatic server load test on 2026-10-18 with version v0.1.0. Joining was not tested. |
| [Creator Camera And Video Maker](https://www.nexusmods.com/mountandblade2bannerlord/mods/11410) | Loads |  | 2026-10-18 (server load test) | On a TAOM community list. Camera only. Passed the automatic server load test on 2026-10-18 with version v0.1.21.0. Joining was not tested. |
| [Player Voices](https://www.nexusmods.com/mountandblade2bannerlord/mods/13934) | Loads |  | 2026-10-18 (server load test) | Looks and sounds only. Should be fine. Passed the automatic server load test on 2026-10-18 with version v0.3.1. Joining was not tested. |
| [TAOM Blood Overhaul](https://www.nexusmods.com/mountandblade2bannerlord/mods/13982) | Loads |  | 2026-10-18 (server load test) | Looks only. Should be fine. Its zip has an extra Modules folder inside, so put the TAOM_BloodOverhaul folder straight in the game's Modules folder or the game does not see it. Passed the automatic server load test on 2026-10-18 with version v0.2.0.0. Joining was not tested. |
| [TAOM Xorberax Patch](https://www.nexusmods.com/mountandblade2bannerlord/mods/13207) | Loads |  | 2026-10-18 (server load test) | One of the TAOM Compatibility Patches. Needs Xorberax's Legacy and goes last, after it. Use the build from 2026-10-14 or newer. The host and every player need the same patches. Passed the automatic server load test on 2026-10-18 with version v0.1.1. Joining was not tested. |
| [Banner Editor](https://www.nexusmods.com/mountandblade2bannerlord/mods/4944) | Reported working |  |  | On a TAOM singleplayer list. Banner looks only. |
| Battle Voice | Reported working |  |  | On a TAOM singleplayer list. Sounds only. |
| [Dynamic Combat Camera](https://www.nexusmods.com/mountandblade2bannerlord/mods/11818) | Reported working |  |  | On a TAOM community list. Camera only. |
| HorseCounter | Reported working |  |  | On a TAOM community list. A screen counter only. |
| [Music of the Waning Age](https://www.nexusmods.com/mountandblade2bannerlord/mods/9990) | Reported working |  |  | Music only. Keep it below TAOM. Custom music has to be 44100 Hz. |
| New Slide - Additional Sliders | Reported working |  |  | On a TAOM singleplayer list. More character creation sliders. Not tested with Coop character creation. |
| [TAOM Dependency Patch](https://www.nexusmods.com/mountandblade2bannerlord/mods/13196) | Reported working |  |  | Works. Does the same job as the launcher's dependency fix. |
| [AgricultureEstate](https://steamcommunity.com/sharedfiles/filedetails/?id=2880158010) | Risky |  | 2026-10-18 (server load test) | Needed by PSCoopBridge. Not tested with TAOM yet. Passed the automatic server load test on 2026-10-18 with version v1.4.7.2. Joining was not tested. |
| [AI Kick N Bash](https://steamcommunity.com/sharedfiles/filedetails/?id=3716158730) | Risky |  | 2026-10-18 (server load test) | Changes battles. In Coop battles that can go out of step. Passed the automatic server load test on 2026-10-18 with version v1.0.0. Joining was not tested. |
| [Armies of Middle Earth](https://www.nexusmods.com/mountandblade2bannerlord/mods/13876) | Risky |  | 2026-10-18 (server load test) | Battle and campaign AI. Works on TAOM 2.0.29.5 after its DLL files are unblocked, which the launcher does. Its developer gives no guarantee with Coop. Use only one of Armies of Middle Earth, RBM and Warbandlord. Passed the automatic server load test on 2026-10-18 with version v10.0.0. Joining was not tested. |
| [Arrange Marriage for family](https://steamcommunity.com/sharedfiles/filedetails/?id=2880762493) | Risky |  | 2026-10-18 (server load test) | Needs Harmony. Test it on its own first. Passed the automatic server load test on 2026-10-18 with version v1.3.9.1. Joining was not tested. |
| [Azor Ahai](https://www.nexusmods.com/mountandblade2bannerlord/mods/12517) | Risky |  | 2026-10-18 (server load test) | Changes campaign logic. In Coop that can put players out of step. Passed the automatic server load test on 2026-10-18 with version v1.0.1. Joining was not tested. |
| [Bannerlord Cheats Reload](https://www.nexusmods.com/mountandblade2bannerlord/mods/6446) | Risky |  |  | On a TAOM singleplayer list, but one TAOM player says it stopped working after the TAOM 2.0.29.5 update. Use config.cheat_mode 1 instead. |
| [Battle Size Resized](https://www.nexusmods.com/mountandblade2bannerlord/mods/8177) | Risky |  | 2026-10-18 (server load test) | A TAOM player says it works with the TAOM Dependency Patch. Coop uses the server battle size instead. Passed the automatic server load test on 2026-10-18 with version v2.0.4. Joining was not tested. |
| Betrayal | Risky |  |  | Changes campaign logic. In Coop that can put players out of step. |
| [Castle Redux](https://www.nexusmods.com/mountandblade2bannerlord/mods/13132) | Risky |  | 2026-10-18 (server load test) | On a TAOM singleplayer list. Changes campaign logic. In Coop that can put players out of step. Passed the automatic server load test on 2026-10-18 with version v1.3.3. Joining was not tested. |
| [Charity](https://www.nexusmods.com/mountandblade2bannerlord/mods/12332) | Risky |  | 2026-10-18 (server load test) | Changes campaign logic. In Coop that can put players out of step. Passed the automatic server load test on 2026-10-18 with version v1.0.4. Joining was not tested. |
| [Cheat panel](https://www.nexusmods.com/mountandblade2bannerlord/mods/13608) | Risky |  | 2026-10-18 (server load test) | Teleport does not work, and it may stop kingdoms going to war. Use config.cheat_mode 1 instead. Passed the automatic server load test on 2026-10-18 with version v1.0.0.0. Joining was not tested. |
| [Cinematic Combat](https://www.nexusmods.com/mountandblade2bannerlord/mods/5819) | Risky |  |  | Reported broken with TAOM, but one player says it works fine. Test it on its own first. |
| Clan Honor | Risky |  |  | Changes campaign logic. In Coop that can put players out of step. |
| Clan Succession | Risky |  |  | Changes campaign logic. In Coop that can put players out of step. |
| [Create A Kingdom](https://www.nexusmods.com/mountandblade2bannerlord/mods/13856) | Risky |  | 2026-10-18 (server load test) | Work in progress. Only one castle can be made, troops leave settlements, and city projects stop. Passed the automatic server load test on 2026-10-18 with version v0.1.0. Joining was not tested. |
| [Custom Battle Reforged](https://www.nexusmods.com/mountandblade2bannerlord/mods/13989) | Risky |  |  | Custom battle only. Coop does not use it. |
| Draks Bandits | Risky |  |  | On a TAOM singleplayer list. Changes campaign logic. In Coop that can put players out of step. |
| Draks Battle Tweaks | Risky |  |  | On a TAOM singleplayer list. Changes battles. In Coop battles that can go out of step. |
| Draks Character Stuff | Risky |  |  | On a TAOM singleplayer list. Changes campaign logic. In Coop that can put players out of step. |
| Draks Crafting | Risky |  |  | On a TAOM singleplayer list. Changes campaign logic. In Coop that can put players out of step. |
| Dual Wield | Risky |  |  | Changes battles. In Coop battles that can go out of step. |
| Dual Wield - TAOM | Risky |  |  | On a TAOM singleplayer list. Needs Dual Wield. Changes battles. In Coop battles that can go out of step. |
| Enhanced Battle Ballista | Risky |  |  | Changes battles. In Coop battles that can go out of step. |
| [Fourberie](https://www.nexusmods.com/mountandblade2bannerlord/mods/2969) | Risky |  | 2026-10-18 (server load test) | The TAOM developer updated his Fourberie patch for TAOM 2.0.29.5. Changes battles. In Coop battles that can go out of step. Passed the automatic server load test on 2026-10-18 with version v1.4.8.3. Joining was not tested. |
| [Governors Handle Issues](https://steamcommunity.com/sharedfiles/filedetails/?id=3623885977) | Risky |  | 2026-10-18 (server load test) | Changes campaign logic. In Coop that can put players out of step. Passed the automatic server load test on 2026-10-18 with version v1.1.1.4. Joining was not tested. |
| [Limitless](https://www.nexusmods.com/mountandblade2bannerlord/mods/14025) | Risky |  | 2026-10-18 (server load test) | Removes unit limits. Needs the dependency fix and unblocked DLL files, which the launcher does. The limit per side is half the setting. Not for Coop, where the server battle size caps at 1000 anyway. Passed the automatic server load test on 2026-10-18 with version v1.0.0.1. Joining was not tested. |
| [LT_Nemesis](https://www.nexusmods.com/mountandblade2bannerlord/mods/5729) | Risky |  |  | Changes campaign logic. In Coop that can put players out of step. |
| [No Fall Damage](https://www.nexusmods.com/mountandblade2bannerlord/mods/13923) | Risky |  | 2026-10-18 (server load test) | Made by the TAOM developer. Takes away player fall damage. In Coop battles that can go out of step. Passed the automatic server load test on 2026-10-18 with version v0.1.0. Joining was not tested. |
| Noble Intrigues | Risky |  |  | Changes campaign logic. In Coop that can put players out of step. |
| [Organized Frontlines](https://www.nexusmods.com/mountandblade2bannerlord/mods/9058) | Risky |  |  | Smarter infantry lines. TAOM players use it with Warbandlord. Changes battles. In Coop battles that can go out of step. |
| [Party AI Controls Reforged](https://steamcommunity.com/sharedfiles/filedetails/?id=3732334365) | Risky |  | 2026-10-18 (server load test) | Shows a dependency conflict with TAOM until its Harmony and library links are removed and its DLL files are unblocked. The launcher does both. Test it on its own first. Passed the automatic server load test on 2026-10-18 with version v1.5.9.0. Joining was not tested. |
| [Perfect Fire Arrows](https://www.nexusmods.com/mountandblade2bannerlord/mods/3303) | Risky |  | 2026-10-18 (server load test) | Comes with the launcher. Changes battles. In the Coodsz stable setups. Passed the automatic server load test on 2026-10-18 with version v6.8.1. Joining was not tested. |
| [Performance Optimizer](https://steamcommunity.com/sharedfiles/filedetails/?id=3719370392) | Risky |  | 2026-10-18 (server load test) | Needs Harmony and MCM. Test it on its own first. Passed the automatic server load test on 2026-10-18 with version v1.6.0. Joining was not tested. |
| Plantation Estates | Risky |  |  | On a TAOM singleplayer list. Changes campaign logic. In Coop that can put players out of step. |
| [Player Jump Higher](https://www.nexusmods.com/mountandblade2bannerlord/mods/13921) | Risky |  | 2026-10-18 (server load test) | Made by the TAOM developer. Changes how high the player jumps in battles and scenes. In Coop battles that can go out of step. Passed the automatic server load test on 2026-10-18 with version v0.1.0. Joining was not tested. |
| [Player Settlement](https://steamcommunity.com/sharedfiles/filedetails/?id=3720376888) | Risky |  | 2026-10-18 (server load test) | Works in Coop with PSCoopBridge and AgricultureEstate. Not tested with TAOM yet. Passed the automatic server load test on 2026-10-18 with version v7.5.0. Joining was not tested. |
| Player Settlement: TAOM | Risky |  |  | On a TAOM singleplayer list. The TAOM version of Player Settlement. Coop needs PSCoopBridge with Player Settlement, which is not tested with TAOM yet. |
| [Player Speed Control](https://www.nexusmods.com/mountandblade2bannerlord/mods/13919) | Risky |  | 2026-10-18 (server load test) | Made by the TAOM developer. Faster map travel and running. In Coop the server sets the campaign speed, so players can go out of step. Passed the automatic server load test on 2026-10-18 with version v0.1.0. Joining was not tested. |
| Prisoner Recruit and Butcher | Risky |  |  | Changes campaign logic. In Coop that can put players out of step. |
| PSCoopBridge | Risky |  | 2026-10-18 (server load test) | Comes with the launcher. Needs Coop, Player Settlement and AgricultureEstate. Not tested with TAOM yet. Passed the automatic server load test on 2026-10-18 with version v0.17.6. Joining was not tested. |
| [Realistic Battle Mod](https://steamcommunity.com/sharedfiles/filedetails/?id=2859251492) | Risky |  | 2026-10-18 (server load test) | The AI module is fine; the combat module is not recommended (horses too strong, the TAOM RBM patch took bows from Rohan and Gondor archers, prices go up). Warbandlord, Stamina or Organized Frontlines are better picks. Use only one of Armies of Middle Earth, RBM and Warbandlord. Passed the automatic server load test on 2026-10-18 with version v4.5.4. Joining was not tested. |
| [Respec Player](https://steamcommunity.com/sharedfiles/filedetails/?id=3685787107) | Risky |  | 2026-10-18 (server load test) | Test it on its own first. Passed the automatic server load test on 2026-10-18 with version v1.0.0.1. Joining was not tested. |
| Sauron's Will | Risky |  |  | Changes campaign logic. In Coop that can put players out of step. |
| [Shield Taunts and Battle Cries](https://www.nexusmods.com/mountandblade2bannerlord/mods/9948) | Risky |  | 2026-10-18 (server load test) | Mixed reports. Test it on its own first. Passed the automatic server load test on 2026-10-18 with version v0.0.1. Joining was not tested. |
| Skynet | Risky |  |  | Changes campaign logic. In Coop that can put players out of step. |
| Smart Cavalry AI | Risky |  |  | Not needed. TAOM's own mod options already have Smart Cavalry AI. |
| [Stamina](https://www.nexusmods.com/mountandblade2bannerlord/mods/7933) | Risky |  | 2026-10-18 (server load test) | Ulfkarl's stamina system. TAOM players use it with Warbandlord. Changes battles. In Coop battles that can go out of step. Passed the automatic server load test on 2026-10-18 with version v1.5.9. Joining was not tested. |
| TAOM AI Frontier - Immersion | Risky |  |  | On a TAOM singleplayer list. Changes campaign AI. In Coop that can put players out of step. |
| [TAOM AI Influence Patch](https://www.nexusmods.com/mountandblade2bannerlord/mods/13207) | Risky |  | 2026-10-18 (server load test) | One of the TAOM Compatibility Patches. Needs AI Influence. Changes campaign logic. In Coop that can put players out of step. The host and every player need the same patches. Passed the automatic server load test on 2026-10-18 with version v0.1.1. Joining was not tested. |
| [TAOM Diplomacy Patch](https://www.nexusmods.com/mountandblade2bannerlord/mods/13207) | Risky |  | 2026-10-18 (server load test) | One of the TAOM Compatibility Patches. Needs Diplomacy (Bannerlord.Diplomacy), which TAOM players report broken with TAOM because the game keeps loading forever. The host and every player need the same patches. Passed the automatic server load test on 2026-10-18 with version v1.0.4. Joining was not tested. |
| [TAOM Fourberie Patch](https://www.nexusmods.com/mountandblade2bannerlord/mods/13207) | Risky |  | 2026-10-18 (server load test) | One of the TAOM Compatibility Patches. Needs Fourberie. Changes battles. In Coop battles that can go out of step. The host and every player need the same patches. Passed the automatic server load test on 2026-10-18 with version v1.0.3. Joining was not tested. |
| [TAOM RBM Patch](https://www.nexusmods.com/mountandblade2bannerlord/mods/13207) | Risky |  | 2026-10-18 (server load test) | One of the TAOM Compatibility Patches. The TAOM developer updated it for 2.0.29.5 and says it still needs balancing. Needs Realistic Battle Mod (RBM). The host and every player need the same patches. Passed the automatic server load test on 2026-10-18 with version v1.0.8. Joining was not tested. |
| [TAOM Tournaments Patch](https://www.nexusmods.com/mountandblade2bannerlord/mods/13207) | Risky |  | 2026-10-18 (server load test) | One of the TAOM Compatibility Patches. Needs the Tournaments mod it patches. Its SubModule.xml names only TAOM, so check that the Tournaments mod is on the setup too. The host and every player need the same patches. Passed the automatic server load test on 2026-10-18 with version v1.0.2. Joining was not tested. |
| [TAOM Troop limit expander](https://www.nexusmods.com/mountandblade2bannerlord/mods/10253) | Risky |  | 2026-10-18 (server load test) | Made for TAOM. The TAOM developer says it raises custom battles up to 40000 troops. Not for Coop, where the server battle size caps at 1000. Passed the automatic server load test on 2026-10-18 with version v2.2.13. Joining was not tested. |
| TOAM Food Debuff | Risky |  |  | On a TAOM singleplayer list. Changes campaign logic. In Coop that can put players out of step. |
| [Universal Food](https://www.nexusmods.com/mountandblade2bannerlord/mods/12563) | Risky |  | 2026-10-18 (server load test) | Changes campaign logic. In Coop that can put players out of step. Passed the automatic server load test on 2026-10-18 with version v1.5.0. Joining was not tested. |
| Unlimited Companions | Risky |  |  | Changes campaign logic. In Coop that can put players out of step. |
| [Warbandlord](https://steamcommunity.com/sharedfiles/filedetails/?id=2882370524) | Risky |  | 2026-10-18 (server load test) | TAOM players use it instead of the RBM combat module. Load order Stamina, Organized Frontlines, Warbandlord, then TAOM. Changes battles. In Coop battles that can go out of step. Use only one of Armies of Middle Earth, RBM and Warbandlord. Passed the automatic server load test on 2026-10-18 with version v1.4.0.2. Joining was not tested. |
| [Artem's Lively Animations](https://www.nexusmods.com/mountandblade2bannerlord/mods/5059) | Broken |  |  | Crashes TAOM while it loads. |
| [Diplomacy](https://steamcommunity.com/sharedfiles/filedetails/?id=2881380744) | Broken |  |  | Known broken with TAOM. The game keeps loading forever. The TAOM Diplomacy patch refuses TAOM 2.0.29.5. |
| [Frontline Mod](https://www.nexusmods.com/mountandblade2bannerlord/mods/9058) | Broken |  |  | Damages TAOM files. |
| [Reinforcement System](https://www.nexusmods.com/mountandblade2bannerlord/mods/6501) | Broken |  |  | Known broken with TAOM. |
| Titular Governor | Not checked yet | 1 works, 0 broken |  |  |

97 mods. List updated 2026-10-18.
