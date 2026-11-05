namespace Bussiness.Exceptions;

public abstract class AppException : Exception
{
    protected AppException(string message, Exception? innerException = null) : base(message, innerException)
    {
    }

    public abstract int StatusCode { get; }
    public abstract string Title { get; }
    public virtual IReadOnlyDictionary<string, string[]>? Errors => null;
}
