# Blog API

ASP.NET Core 8 backend for a blogging platform: user accounts with email verification, JWT authentication with rotating refresh tokens, posts, likes and comments, and an administrator area with user management and statistics.

Frontend: https://github.com/bugradaryal/Blog-React

## Stack

- .NET 8, ASP.NET Core Web API
- Entity Framework Core 8 (code-first, migrations, seed data), SQL Server
- ASP.NET Core Identity, JWT bearer authentication
- MediatR (commands, queries, pipeline behavior)
- Serilog (console and rolling file sinks)
- MailKit (SMTP)
- xUnit, WebApplicationFactory, Testcontainers (SQL Server)

## Solution layout

| Project | Responsibility |
| --- | --- |
| `Entities` | Entities with encapsulated state and behavior |
| `Dto` | Request and response models, error response shape. No dependencies |
| `Utilities` | Dependency-free helpers: token hashing and generation, claim names, confirmation email builder, settings classes |
| `Bussiness` | MediatR requests and handlers grouped by feature, repository and service interfaces, exceptions, mapping, pipeline behavior |
| `DataAccess` | `DbContext`, entity configurations, repositories, migrations, Identity stores |
| `BlogAPI` | Controllers, exception middleware, JWT and SMTP implementations, JWT bearer configuration, Serilog setup, `Program.cs` |
| `IntegrationTests` | End-to-end tests against a real SQL Server container |

Dependencies point inward: `BlogAPI` depends on `Bussiness` and `DataAccess`, `DataAccess` implements the repository interfaces declared in `Bussiness`, and `Bussiness` knows only `Entities`, `Dto` and `Utilities`. `Bussiness` has no reference to EF Core, MailKit or any JWT library; the JWT and SMTP implementations of its `ITokenService` and `IMailTransport` live in `BlogAPI/Services`.

Controllers stay thin and only send a request through `ISender`. Each use case lives in `Bussiness/Features/<Area>/` as a command or query record next to its handler.

## Design notes

- **Encapsulated entities.** State changes go through factory and behavior methods (`Post.Create`, `Post.Revise`, `User.Suspend`, `RefreshToken.Issue`). Setters are private.
- **Centralized error handling.** `ExceptionHandlingMiddleware` maps typed exceptions (`NotFoundException`, `ConflictException`, `UnauthorizedException`, ...) to a single JSON error shape with `status`, `code`, `message`, `traceId` and optional `errors`. Model validation failures use the same shape.
- **Refresh tokens.** Stored as SHA-256 hashes in their own table with an expiry (7 days by default). Every refresh deletes the used token and issues a new one, so a replayed token is rejected. Each login gets its own token, so sessions on several devices do not affect each other.
- **Current user.** User identity comes from the `uid` claim through `ICurrentUser`. Request bodies never decide who the caller is.
- **Response models.** Posts, comments and likes are returned as response DTOs, never as tracked entities. User responses do not contain password hashes or security stamps.
- **Utilities.** Pure helpers that need no framework (SHA-256 token hashing, secure token generation, the confirmation email builder) live in `Utilities`, so `Bussiness` and `BlogAPI` can both use them without depending on each other.
- **Logging.** Serilog request logging plus a MediatR behavior that records handler duration. Passwords and tokens are never logged.

## Endpoints

| Area | Method and route | Access |
| --- | --- | --- |
| Auth | `POST /api/Auth/Register` | Anonymous |
| Auth | `POST /api/Auth/SendMail` | Anonymous |
| Auth | `POST /api/Auth/Emailverification` | Anonymous |
| Auth | `POST /api/Auth/Login` | Anonymous |
| Auth | `POST /api/Auth/RefreshToken` (header `RefreshToken`) | Anonymous |
| Auth | `POST /api/Auth/ValidateToken` | Authenticated |
| User | `PUT /api/User/UpdateAccount`, `PUT /api/User/ChangePassword`, `DELETE /api/User/DeleteAccount` | Authenticated |
| Post | `GET /api/Post/GetAllPostsByIndex`, `GetPostById`, `GetPostCounts`, `GetPostBySearch` | Anonymous |
| Post | `POST /api/Post/LikeThePost`, `DislikeThePost` | Authenticated |
| Comment | `POST /api/Comment/AddCommentToPost` | Authenticated |
| Admin | `GetAllUsers`, `GiveRoleToUser`, `SuspendUser`, `AddPost`, `UpdatePost`, `RemovePost`, `DeleteCommentFromPost`, `GetAllStatistics` | Administrator |

Login returns the access token in the `Authorization` response header and the refresh token in the `RefreshToken` header.

## Configuration

`appsettings.json` contains no secrets. `JWT:Key`, `EmailSender:Email` and `EmailSender:Password` are empty and must be supplied.

Development: create `BlogAPI/appsettings.Local.json` (already in `.gitignore`, loaded only in the Development environment).

```json
{
  "JWT": { "Key": "at-least-32-characters-long-random-string" },
  "EmailSender": { "Email": "sender@example.com", "Password": "smtp-app-password" }
}
```

Production: use environment variables.

```
JWT__Key
EmailSender__Email
EmailSender__Password
ConnectionStrings__DefaultConnection
```

Other settings:

| Key | Default | Meaning |
| --- | --- | --- |
| `JWT:DurationInMinutes` | 120 | Access token lifetime |
| `JWT:RefreshTokenDays` | 7 | Refresh token lifetime (1 to 90) |
| `Client:BaseUrl` | `http://localhost:3000` | Base URL used in verification emails |
| `EmailSender:Host` / `Port` | `smtp.gmail.com` / 465 | SMTP server |

The application stops at startup with a clear message if the JWT key is missing or shorter than 32 bytes.

## Running locally

```
dotnet restore
dotnet ef database update --project DataAccess --startup-project BlogAPI
dotnet run --project BlogAPI
```

Swagger is available in the Development environment. Logs go to the console and to `BlogAPI/logs/`.

## Tests

The integration tests start a disposable SQL Server container, apply the migrations and exercise the real HTTP pipeline. Docker must be running.

```
dotnet test
```

Covered flows: register, email confirmation, login and refresh; refresh token expiry, rotation and replay; posts, likes and comments; account update, password change and deletion; administrator role changes, suspension and statistics; error response format and authorization failures. Outgoing mail is captured in memory, and the clock can be advanced in tests to check token expiry.

## Known limitations

- `SendMail` reveals whether an account exists.
- An access token stays valid until it expires, even if the account is suspended afterwards. Lower `JWT:DurationInMinutes` to shorten that window.
- Posts require an image because the column is not nullable.
