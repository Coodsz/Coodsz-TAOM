Paste each part as its own Discord message. A line that starts with # is a big heading.

# I made these tools with the help of the community and other sources for ease of access. I am not affiliated with the TAOM team in any way. They are here so hosting and playing with friends is easier.

PART 1 — players

# Coodsz TAOM

Tools version: **v1.2.1** (Client Launcher and Server Tool), for **TAOM-Coop 0.3.25**.

You need Bannerlord **1.4.8** on Steam.

Same set for everyone: TAOM, TAOM_Map, TAOM.Dependencies and LOTRLOME_Armory **2.0.29.5**, Workshop Coop **0.1.6**, TAOM.CoopCompat **0.3.25**.

TAOM 2.0.27 campaigns do not load on 2.0.29.5. Everyone moves to the new set together, and the host starts a new campaign.

# Download
https://github.com/Coodsz/Coodsz-TAOM/releases/latest

1. Download **Coodsz-TAOM-Tools**. It holds both programs, the client launcher and the server tool. Unzip it before you open anything, and give each Coodsz zip its own folder.
2. You don't need to download the CompatOnly zips anymore. The client launcher has `TAOM-Coop-v0.3.25-CompatOnly-CLIENT-PLAYTEST-1675bea7-a2ac41c2-r2.zip` built in, and the server tool has `TAOM-Coop-v0.3.25-CompatOnly-HOST-OPERATOR-1675bea7-a2ac41c2-r2.zip`. If you already have them on this PC, the tools use those first.
3. Subscribe to **Bannerlord Coop** on the Steam Workshop (item 3770450698) and stay subscribed. Steam gives you Coop **0.1.6**, which is the one TAOM-Coop 0.3.25 uses.
4. Download TAOM **2.0.29.5** (`TAOM_Public_2_0_29_5.zip`, about 18 GB) and leave that zip anywhere on this PC:
https://www.moddb.com/mods/tales-from-the-age-of-men/downloads/taom-public-2-0-29-5

# If Windows warns you

If SmartScreen says "Unknown publisher", choose **More info**, then **Run anyway**. If Defender says virus, delete it and tell me.

# Do this
1. Close Bannerlord.
2. Open `Coodsz TAOM Client Launcher.exe` in that folder.
3. Windows blocks downloaded DLLs, and the game cannot load them until that block is cleared. The launcher clears the Windows download mark under Modules by itself before every launch and after **Install mods**. It does not change the mod files. The **Unblock DLLs** button is still in **More tools**.
4. Click **Check mods**, then **Install or repair TAOM**. It installs all four TAOM 2.0.29.5 modules from the zip and TAOM.CoopCompat from the CompatOnly zip it has built in.
5. Open **More tools** and click **Use Workshop Coop 0.1.6**. It checks that the Workshop Coop is 0.1.6 and moves any other Coop copy (like the old 0.1.5 playtest copy) out of Modules. Moved folders are kept, not deleted. If Coop is missing, it subscribes in Steam first.
6. **Direct** (recommended): the host's IP and UDP port `4200`. **Steam lobby**: only if the host turned on Steam. Use the host's Steam profile name (the name friends see in Steam, not the login name), with Steam running on both PCs. Put a password only if the host has set one.
7. Click **Connect**. With Direct it first checks that the server answers. When nothing answers, or the address is your own PC, VPN or router, it says so before the game starts.

# If something goes wrong
- **Open client logs** in **More tools** opens Coop_client.log and a dated client-action.log copy for Discord. Passwords, addresses, and Steam IDs are removed from the action log.
- If the game closes, click **Save logs for help** and send that zip. It is the full pack: Coop_client.log, client-action.log, the activity log, crash reports, engine logs with the watchdog log of each session, TAOM.CoopCompat logs, TAOM stall reports (taom_crash zips from the last 3 days), the logs of a TAOM server on the same PC, and the crash dump when present. Saves are left out. Addresses, Steam IDs, and passwords (also the join password on the game command line) are removed from the text files.
- A yellow line under **Connect** warns when the PC is low on memory, or when a dedicated server runs on the same PC with less than 24 GB. TAOM can freeze when Windows runs out of memory. Close heavy apps, run the server on another PC if you can, and let Windows manage the page file. Connect still works.
- If a join fails, or the game closes before it joins, the log says what to change. Follow that line.
- If the game is choppy after you connect, turn the **Low FPS fix** switch on. Close Bannerlord if it is open, then click **Connect** again. Turning the switch off puts the patch shield back if that was a mistake.
- **Clear shader cache** deletes only the shader folder in ProgramData. Close Bannerlord first. It does not touch mods or saves. There is no undo. The game builds the shaders again the next time it starts.

# Do not
- Do not unzip either compat zip, and do not copy them into Modules yourself.
- Do not mix versions. TAOM 2.0.27 with 0.3.25, or Coop 0.1.5 with 0.3.25, does not work.
- Do not click **Restore parked Coop**. It is only for going back to an old setup.
- Do not turn on Harmony, ButterLib, or War Sails. War Sails does not work with TAOM 2.0.29.5.
- Do not enlist or make a camp.
- Do not click Install or Repair while Bannerlord is open. Repair is only for a damaged module.


PART 2 — host

# Coodsz TAOM server tool

Do the player steps first, so Bannerlord has the same modules. The server tool is in the same Coodsz-TAOM-Tools zip as the client launcher. The server tool has the CompatOnly-HOST-OPERATOR zip built in, so **Prepare server** needs no extra download.

Coming from 0.3.17? The tool moves to a new server folder (`Server-v0325-Coop-v016-r2`) and a new Data folder (`Data-v0325`) by itself. The old folders are not changed. Your old 2.0.27 campaign does not load, so make a new one.

# Do this
1. Open `Coodsz TAOM Server Tool.exe` in the Coodsz TAOM Tools folder.
2. Start a new TAOM 2.0.29.5 campaign in single player and save it. Pick that save in the tool. A vanilla new game and `default_new_game` are refused. **Start server** only loads a save already in the server Game Saves folder. If the line says Single player copy, click **Name server copy** first. Leave the name box blank to use that campaign's name.
3. Click **Prepare server** once. If that folder is already prepared, leave it.
4. Click **Start server**. The first time, it shows the Coop server terms. Read them and click **I accept**, or the server will not start. It only asks again when Coop changes the terms.
5. Wait until the log says **SERVING**. The first start of a new campaign builds the map cache first and can take up to an hour. The status at the top says "Building the map cache: 36 of 221" while it works. Do not stop the server then, or it starts over. Closing the host and opening it again still shows **SERVING** when that server is still running. **Open server logs** is highlighted. That click opens the logs folder and selects the newest coop-server log plus a dated host-action-*.log copy for Discord (not the plain host-action.log).
6. If the server tool says it cannot load a DLL and the message includes the folder path, click **Unblock DLLs** in the server tool. That button turns red when the server log says Windows blocked a DLL. It clears the Windows download mark in the server folder. A startup line that only says `Cannot load: SandBox.dll` is not a blocked file, and it does not replace **SERVING**.
7. Give players your port-forwarded IP address and UDP `4200`. That is the recommended way.
8. Steam lobby is optional. Tick **Advertise through Steam** on the Server page before you click **Start server**, keep Steam running, and give friends your Steam profile name. If a Steam join fails, use direct connect.

# While the server runs
- The server buttons are **Start server**, **Save game**, **Restart**, **Last good save**, then **Stop**. **Last good save** stops the server without saving, puts back the newest save from before the hero lost their party, and starts again.
- **Delete server copy** removes the server's copy of the selected save. The single-player save stays.
- On the **Server** tab, under online players: **Refresh**, **Kick player**, **Ban player** (red), and **Unban player**. Banned names stay on the list. A banned player is kicked again while this tool is open.
- Fast forward is on **Settings**. When it is off, the fast forward button stays at normal speed for players and for the host. When it is on, that button works for everyone. Save the setting, then restart the server from this tool. A server that is already running keeps the old setting until that restart.
- **Save game** keeps the server up and players connected. If the campaign looks broken, the tool will not write over the last playable save. That last good copy stays in the server save folder. Leave autosave off while you are checking a world that just broke.
- On **Cheats**, pick the player from the list. The list comes from the live server log. Console and Cheats send commands to the running server, also after you close this tool and open it again. **Save game** and the automatic ban kicks work the same way. Console has **Copy** and **Clear**.
- What the server prints in this tool is also kept in the logs folder as host-console-<date>.log, so it is still there after the tool closes.
- **Save all logs to one zip** (next to Open server logs, and on the Logs tab) packs the server logs, the host-console logs, the TAOM debug log, the engine logs, server crash reports, and the settings without the password. Saves are left out. If the server left crash dumps, it asks first. A dump is a copy of the server's memory, so only send that zip to someone you trust.

# Password

Type a password in the server tool if you want one, and give players that same password. An empty password is fine. The client passes that password when you click **Connect**. It does not edit `Coop.Core.dll`. A password edit on that file crashes TAOM.CoopCompat. If that edit is already there, the client puts the released Coop 0.1.6 file back. The server tool does the same for the server copy when you click **Start server**.

# Do not
- Do not prepare the server a second time over a folder that already has a host.
- Do not start `BannerlordCoopServer.exe` yourself while also using this tool. Start it from the tool so the save and the log stay where the tool expects them.
- Do not load a TAOM 2.0.27 campaign on the new server. It does not load.
- Do not delete or rename single-player campaign saves. The tool copies the one save the server needs.
- Do not send anyone your Documents\Mount and Blade II Bannerlord\Game Saves folder.
- Do not share `taom-server.json`.
- Do not give friends port `7210`. Players use `4200`.
- Do not use the client **Unblock DLLs** button for the server folder. The server tool has its own button.

I will try my best to keep these updated and working with the latest release. Any bugs, challenges, feature ideas, or if you need help in any way, please let me know in this thread.


PART 3 — already have the tools

# Update the tools

When a newer release is out, the tool shows a line and an **Install update** button. The button stays highlighted until you click it. Click it. The button says **Installing**, and a progress bar moves while the download runs. When it is done, the tool closes and opens again on the new copy. The previous program files are removed after the new copy is in place. Your saved paths, password, and cheats stay. They live in %LOCALAPPDATA%\Coodsz\TAOM. A dedicated server that is already running stays up. The tool closes. The server does not.

From v1.2.0 the server tool is called `Coodsz TAOM Server Tool.exe`. When **Install update** updates `Coodsz Dedicated TAOM Server Tool.exe`, the new program takes the new name on its first start, moves your shortcuts to itself and removes the old exe. The client launcher keeps its name.

The first time you move to a copy that has this button, replace the programs once by hand. After that, use **Install update**.

# Do this by hand, if the button is not there yet

1. Close the client launcher and the server tool. Close Bannerlord too.
2. Download the new Coodsz-TAOM-Tools zip:
https://github.com/Coodsz/Coodsz-TAOM/releases/latest
3. Copy each program from its Coodsz TAOM Tools folder into the folder where you already have that tool, so it finds your settings. When Windows asks, choose **Replace**. The new program removes the old one with the old name.
4. Open the tools again.

Dragging the new files onto the old ones is the same thing. Close the tools first, or Windows will not replace a file that is still open.

# Moving from 0.3.17 to 0.3.25 (one time)

This update also changes the mods, so do these once after the tools are updated:
1. Nothing to download for TAOM-Coop 0.3.25. The tools have the CLIENT and HOST-OPERATOR zips built in.
2. Download TAOM 2.0.29.5 from the ModDB link in PART 1. Leave it zipped.
3. Stay subscribed to Bannerlord Coop on the Workshop so Steam gives you 0.1.6.
4. In the client: **Check mods**, **Install or repair TAOM**, then **More tools** and **Use Workshop Coop 0.1.6**.
5. Host: make a new 2.0.29.5 campaign, pick it, **Prepare server**, then **Start server**.

# Do not

- Do not delete the old folder before the new version has started once. Your saved paths and password now live in %LOCALAPPDATA%\Coodsz\TAOM, and the new version copies them there from the old folder on its first start. Deleting the folder before that makes you type them in again.
- Do not delete the TAOM-Coop-Host folder or anything in Documents.
- Do not rename the old 0.3.17 compat zips to look new. The tools only pick up the 0.3.25 zips, so the old ones can stay where they are.

The new programs do the new checks themselves. The client raises Low terrain to Medium when you click **Connect**. The server tool copies missing .NET 6 files into the server folder when you click **Start server**. **Start server** only loads a save already in the server Game Saves folder. **Name server copy** makes that copy, and a blank name uses the campaign name. **Use Workshop Coop 0.1.6** checks the Workshop Coop, subscribes in Steam first if it is missing, and moves any other Coop folder out of Modules without deleting it. The server tool asks you to accept the Coop server terms on the first **Start server**. **Open client logs** selects Coop_client.log and client-action.log. **Save logs for help** packs Coop_client.log, client-action.log, the activity log, crash reports, engine logs, TAOM.CoopCompat logs, and the crash dump when present. Saves are left out. The **Low FPS fix** switch turns off TAOM's patch shield. Close Bannerlord if it is open, then click **Connect** again. Turning it off puts the patch shield back. **Save all logs to one zip** on the server tool packs the host logs and the host-console logs and removes the password. Saves are left out, and crash dumps are only added after you say yes. **Unblock DLLs** clears the Windows download mark. On the client it runs by itself before every launch and after **Install mods**, and the button is in **More tools**. There the folder is Modules. On the server tool that folder is the server folder. That button turns red when Windows blocked a DLL. It does not change the mod files. **Clear shader cache** deletes only the shader folder in ProgramData. Close Bannerlord first. It does not touch mods or saves. If `Coop.Core.dll` was edited for a password, the client puts the released Coop 0.1.6 file back, and the server tool does the same on **Start server**. That edit crashes TAOM.CoopCompat. **Install update** replaces the program only. It does not change the game, the mods, the server, or the save. After the new copy opens, the line and the button are gone until the next release.

I will try my best to keep these updated and working with the latest release. Any bugs, challenges, feature ideas, or if you need help in any way, please let me know in this thread.

# License
The tools are free to use. Copyright (c) 2026 Coodsz, all rights reserved. Without written permission from Coodsz you may not make money with them, decompile them, reupload them anywhere other than the official GitHub releases, or share modified copies. To ask, contact Coodsz on Discord (Coodsz) or on GitHub (github.com/Coodsz). Each tool shows the full text once at the first start, and you press **I agree** to use the tools.
