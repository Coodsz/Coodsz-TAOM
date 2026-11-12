# TAOM.CoopCompat for Bannerlord 1.5.7

This is the TAOM Coop compatibility module for the new stack: Bannerlord **v1.5.7**, TAOM **v2.0.38**
and BannerlordCoop **1.5.x**. It does not work on Bannerlord 1.4.8, TAOM 2.0.29.5 or Coop 0.1.6. For
that stack, keep using Sternab's TAOM.CoopCompat 0.3.25.

The TAOM team wrote this version. It follows the approach of Sternab's module, with his permission.

## What it does

- **Build and settings check at join.** When a player joins a Coop campaign, their game sends the
  server its TAOM build and a fingerprint of the TAOM settings that change the campaign. The server
  compares them with its own and answers. If the build is different, or some settings groups are
  different, the player gets a message on screen. It never kicks anyone.
- **War of the Ring sync.** The server sends its War of the Ring momentum to every player: when they
  join, at most once a minute after it changes, and once every in-game day. Without this, a player's
  War of the Ring screen stays at the value from the save they joined on.

If Coop is not loaded, the module writes one line to the TAOM log and does nothing.

## What it needs

- The same TAOM version on every player and on the server. The module's version is always TAOM's
  version (v2.0.38 now), because Coop's join check compares module versions exactly.
- Coop loads before it. Load order: `... TAOM, TAOM_Map, LOTRLOME_Armory, Coop, TAOM.CoopCompat`.
- It loads on players' games and on the dedicated server (its submodule has no tags).
- No Coop file ships with it. The player gets Coop from Coop's own release.

## Same id as 0.3.25

This module and Sternab's 0.3.25 both use the id and folder `TAOM.CoopCompat`. If a tool installs
0.3.25 into a 1.5.x game, it replaces this module, and Coop's join check then refuses that player
because the version is wrong. The tools must pick the build by game version: 0.3.25 for 1.4.8, this
one for 1.5.x.

## Where the source lives

This folder mirrors the module in the TAOM repo (`github.com/haterade22/TAOM`):

| Here | In the TAOM repo |
|---|---|
| `TAOM.CoopCompat/CoopCompat/` | `CoopCompat/` |
| `TAOM.CoopCompat/TAOM.CoopCompat.Tests/` | `TAOM.CoopCompat.Tests/` |

The files are the same. A change made on either side gets copied to the other.
The TAOM side also changed `TAOM.dll` for this module: the War of the Ring store gained
`CaptureWarState` and `ApplyWarState`, and `TaomSettingsPages` lists the settings the fingerprint
reads. Those parts ship in TAOM itself.

## Building it

Today the project builds inside a TAOM checkout only. It references TAOM's `Main/TAOM.csproj`, and it
reads the game paths from TAOM's `Directory.Build.props`. It compiles against the Coop DLLs in
`Modules\Coop\bin\Win64_Shipping_Client` (set `CoopBinDir` to use another folder). Without Coop
there, it skips the build with one message.

From a TAOM checkout:

```
dotnet build CoopCompat/TAOM.CoopCompat.csproj -p:DisableModuleCopy=true -p:ModuleId=
dotnet test TAOM.CoopCompat.Tests -p:DisableModuleCopy=true -p:ModuleId=
```

A build that works from this repo alone (against an installed TAOM.dll) is still to do.

## Checking it in game

The module writes these lines to the TAOM log, on the server and on each player:

- `[Check] id=taom.coopcompat.settings.server result=pass verdict=match ...`
- `[Check] id=taom.coopcompat.settings.client result=pass ...` (a `fail` means a build mismatch)
- `[Check] id=taom.coopcompat.momentum.server result=pass sequence=... entries=...`
- `[Check] id=taom.coopcompat.momentum.client result=pass sequence=... entries=...`

## Status

- The unit tests pass (84 of 84).
- Not run in a real Coop session yet. The first boot on a client and on a dedicated server, and a
  join, are still owed.
- The zip names and where the built zips go are to agree with Coodsz.
