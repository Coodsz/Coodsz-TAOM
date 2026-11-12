using System;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using TaleWorlds.CampaignSystem;
using TaleWorlds.Core;
using TaleWorlds.MountAndBlade;
using TAOM.Core.Logging;
using TAOM.CoopCompat.Handshake;
using TAOM.CoopCompat.Momentum;
using TAOM.CoopCompat.Transport;
using TAOM.Features.CoopInterop;
using TAOM.Features.WarOfTheRingMomentum;

namespace TAOM.CoopCompat;

/// <summary>
/// Entry point of the TAOM.CoopCompat module. Its type shape names only TaleWorlds and TAOM types
/// (ICoopTransport names no Coop type): the engine scans every submodule type before any
/// OnSubModuleLoad runs, and a Coop assembly that is not loaded yet must not be needed for that scan.
/// The transport and both services live in fields because Coop holds its subscriptions weakly.
/// </summary>
public sealed class CoopCompatSubModule : MBSubModuleBase
{
    private ICoopTransport? _transport;
    private SettingsHandshakeService? _handshake;
    private MomentumRelayService? _momentum;

    protected override void OnSubModuleLoad()
    {
        Log("[CoopCompat] module loaded");
        try
        {
            StartTransport();
            BuildServices(_transport!);
            Log("[CoopCompat] transport subscribed");
        }
        catch (Exception ex)
        {
            // A Coop assembly missing or changed: stay inert, one line, never stop the module list.
            _transport = null;
            Log("[CoopCompat] inert, Coop is not usable: " + ex.GetType().Name + ": " + ex.Message);
        }
    }

    // The only method that touches a Coop type; NoInlining keeps the JIT from resolving it at the call site.
    [MethodImpl(MethodImplOptions.NoInlining)]
    private void StartTransport()
    {
        var transport = new CoopTransport();
        transport.Start();
        _transport = transport;
    }

    // TAOM's OnSubModuleLoad ran first, so its container is ready here.
    private void BuildServices(ICoopTransport transport)
    {
        var logger = IoC.Resolve<IModLogger>();
        var outcomes = IoC.Resolve<IOutcomeLog>();
        _handshake = new SettingsHandshakeService(transport, () => SettingsFingerprint.ComputeAcross(TaomSettingsPages.All()),
            BuildIdentity.FromLoadedAssemblies(), new InformationManagerSettingsNotice(), logger, outcomes);
        _momentum = new MomentumRelayService(transport, IoC.Resolve<IMomentumStateStore>(), logger, outcomes,
            () => Stopwatch.GetTimestamp() / (double)Stopwatch.Frequency, () => CampaignTime.Now.ToHours);
    }

    protected override void OnGameStart(Game game, IGameStarter gameStarterObject)
    {
        if (_momentum != null && game.GameType is Campaign && gameStarterObject is CampaignGameStarter starter)
            starter.AddBehavior(new MomentumRelayCampaignBehavior(_momentum));
    }

    private static void Log(string message)
    {
        try
        {
            IoC.Resolve<IModLogger>().LogInfo(message);
        }
        catch (Exception)
        {
            // Logging must never stop the module list from loading.
        }
    }
}
