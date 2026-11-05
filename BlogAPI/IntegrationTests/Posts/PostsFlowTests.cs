using System.Net;
using System.Net.Http.Json;
using Dto.Requests;
using Dto.Responses;
using Entities;
using IntegrationTests.Support;

namespace IntegrationTests.Posts;

[Collection(ApiCollection.Name)]
public class PostsFlowTests
{
    private static readonly byte[] SampleImage = { 1, 2, 3 };

    private readonly BlogApiFactory _factory;
    private readonly HttpClient _anonymous;

    public PostsFlowTests(BlogApiFactory factory)
    {
        _factory = factory;
        _anonymous = factory.CreateApiClient();
    }

    [Fact]
    public async Task Admin_CreatesPost_AndAnonymousReaderFindsIt()
    {
        var admin = await _factory.SignInNewUser(administrator: true);
        var title = UniqueTitle();

        var created = await admin.Client.PostAsJsonAsync("api/Admin/AddPost", NewPost(title, "Travel"));
        Assert.Equal(HttpStatusCode.OK, created.StatusCode);

        var found = await FindByTitle(title);
        Assert.Equal("Travel", found.Category?.Name);
        Assert.Equal(SampleImage, found.Image);

        var byId = await _anonymous.GetFromJsonAsync<PostResponse>($"api/Post/GetPostById?postId={found.Id}");
        Assert.NotNull(byId);
        Assert.Equal(title, byId.Title);

        var count = await _anonymous.GetFromJsonAsync<int>("api/Post/GetPostCounts");
        Assert.True(count >= 1);
    }

    [Fact]
    public async Task RegularUser_CannotCreatePost()
    {
        var user = await _factory.SignInNewUser();

        var response = await user.Client.PostAsJsonAsync("api/Admin/AddPost", NewPost(UniqueTitle(), "Travel"));

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Anonymous_CannotLikePost()
    {
        var response = await _anonymous.PostAsJsonAsync("api/Post/LikeThePost", new LikePostViewModel { PostId = 1 });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task User_LikesAndCommentsOnPost_ThenDislikes()
    {
        var admin = await _factory.SignInNewUser(administrator: true);
        var title = UniqueTitle();
        (await admin.Client.PostAsJsonAsync("api/Admin/AddPost", NewPost(title, "News"))).EnsureSuccessStatusCode();
        var post = await FindByTitle(title);

        var reader = await _factory.SignInNewUser();
        var like = new LikePostViewModel { PostId = post.Id };

        var liked = await reader.Client.PostAsJsonAsync("api/Post/LikeThePost", like);
        Assert.Equal(HttpStatusCode.OK, liked.StatusCode);

        var likedAgain = await reader.Client.PostAsJsonAsync("api/Post/LikeThePost", like);
        Assert.Equal(HttpStatusCode.Conflict, likedAgain.StatusCode);

        var commented = await reader.Client.PostAsJsonAsync("api/Comment/AddCommentToPost", new CommentViewModel { post_id = post.Id, Content = "Nice read" });
        Assert.Equal(HttpStatusCode.OK, commented.StatusCode);

        var reloaded = await _anonymous.GetFromJsonAsync<PostResponse>($"api/Post/GetPostById?postId={post.Id}");
        Assert.NotNull(reloaded);
        var storedLike = Assert.Single(reloaded.Likes);
        Assert.Equal(reader.Id, storedLike.UserId);
        var storedComment = Assert.Single(reloaded.Comments);
        Assert.Equal("Nice read", storedComment.Content);
        Assert.Equal(reader.Id, storedComment.UserId);
        Assert.Equal(reader.Registration.UserName, storedComment.UserName);

        var disliked = await reader.Client.PostAsJsonAsync("api/Post/DislikeThePost", like);
        Assert.Equal(HttpStatusCode.OK, disliked.StatusCode);

        var dislikedAgain = await reader.Client.PostAsJsonAsync("api/Post/DislikeThePost", like);
        Assert.Equal(HttpStatusCode.Conflict, dislikedAgain.StatusCode);
    }

    [Fact]
    public async Task Admin_UpdatesPost_ChangesTitleAndCategory()
    {
        var admin = await _factory.SignInNewUser(administrator: true);
        var title = UniqueTitle();
        (await admin.Client.PostAsJsonAsync("api/Admin/AddPost", NewPost(title, "Personal"))).EnsureSuccessStatusCode();
        var post = await FindByTitle(title);

        var newTitle = UniqueTitle();
        var update = new UpdatePostViewModel
        {
            Id = post.Id,
            Title = newTitle,
            Content = "Updated content",
            Category = "Sports",
            Image = SampleImage
        };

        var response = await admin.Client.PutAsJsonAsync("api/Admin/UpdatePost", update);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var updated = await FindByTitle(newTitle);
        Assert.Equal(post.Id, updated.Id);
        Assert.Equal("Sports", updated.Category?.Name);
        Assert.Equal("Updated content", updated.Content);
    }

    [Fact]
    public async Task Admin_DeletesPost_ThenReadReturnsNotFound()
    {
        var admin = await _factory.SignInNewUser(administrator: true);
        var title = UniqueTitle();
        (await admin.Client.PostAsJsonAsync("api/Admin/AddPost", NewPost(title, "Movies"))).EnsureSuccessStatusCode();
        var post = await FindByTitle(title);

        var request = new HttpRequestMessage(HttpMethod.Delete, "api/Admin/RemovePost")
        {
            Content = JsonContent.Create(new RemovePostViewModel { postId = post.Id })
        };
        var deleted = await admin.Client.SendAsync(request);
        Assert.Equal(HttpStatusCode.OK, deleted.StatusCode);

        var reloaded = await _anonymous.GetAsync($"api/Post/GetPostById?postId={post.Id}");
        Assert.Equal(HttpStatusCode.NotFound, reloaded.StatusCode);
    }

    [Fact]
    public async Task GetPostById_ForUnknownPost_ReturnsNotFound()
    {
        var response = await _anonymous.GetAsync("api/Post/GetPostById?postId=2000000000");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetAllPostsByIndex_WithInvalidPageSize_ReturnsBadRequest()
    {
        var response = await _anonymous.GetAsync("api/Post/GetAllPostsByIndex?CurrentPage=1&index=0");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    private async Task<PostResponse> FindByTitle(string title)
    {
        var posts = await _anonymous.GetFromJsonAsync<List<PostResponse>>($"api/Post/GetPostBySearch?search={Uri.EscapeDataString(title)}&index=1");

        Assert.NotNull(posts);
        return Assert.Single(posts);
    }

    private static string UniqueTitle()
    {
        return $"post {Guid.NewGuid():N}";
    }

    private static AddPostViewModel NewPost(string title, string category)
    {
        return new AddPostViewModel
        {
            Title = title,
            Content = "Integration test content",
            Category = category,
            Image = SampleImage
        };
    }
}
