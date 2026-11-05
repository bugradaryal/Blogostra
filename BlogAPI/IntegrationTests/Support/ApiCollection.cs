namespace IntegrationTests.Support;

[CollectionDefinition(Name)]
public sealed class ApiCollection : ICollectionFixture<BlogApiFactory>
{
    public const string Name = "api";
}
