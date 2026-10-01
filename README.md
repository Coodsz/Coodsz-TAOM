# Coodsz TAOM

Client launcher and dedicated server tool for playing Mount & Blade II: Bannerlord with TAOM and Coop.

I made these tools for ease of access. I am not affiliated with the TAOM team. They are here so hosting and playing with friends is easier.

This does not work with the latest TAOM update yet. It works with TAOM 2.0.27 and Coop 0.1.5.

Download the programs from the [latest release](https://github.com/Coodsz/Coodsz-TAOM/releases/latest).

- Players: `Coodsz-TAOM-Client-Launcher.zip`
- The person hosting also downloads `Coodsz-Dedicated-TAOM-Server-Tool.zip`

Already have the tools? Click **Install update** in the tool when it shows up. It shows a progress bar, then the tool closes and opens again on the new copy. Your saved paths and password stay. The first time you move to a copy that has this button, unzip the new programs over your folder once by hand and choose **Replace**.

You need your own legal Steam copy of Bannerlord 1.4.8, the TAOM 2.0.27 modules, Workshop Coop 0.1.5, and the matching TAOM.CoopCompat 0.3.17 zip. Those are not included here.

Every player downloads `TAOM-Coop-v0.3.17-CompatOnly-CLIENT-PLAYTEST-36ae2c5a-d8a2ad02-r1.zip` and leaves it zipped, anywhere on this PC, including the Desktop. Do not copy it into Bannerlord yourself. **Install TAOM** in the client launcher finds it and puts TAOM.CoopCompat into the game's Modules folder. The host also downloads `TAOM-Coop-v0.3.17-CompatOnly-HOST-OPERATOR-36ae2c5a-d8a2ad02-r1.zip` and leaves it zipped anywhere on this PC, including the Desktop. **Prepare server** finds it there.

Download TAOM 2.0.27 from ModDB and leave that zip anywhere on the PC: https://www.moddb.com/mods/tales-from-the-age-of-men/downloads/taom-public-release-september-26-2027

Install the .NET 8 Desktop Runtime, x64, if Windows asks for it: https://dotnet.microsoft.com/download/dotnet/8.0

Click **Unblock DLLs** before the first Connect. That button turns red when Windows blocks a DLL. **Open client logs** opens Coop_client.log and a dated client-action.log copy. **Save All Logs To One Zip** packs Coop_client.log, client-action.log, the activity log, crash reports, engine logs, TAOM.CoopCompat logs, and the crash dump when present. Saves are left out.

On the host tool, wait until the log says **SERVING**. Closing the host and opening it again still shows SERVING when that server is still running. **Open server logs** highlights a dated `host-action-*.log` copy for Discord.

How to install, join, and host is in `Coodsz-TAOM-Instructions.txt`, and the same steps are in `README.txt` in each release (**PART 1**–**PART 3**).
