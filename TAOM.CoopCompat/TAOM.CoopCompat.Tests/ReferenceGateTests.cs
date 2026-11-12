using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace TAOM.CoopCompat.Tests;

/// <summary>
/// TAOM.CoopCompat may name only the framework, the engine, TAOM and the public Coop assemblies, so
/// no private dedicated-server assembly can creep into its references.
/// </summary>
[TestClass]
public class ReferenceGateTests
{
    private static readonly string[] AllowedExact =
    {
        "mscorlib", "TAOM", "Autofac", "Common", "GameInterface", "Coop.Core", "protobuf-net", "protobuf-net.Core", "LiteNetLib",
    };

    private static bool Allowed(string name) =>
        AllowedExact.Contains(name) || name.StartsWith("System") || name.StartsWith("TaleWorlds.");

    [TestMethod]
    public void BuiltAssembly_ReferencesOnlyAllowedAssemblies()
    {
        var referenced = typeof(CoopCompatSubModule).Assembly.GetReferencedAssemblies()
            .Select(a => a.Name!).Distinct().OrderBy(n => n).ToList();

        var stray = referenced.Where(n => !Allowed(n)).ToList();

        CollectionAssert.AreEqual(new string[0], stray, "Unexpected assembly references: " + string.Join(", ", stray));
    }

    [TestMethod]
    public void BuiltAssembly_NeverReferencesDedicatedServerAssemblies()
    {
        var referenced = typeof(CoopCompatSubModule).Assembly.GetReferencedAssemblies().Select(a => a.Name!);

        Assert.IsFalse(referenced.Any(n => n.StartsWith("DedicatedServer")));
    }
}
