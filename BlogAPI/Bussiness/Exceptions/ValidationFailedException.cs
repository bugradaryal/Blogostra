namespace Bussiness.Exceptions;

public class ValidationFailedException : AppException
{
    private readonly IReadOnlyDictionary<string, string[]> _errors;

    public ValidationFailedException(string message, IReadOnlyDictionary<string, string[]> errors) : base(message)
    {
        _errors = errors;
    }

    public override int StatusCode => 400;
    public override string Title => "Validation Failed";
    public override IReadOnlyDictionary<string, string[]>? Errors => _errors;
}
