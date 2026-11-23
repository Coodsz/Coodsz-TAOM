# TAOM.CoopCompat for Bannerlord 1.5.7

This is the TAOM Coop compatibility module for the new stack: Bannerlord **v1.5.7**, TAOM **v2.0.42**
and BannerlordCoop **v0.1.8**. It does not work on Bannerlord 1.4.8, TAOM 2.0.29.5 or Coop 0.1.6. For
that stack, keep using Sternab's TAOM.CoopCompat 0.3.25.

The TAOM team wrote this version. It follows the approach of Sternab's module, with his permission.

## What it does

- **Build and settings check at join.** When a player joins a Coop campaign, their game sends the
  server its TAOM build and a fingerprint of the TAOM settings that change the campaign. The server
  compares them with its own and answers. If the build is different, or some settings groups are
  different, the player gets a message on screen. It never kicks anyone.
- **Load order warning.** Coop's join check compares module lists but not their order. The hello also
  carries the player's module order, and a player whose data mods load in another order than the
  host's gets a warning. The host can switch it off (TAOM settings, Co-op group).
- **War of the Ring sync.** The server sends its War of the Ring momentum to every player: when they
  join, at most once a minute after it changes, and once every in-game day.
- **Guest trade.** A guest can buy from TAOM's Elite Emissary and use a town armoury. The guest's
  screen asks the server, and the server runs TAOM's own purchase or upgrade for the guest's hero. The
  same channel carries the lord's gear ladder for co-op players.
- **Career sync.** A player's career choices go to the server, which checks them, keeps them in its
  save and passes them on to the other players. The host can switch it off.
- **TAOM fief elections.** The module registers TAOM's fief election with Coop, so players vote on it
  instead of the host's AI deciding it.
- **Long Defeat co-op sessions** (needs a Coop with the session API).

Every message the server sends a player carries a token that only that player and the server know, so
another player in the same battle cannot fake one (protocol version 2, from TAOM v2.0.42).

The module starts at the first campaign start. If Coop is not usable then, it writes one line to the
TAOM log and does nothing more in that game session.

## What it needs

- The same TAOM version, and the same version of this module, on every player and on the server.
  Coop's join check compares module versions. This module's version always equals TAOM's (v2.0.42
  now), so one number covers the release.
- It depends on TAOM and Coop, so the launcher sorts it after both:
  `... TAOM, TAOM_Map, LOTRLOME_Armory, Coop, TAOM.CoopCompat`. On the dedicated server its place
  against `DedicatedServer.Windows` does not matter.
- It loads on players' games and on the dedicated server.
- No Coop file ships with it. Players get Coop from Coop's own release.

## Two DLLs

The module builds two DLLs, and a package needs both in each of its `bin` folders:

- `TAOM.CoopCompat.dll`: the entry point and the services. `SubModule.xml` names only this one.
- `TAOM.CoopCompat.Coop.dll`: every type that needs a Coop DLL to load (the Coop binding and the
  network messages), from `CoopCompat/Coop/`.

The game scans every type of each DLL that `SubModule.xml` names before any module starts, and Coop's
own DLLs are not loaded yet at that point. A type that needs Coop in the named DLL stops the game, so
those types live in the second DLL, which loads later from the same folder. `TypeScanGateTests`
fails if one moves back.

## Same id as 0.3.25

This module and Sternab's 0.3.25 both use the id and folder `TAOM.CoopCompat`. The tools pick the
build by game version (0.3.25 for 1.4.8, this one for 1.5.x), and since tools v1.2.16 they never put
0.3.25 over this module.

## Where the source lives

This folder mirrors the module in the TAOM repo (`github.com/haterade22/TAOM`):

| Here | In the TAOM repo |
|---|---|
| `TAOM.CoopCompat/CoopCompat/` | `CoopCompat/` |
| `TAOM.CoopCompat/TAOM.CoopCompat.Tests/` | `TAOM.CoopCompat.Tests/` |

The files are the same as at the TAOM commit named in the pull request. TAOM's side of each feature
(the War of the Ring store, the settings pages, guest trade, career sync) ships in `TAOM.dll`.

## Building it

The project builds inside a TAOM checkout only. It references TAOM's `Main/TAOM.csproj`, and it reads
the game paths from TAOM's `Directory.Build.props`. It compiles against the Coop DLLs in
`Modules\Coop\bin\Win64_Shipping_Client` (set `CoopBinDir` to use another folder). Without Coop
there, it skips the build with one message.

From a TAOM checkout:

```
dotnet build CoopCompat/TAOM.CoopCompat.csproj -p:DisableModuleCopy=true -p:ModuleId=
dotnet test TAOM.CoopCompat.Tests -p:DisableModuleCopy=true -p:ModuleId=
```

## Checking it in game

The module writes these lines to the TAOM log, on the server and on each player:

- `[Check] id=taom.coopcompat.settings.server result=pass verdict=match ...`
- `[Check] id=taom.coopcompat.settings.client result=pass ...` (a `fail` means a build mismatch)
- `[Check] id=taom.coopcompat.momentum.server result=pass ...`
- `[Check] id=taom.coopcompat.momentum.client result=pass ...`
- `[Check] id=taom.coopcompat.fief-election.registered result=pass ... type=TaomSettlementClaimantDecision`

Guest trade and career sync write `[GuestTrade]` and `[CareerSync]` lines on the server.
