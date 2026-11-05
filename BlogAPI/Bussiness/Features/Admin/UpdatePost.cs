using Bussiness.Abstractions;
using Bussiness.Exceptions;
using Dto.Requests;
using MediatR;

namespace Bussiness.Features.Admin;

public sealed record UpdatePostCommand(UpdatePostViewModel Model) : IRequest;

public sealed class UpdatePostCommandHandler : IRequestHandler<UpdatePostCommand>
{
    private readonly IPostRepository _postRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly TimeProvider _timeProvider;

    public UpdatePostCommandHandler(IPostRepository postRepository, ICategoryRepository categoryRepository, TimeProvider timeProvider)
    {
        _postRepository = postRepository;
        _categoryRepository = categoryRepository;
        _timeProvider = timeProvider;
    }

    public async Task Handle(UpdatePostCommand request, CancellationToken cancellationToken)
    {
        var model = request.Model;

        var post = await _postRepository.GetPostById(model.Id, cancellationToken)
            ?? throw new NotFoundException("Post not exist!");
        var category = await _categoryRepository.GetCategoryByName(model.Category, cancellationToken)
            ?? throw new NotFoundException("Category not exist!");

        post.Revise(model.Title, model.Content, model.Image, category, _timeProvider.GetUtcNow().UtcDateTime);

        await _postRepository.UpdatePost(post, cancellationToken);
    }
}
