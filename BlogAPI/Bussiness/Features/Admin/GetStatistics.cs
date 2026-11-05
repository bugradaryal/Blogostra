using Bussiness.Abstractions;
using Bussiness.Exceptions;
using Dto.Responses;
using MediatR;

namespace Bussiness.Features.Admin;

public sealed record GetStatisticsQuery(DateTime StartDate, DateTime EndDate) : IRequest<AllStaticsViewModel>;

public sealed class GetStatisticsQueryHandler : IRequestHandler<GetStatisticsQuery, AllStaticsViewModel>
{
    private readonly IPostRepository _postRepository;
    private readonly ICommentRepository _commentRepository;
    private readonly ILikeRepository _likeRepository;
    private readonly IUserRepository _userRepository;

    public GetStatisticsQueryHandler(
        IPostRepository postRepository,
        ICommentRepository commentRepository,
        ILikeRepository likeRepository,
        IUserRepository userRepository)
    {
        _postRepository = postRepository;
        _commentRepository = commentRepository;
        _likeRepository = likeRepository;
        _userRepository = userRepository;
    }

    public async Task<AllStaticsViewModel> Handle(GetStatisticsQuery request, CancellationToken cancellationToken)
    {
        if (request.StartDate > request.EndDate)
            throw new BadRequestException("Start date must be earlier than end date.");

        return new AllStaticsViewModel
        {
            PostStatics = await _postRepository.GetAllPostStatistics(request.StartDate, request.EndDate, cancellationToken),
            CommentStatics = await _commentRepository.GetAllCommentStatistics(request.StartDate, request.EndDate, cancellationToken),
            LikeStatics = await _likeRepository.GetAllLikeStatistics(request.StartDate, request.EndDate, cancellationToken),
            UserCount = await _userRepository.UserCount(cancellationToken)
        };
    }
}
