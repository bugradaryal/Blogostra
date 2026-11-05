namespace IntegrationTests.Support;

public sealed class AdjustableTimeProvider : TimeProvider
{
    private long _offsetTicks;

    public override DateTimeOffset GetUtcNow()
    {
        return base.GetUtcNow() + TimeSpan.FromTicks(Interlocked.Read(ref _offsetTicks));
    }

    public void Advance(TimeSpan by)
    {
        Interlocked.Add(ref _offsetTicks, by.Ticks);
    }
}
