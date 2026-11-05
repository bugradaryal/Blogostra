using Bussiness.Abstractions;
using Bussiness.Exceptions;
using Dto.Requests;
using Entities;
using MediatR;

namespace Bussiness.Features.Admin;

public sealed record CreatePostCommand(AddPostViewModel Model) : IRequest;

public sealed class CreatePostCommandHandler : IRequestHandler<CreatePostCommand>
{
    private readonly IPostRepository _postRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly TimeProvider _timeProvider;

    public CreatePostCommandHandler(IPostRepository postRepository, ICategoryRepository categoryRepository, TimeProvider timeProvider)
    {
        _postRepository = postRepository;
        _categoryRepository = categoryRepository;
        _timeProvider = timeProvider;
    }

    public async Task Handle(CreatePostCommand request, CancellationToken cancellationToken)
    {
        var model = request.Model;
        var category = await _categoryRepository.GetCategoryByName(model.Category, cancellationToken)
            ?? throw new NotFoundException("Category not exist!");

        var post = Post.Create(model.Title, model.Content, model.Image, category, _timeProvider.GetUtcNow().UtcDateTime);
        await _postRepository.AddPost(post, cancellationToken);
    }
}
