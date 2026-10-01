Paste each part as its own Discord message. A line that starts with # is a big heading.

# I made these tools with the help of the community and other sources for ease of access. I am not affiliated with the TAOM team in any way. They are here so hosting and playing with friends is easier.

Coodsz Coop and Friends players: see PART 4.

PART 1 — players

# Coodsz TAOM

You need Bannerlord **1.4.8** on Steam.

Same set for everyone: TAOM **2.0.27**, TAOM_Map **2.0.27**, TAOM.Dependencies **2.0.26**, LOTRLOME_Armory **2.0.26**, Workshop Coop **0.1.5**, TAOM.CoopCompat **0.3.17**. The latest TAOM update does not work yet.

.NET 8 Desktop Runtime, x64:
https://dotnet.microsoft.com/download/dotnet/8.0

# Download
https://github.com/Coodsz/Coodsz-TAOM/releases/latest

1. Download **Coodsz TAOM Client Launcher**. Unzip it before you open it.
2. Download `TAOM-Coop-v0.3.17-CompatOnly-CLIENT-PLAYTEST-36ae2c5a-d8a2ad02-r1.zip`. Leave it zipped. Every player needs it. **Install TAOM** finds it anywhere on this PC, including the Desktop.
3. The host also downloads `TAOM-Coop-v0.3.17-CompatOnly-HOST-OPERATOR-36ae2c5a-d8a2ad02-r1.zip`. Leave that zipped. **Prepare server** finds it anywhere on this PC, including the Desktop.
4. In Steam, subscribe to Workshop Coop `3770450698` and wait for Coop **0.1.5**.
5. Download TAOM **2.0.27** and leave that zip anywhere on this PC:
https://www.moddb.com/mods/tales-from-the-age-of-men/downloads/taom-public-release-september-26-2027

# If Windows warns you

If SmartScreen says "Unknown publisher", choose **More info**, then **Run anyway**. If Defender says virus, delete it and tell me.

# Do this
1. Close Bannerlord.
2. Open `Coodsz TAOM Client Launcher.exe` in that folder.
3. Click **Unblock DLLs** first. It is the first Setup button. Until you have used it once, it stays gold and pulses, and the first **Connect** waits for that click. Windows blocks downloaded DLLs, and the game cannot load them until that block is cleared. It clears the Windows download mark under Modules. It does not change the mod files. If Windows blocks a DLL later, that button turns red. Click it again, then **Connect**.
4. Click **Check mods**, then **Install TAOM**.
5. Click **Use Coop 0.1.5**. If Modules\Coop is already 0.1.5, it leaves that folder. If another Coop version is in Modules\Coop and a 0.1.5 copy is parked beside it, this puts 0.1.5 into Modules\Coop and moves the other folder out of Modules. It does not make another copy.
6. Direct connect: the host's IP and port. Put a password only if the host has set one.
7. Click **Connect**.

# If something goes wrong
- **Open client logs** is highlighted. That click opens Coop_client.log and a dated client-action.log copy for Discord. Passwords, addresses, and Steam IDs are removed from the action log.
- If the game closes, click **Save All Logs To One Zip** and send that zip. It is the full pack: Coop_client.log, client-action.log, the activity log, crash reports, engine logs, TAOM.CoopCompat logs, and the crash dump when present. Saves are left out.
- If a join fails, the log says what to change. Follow that line.
- If the game is choppy after you connect, click the green **Fix low FPS** button. Close Bannerlord if it is open, then click **Connect** again. The rose **Undo FPS fix** button puts the patch shield back if that click was a mistake.
- **Clear shader cache** deletes only the shader folder in ProgramData. Close Bannerlord first. It does not touch mods or saves. There is no undo. The game builds the shaders again the next time it starts.

# Do not
- Do not unzip either compat zip, and do not copy them into Modules yourself.
- Do not use TAOM 2.0.28, 2.0.29, or any Coop other than 0.1.5.
- Do not click **Use latest Coop**. That switches off 0.1.5.
- Do not turn on Harmony, ButterLib, War Sails, or Steam relay.
- Do not enlist or make a camp.
- Do not click Install or Repair while Bannerlord is open. Repair is only for a damaged module.


PART 2 — host

# Coodsz TAOM server tool

Do the player steps first, so Bannerlord has the same modules. Download **Coodsz Dedicated TAOM Server Tool** from the same release. Unzip it to its own folder. The CompatOnly-HOST-OPERATOR zip from Download step 3 must stay zipped. **Prepare server** finds it anywhere on this PC, including the Desktop.

# Do this
1. Open `Coodsz Dedicated TAOM Server Tool.exe` inside that folder. Leave the other files beside it.
2. Pick a real TAOM campaign save. A vanilla new game and `default_new_game` are refused. **Start server** only loads a save already in the server Game Saves folder. If the line says Single player copy, click **Name server copy** first. Leave the name box blank to use that campaign's name.
3. Click **Prepare server** once. If that folder is already prepared, leave it.
4. Click **Start server**. Wait until the log says **SERVING**. Closing the host and opening it again still shows **SERVING** when that server is still running. **Open server logs** is highlighted. That click opens the logs folder and selects the newest coop-server log plus a dated host-action-*.log copy for Discord (not the plain host-action.log).
5. If the server tool says it cannot load a DLL and the message includes the folder path, click **Unblock DLLs** in the server tool. That button turns red when the server log says Windows blocked a DLL. It clears the Windows download mark in the server folder. A startup line that only says `Cannot load: SandBox.dll` is not a blocked file, and it does not replace **SERVING**.
6. Give players your port-forwarded IP address and UDP `4200`. Or use Steam. Give your friends your Steam name so they can connect.

# While the server runs
- The server buttons are **Start server**, **Save**, **Restart**, then **Stop**.
- On the **Server** tab, under online players: **Refresh**, **Kick player**, **Ban player**, and **Unban player**. Banned names stay on the list. A banned player is kicked again while this tool is the program that started the server.
- Fast forward is on **Settings**. When it is off, the fast forward button stays at normal speed for players and for the host. When it is on, that button works for everyone. Save the setting, then restart the server from this tool. A server that is already running keeps the old setting until that restart.
- **Save** keeps the server up and players connected. If the campaign looks broken, the tool will not write over the last playable save. That last good copy stays in the server save folder. Leave autosave off while you are checking a world that just broke.
- On **Cheats**, pick the player from the list. The list comes from the live server log. Console and Cheats only send a command when this tool is the program that started the server. If it did not, the tool says the command was not sent. Restart the server from this tool, then send it again. That restart disconnects players while the same save loads.
- **Save engine logs** packs the engine log, the TAOM debug log, and the coop server logs into one zip. The save and any crash dump are left out. The password is removed.

# Password

Type a password in the server tool if you want one, and give players that same password. An empty password is fine. The client passes that password when you click **Connect**. It does not edit `Coop.Core.dll`. A password edit on that file crashes TAOM.CoopCompat. If that edit is already there, the client puts the pinned 0.1.5 file back. The server tool does the same for the server copy when you click **Start server**.

# Do not
- Do not prepare the server a second time over a folder that already has a host.
- Do not start `BannerlordCoopServer.exe` yourself while also using this tool. Bans apply when this tool started the server.
- Do not delete or rename single-player campaign saves. The tool copies the one save the server needs.
- Do not send anyone your Documents\Mount and Blade II Bannerlord\Game Saves folder.
- Do not share `taom-server.json`.
- Do not give friends port `7210`. Players use `4200`.
- Do not use the client **Unblock DLLs** button for the server folder. The server tool has its own button.

I will try my best to keep these updated and working with the latest release. Any bugs, challenges, feature ideas, or if you need help in any way, please let me know in this thread.


PART 3 — already have the tools

# Update the tools

When a newer release is out, the tool shows a line and an **Install update** button. The button stays highlighted until you click it. Click it. The button says **Installing**, and a progress bar moves while the download runs. When it is done, the tool closes and opens again on the new copy. The previous program files are removed after the new copy is in place. Your saved paths, password, and cheats stay in the folder. A dedicated server that is already running stays up. The tool closes. The server does not.

The first time you move to a copy that has this button, replace the programs once by hand. After that, use **Install update**.

# Do this by hand, if the button is not there yet

1. Close the client launcher and the server tool. Close Bannerlord too.
2. Download the new client zip and the new server zip:
https://github.com/Coodsz/Coodsz-TAOM/releases/latest
3. Unzip each one over the folder you already use. When Windows asks, choose **Replace**.
4. Open the tools again.

Dragging the new files onto the old ones is the same thing. Close the tools first, or Windows will not replace a file that is still open.

# Do not

- Do not delete the old folder first. Your saved paths and password sit next to the programs. A replace leaves those alone. Deleting the folder makes you type them in again.
- Do not reinstall TAOM.
- Do not download the compat zips again.
- Do not delete the TAOM-Coop-Host folder or anything in Documents.

The new programs do the new checks themselves. The client raises Low terrain to Medium when you click **Connect**. The server tool copies missing .NET 6 files into the server folder when you click **Start server**. **Start server** only loads a save already in the server Game Saves folder. **Name server copy** makes that copy, and a blank name uses the campaign name. **Use Coop 0.1.5** puts 0.1.5 into Modules\Coop when that folder is another version, and moves the other Coop folder out of Modules. It does not make a second copy. **Open client logs** selects Coop_client.log and client-action.log. **Save All Logs To One Zip** packs Coop_client.log, client-action.log, the activity log, crash reports, engine logs, TAOM.CoopCompat logs, and the crash dump when present. Saves are left out. **Fix low FPS** turns off TAOM's patch shield. Close Bannerlord if it is open, then click **Connect** again. **Undo FPS fix** puts the patch shield back. **Save engine logs** on the server tool packs the host logs and removes the password. The save and any crash dump are left out. **Unblock DLLs** clears the Windows download mark. On the client it is the first Setup button. Until you have used it once, it pulses and the first **Connect** waits for it. There the folder is Modules. On the server tool that folder is the server folder. That button turns red when Windows blocked a DLL. It does not change the mod files. **Clear shader cache** deletes only the shader folder in ProgramData. Close Bannerlord first. It does not touch mods or saves. If `Coop.Core.dll` was edited for a password, the client puts the pinned 0.1.5 file back, and the server tool does the same on **Start server**. That edit crashes TAOM.CoopCompat. **Install update** replaces the program only. It does not change the game, the mods, the server, or the save. After the new copy opens, the line and the button are gone until the next release.

I will try my best to keep these updated and working with the latest release. Any bugs, challenges, feature ideas, or if you need help in any way, please let me know in this thread.


PART 4 — Coodsz Coop and Friends

# Coodsz Coop and Friends players start here

These are the tools for a normal Coop game, and for a TAOM map game that is not using the dedicated TAOM server tool above. Same Bannerlord **1.4.8**. Same .NET 8 Desktop Runtime, x64.

# Download
https://github.com/Coodsz/Coodsz-Coop-and-Friends/releases/latest

Unzip the zip before you open anything. You get these program folders:

- `Coodsz Coop and Friends` — players on the vanilla map. Open `Coodsz Coop and Friends.exe`.
- `Coodsz and Friends` — players on the TAOM map. Open `Coodsz and Friends.exe`.
- `Coodsz Host` — the host. Open `CoodszHost.exe`. The window title is Coodsz and Friends Server Coop Manager Dedicated Tool.

# Players
1. Close Bannerlord.
2. Open the launcher that matches the map you are playing.
3. Under **Saved setup**, pick your setup. The **Campaign map** box switches to the map that setup saved. Default and custom setups load their own map. The locked Vanilla setup loads the vanilla map. The locked More Nations setup loads the Remastered map. Saved paths and cheats stay.
4. Steam lobby: put the host's Steam name in the Steam lobby box and connect from the lobby.
5. Direct connect: put the host's address and UDP port in the direct boxes. A home address only works on the same network. A port-forwarded address is what friends off that network use.
6. Click connect. If Windows says Unknown publisher, choose More info, then Run anyway.
7. If the game says it cannot load a DLL, click **Unblock DLLs**. That button turns red when Windows blocks a DLL. Click it, then connect again.
8. **Add mods** opens mods already on this PC (Workshop, Nexus, ModDB folders). It does not download anything. Locked setups refuse Add mods. **Install mods** is the button that opens Steam for Workshop mods that are missing from the game's Modules folder.
9. **Crash logs** is highlighted. That click opens Coop_client.log and a dated client-action.log copy for Discord, or Coop Crash Reports if the game folder is missing. It also opens the hard-crash folder. client-action.log sits next to the launcher and records Connect, Unblock, Crash logs, Save All Logs, and the other key clicks. Passwords, addresses, and Steam IDs are removed.
10. **Save All Logs To One Zip** is highlighted. It is the full pack: Coop_client.log, client-action.log, crash reports, engine logs, and hard crashes. Saves are left out. Send that zip.

# Host
1. Do the player steps first so Bannerlord has the same modules.
2. Open `CoodszHost.exe`.
3. Pick the save the server should load. Start server only loads a save the server already has. For More Nations Remastered, make the campaign in single player with that locked setup, then click Load single-player save and pick that .sav. The single-player file stays where it is. A campaign the server creates itself leaves the ground black. A vanilla or other-mod save stays that map. A server that is already running keeps its current campaign until you stop it and press Start server.
4. The host has its own **Campaign map** box on the server page. Choosing a saved setup switches it to the map that setup saved. Default and custom setups load their own map. The locked Vanilla setup loads the vanilla map. The locked More Nations setup loads the Remastered map. Saved paths and cheats stay.
5. **Region** is on the server page: EU, NA, AS, OC, SA, or AF. Pick the region that matches your players.
6. **Set server folder** chooses which BannerlordCoopServer.exe this tool starts. Use it when the dedicated server was not found, or this tool found the wrong copy. The file is in Modules\Bannerlord Coop\DedicatedServer, or in Workshop folder 3770450698\DedicatedServer.
7. Click **Start server**. Wait until it is serving. Closing the host and opening it again still shows SERVING when the server is running.
   - On Start server, Host copies any missing starter files into the DedicatedServer folder from its own DedicatedServerRepair pack (Start-ModdedServer.ps1, 0Harmony.dll, and the other starter files). Files you already have are left alone.
   - Host will not start bare BannerlordCoopServer.exe when Start-ModdedServer.ps1 is missing. That bare start only loaded 5 core mods and broke joins.
   - The Modules tab shows how many mods are on. That start writes the locked setup's module list, including MCM and the framework mods when those folders are present. If a player is told the server does not support their modules, pick that same locked setup and press **Start server** again.
   - Locked setups keep CoopNightly off and use stable Coop. On a normal setup, Bannerlord Coop can be Coop or CoopNightly. Host parks the extra copy so only one loads.
   - If two enabled mods ship different copies of the same DLL (for example 0Harmony.dll), Start server prints a duplicate-DLL warning. Keep one copy, move the extra out of the other mod's bin folder, then Start server again. Do not delete the whole mod folder.
   - If the join says the Bannerlord builds do not match, update Steam Workshop item 3770450698. Do not copy the game folder onto the dedicated server.
   - If the server cannot load a DLL, click **Unblock DLLs** in `CoodszHost.exe`. That button turns red when the server log says Windows blocked a DLL.
   - **Open server logs** is highlighted under Server controls. That click opens the logs folder and selects the newest coop-server log plus a dated host-action-*.log copy for Discord (not the plain host-action.log).
8. Give players your address and port, or your Steam name for the lobby.
9. The server buttons are **Start server**, **Save**, **Restart**, then **Stop**. **Save** keeps the server up and players connected.
10. Fast forward and the other Settings values use **Save settings**, then restart the server. **Save settings** works on locked setups too. It writes the difficulty and server options. It does not unlock or change the locked mod list. A running server keeps the old values until that restart.
11. **Load single-player MCM** copies single-player MCM settings into this setup. The single-player files stay. A server that is already running keeps its current MCM until you stop it and press Start server.
12. If the campaign looks broken, the tool will not write over the last playable save. Leave autosave off while you are checking that world.
13. On **Cheats**, pick the player from the list. Commands are sent only when this tool started the server. If it did not, the tool says so. Restart the server from this tool, then send the command again. That restart disconnects players while the same save loads.

# Update
When a newer release is out, the tool shows a line and an **Install update** button. The button stays highlighted until you click it. Click it. The button says **Installing**, and a progress bar moves while the download runs. When it is done, the tool closes and opens again on the new copy. If a program file is still locked, it is moved aside and the new copy starts. The previous program files are removed after the new copy is in place. Your saved paths, cheats, and mod folders stay. A dedicated server that is already running stays up.

The first time you move to a copy that has this button, replace the programs once by hand. Close the tools first. Unzip the new zip over the folder you already use and choose Replace. Do not delete the old folder first. Deleting it makes you type the paths in again.

# Do not
- Do not delete the game, the mods, or the server save to update the tool.
- Do not start the Coop server exe yourself while also using this tool.
- Do not share your settings json. It sits next to the program and holds your paths.

I will try my best to keep these updated and working with the latest release. Any bugs, challenges, feature ideas, or if you need help in any way, please let me know in this thread.
