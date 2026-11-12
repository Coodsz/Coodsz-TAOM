using System;
using System.Linq;
using System.Reflection;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace TAOM.CoopCompat.Tests;

/// <summary>
/// The engine scans every submodule type before any OnSubModuleLoad runs (type-scan rule): the entry
/// point's base, interfaces and fields may name only the framework, TaleWorlds and TAOM, and the
/// transport interface it holds names no Coop type either.
/// </summary>
[TestClass]
public class SubModuleShapeTests
{
    private static readonly string[] CoopAssemblies =
    {
        "Common", "GameInterface", "Coop.Core", "LiteNetLib", "Autofac", "protobuf-net", "protobuf-net.Core",
    };

    private static bool NamesCoop(Type type) =>
        CoopAssemblies.Contains(type.Assembly.GetName().Name)
        || (type.IsGenericType && type.GetGenericArguments().Any(NamesCoop));

    [TestMethod]
    public void SubModule_BaseInterfacesAndFields_NameNoCoopType()
    {
        var type = typeof(CoopCompatSubModule);
        var fields = type.GetFields(BindingFlags.Instance | BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic);

        Assert.IsFalse(NamesCoop(type.BaseType!));
        Assert.IsFalse(type.GetInterfaces().Any(NamesCoop));
        Assert.IsFalse(fields.Any(f => NamesCoop(f.FieldType)), string.Join(", ", fields.Select(f => f.Name + ":" + f.FieldType)));
    }

    [TestMethod]
    public void TransportInterface_NamesNoCoopType_InAnySignature()
    {
        var type = typeof(TAOM.CoopCompat.Transport.ICoopTransport);
        var signatureTypes = type.GetMethods().SelectMany(m => m.GetParameters().Select(p => p.ParameterType).Append(m.ReturnType))
            .Concat(type.GetProperties().Select(p => p.PropertyType))
            .Concat(type.GetEvents().Select(e => e.EventHandlerType!));

        Assert.IsFalse(signatureTypes.Any(NamesCoop));
        Assert.IsFalse(type.GetInterfaces().Any(NamesCoop));
    }

    [TestMethod]
    public void SubModule_HasATransportField_OfTheInterfaceType()
    {
        var field = typeof(CoopCompatSubModule).GetField("_transport", BindingFlags.Instance | BindingFlags.NonPublic);

        Assert.IsNotNull(field);
        Assert.AreEqual(typeof(TAOM.CoopCompat.Transport.ICoopTransport), field!.FieldType);
    }

    [TestMethod]
    public void SubModule_StaysUnder150Lines()
    {
        var lines = System.IO.File.ReadAllLines(RepoFiles.Path("CoopCompat/CoopCompatSubModule.cs")).Length;

        Assert.IsTrue(lines < 150, lines + " lines (ADR-002)");
    }
}
