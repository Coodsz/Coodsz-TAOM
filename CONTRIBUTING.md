# Contributing

Thanks for helping with Coodsz TAOM.

- Found a mod that works or breaks with Coop? Use the report button in the tool. It fills in the details for you.
- Found a bug in a tool? Use the send logs or crash report button in the tool, so the logs come with it.
- Want to change a file here? Make a branch, open a pull request, and say what changed and why. Never push straight to `main`.
- Do not edit `MODS.md` or the compatibility JSON by hand. A bot keeps them from player reports.
- The tool source code is private. For changes to how a tool works, open an issue.

## Tracking work

Assign yourself to a linked issue before implementing. If GitHub does not allow self-assignment,
comment to claim the issue or ask a maintainer to assign you. Open an issue first if needed.

In your PR description, use Fixes #N for an issue in this repo or Fixes followed by the full issue URL
for an issue in another repository. Follow the PR checklist and report what you verified.

## How PRs are reviewed

Every PR is checked against these points. Follow them and your PR has a good chance of passing on the first try.

- Keep each PR small and focused on one change.
- Write each rule or check once. Reuse an existing helper instead of copying its logic.
- Fix the cause at the step that creates the problem, rather than guarding every place that reads it.
- Every fix comes with a test that fails without the fix. Tests check behavior, not a restatement of the code.
- Comments are 1 to 3 lines and say why, not what.
- Don't add a second patch on a method another part of the code already patches. Change the existing owner instead.
- Check every Try style result. Don't add null checks or catches for things that can't happen.
- Keep line endings and encoding as the file has them. New player text needs all the tool's languages.
- PRs open as drafts and leave draft only after the change was tested in game. Say what you tested in the PR.
- Reviews ask for changes when the code is correct but harder to read than it needs to be. They approve when it's correct, readable, tested and as simple as the problem allows.

Using an AI agent? Point it at [AGENTS.md](AGENTS.md) first.
