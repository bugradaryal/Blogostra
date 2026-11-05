namespace Bussiness.Exceptions;

public class ConflictException : AppException
{
    public ConflictException(string message) : base(message)
    {
    }

    public override int StatusCode => 409;
    public override string Title => "Conflict";
}
