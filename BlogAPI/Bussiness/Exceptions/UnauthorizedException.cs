namespace Bussiness.Exceptions;

public class UnauthorizedException : AppException
{
    public UnauthorizedException(string message) : base(message)
    {
    }

    public override int StatusCode => 401;
    public override string Title => "Unauthorized";
}
