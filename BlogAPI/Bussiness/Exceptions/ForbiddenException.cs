namespace Bussiness.Exceptions;

public class ForbiddenException : AppException
{
    public ForbiddenException(string message) : base(message)
    {
    }

    public override int StatusCode => 403;
    public override string Title => "Forbidden";
}
