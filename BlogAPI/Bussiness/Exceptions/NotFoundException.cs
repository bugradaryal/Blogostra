namespace Bussiness.Exceptions;

public class NotFoundException : AppException
{
    public NotFoundException(string message) : base(message)
    {
    }

    public override int StatusCode => 404;
    public override string Title => "Not Found";
}
