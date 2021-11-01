CREATE TABLE [UserProfile] (
  [Id] int PRIMARY KEY IDENTITY(1, 1),
  [FirstName] nvarchar(255) NOT NULL,
  [LastName] nvarchar(255) NOT NULL,
  [Email] Email NOT NULL,
  [FireBaseUserId] nvarchar(28) NOT NULL
)
GO

CREATE TABLE [Note] (
  [Id] int PRIMARY KEY IDENTITY(1, 1),
  [Title] nvarchar(255) NOT NULL,
  [Content] nvarchar(255) NOT NULL,
  [CreateDateTime] datetime NOT NULL,
  [UserId] int
)
GO

CREATE TABLE [NoteTag] (
  [Id] int PRIMARY KEY IDENTITY(1, 1),
  [NoteId] int,
  [TagId] int
)
GO

CREATE TABLE [Tag] (
  [Id] int PRIMARY KEY IDENTITY(1, 1),
  [Name] nvarchar(255) NOT NULL,
  [IconId] int
)
GO

CREATE TABLE [Icon] (
  [Id] int PRIMARY KEY IDENTITY(1, 1),
  [Name] nvarchar(255) NOT NULL,
  [ImgUrl] nvarchar(255) NOT NULL
)
GO

ALTER TABLE [Note] ADD FOREIGN KEY ([UserId]) REFERENCES [UserProfile] ([Id])
GO

ALTER TABLE [NoteTag] ADD FOREIGN KEY ([NoteId]) REFERENCES [Note] ([Id])
GO

ALTER TABLE [NoteTag] ADD FOREIGN KEY ([TagId]) REFERENCES [Tag] ([Id])
GO

ALTER TABLE [Tag] ADD FOREIGN KEY ([IconId]) REFERENCES [Icon] ([Id])
GO
