using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Notely.Models;
using Notely.Utils;
using Microsoft.Data.SqlClient;

namespace Notely.Repositories
{
    public class NoteRepository : BaseRepository, INoteRepository
    {
        public NoteRepository(IConfiguration configuration) : base(configuration) { }

        public List<Note> GetAll(int id)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                       SELECT n.Id [NoteId], n.Title, n.Content,
                            n.CreateDateTime, n.PublishDateTime, n.UserProfileId,
                            u.FirstName, u.LastName, u.Email, 
                            t.Id [TagId], t.[Name], t.UserProfileId,
                            nt.NoteId [NoteTagNoteId], nt.TagId [NoteTagId]
                         FROM Note n
                            LEFT JOIN UserProfile u ON n.UserProfileId = u.id
                            LEFT JOIN NoteTag nt ON n.Id = nt.NoteId
                            LEFT JOIN Tag t On nt.TagId = t.Id
                        WHERE u.Id = @UserProfileId
                        ORDER BY n.CreateDateTime DESC";

                    DbUtils.AddParameter(cmd, "@UserProfileId", id);
                    var reader = cmd.ExecuteReader();

                    var notes = new List<Note>();

                    while (reader.Read())
                    {
                        var noteId = reader.GetInt32(reader.GetOrdinal("NoteId"));
                        var existingNote = notes.FirstOrDefault(n => n.Id == noteId);

                        if (existingNote == null)
                        {
                            existingNote = new Note()
                            {
                                Id = noteId,
                                Title = reader.GetString(reader.GetOrdinal("Title")),
                                Content = reader.GetString(reader.GetOrdinal("Content")),
                                CreateDateTime = reader.GetDateTime(reader.GetOrdinal("CreateDateTime")),
                                PublishDateTime = (DateTime)DbUtils.GetNullableDateTime(reader, "PublishDateTime"),

                                UserProfileId = reader.GetInt32(reader.GetOrdinal("UserProfileId")),
                                UserProfile = new UserProfile()
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("UserProfileId")),
                                    FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                                    LastName = reader.GetString(reader.GetOrdinal("LastName")),
                                    Email = reader.GetString(reader.GetOrdinal("Email")),
                                },
                                Tags = new List<Tag>()
                            };

                            notes.Add(existingNote);
                        }
                        if (DbUtils.IsNotDbNull(reader, "Name"))
                        {
                            existingNote.Tags.Add(new Tag()
                            {
                                Id = DbUtils.GetInt(reader, "TagId"),
                                Name = DbUtils.GetString(reader, "Name")
                            });
                        }

                    }
                    reader.Close();

                    return notes;
                }
            }
        }



        public List<Note> GetAllByDateRange(string firebaseUserId, DateTime startDate, DateTime endDate)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                            SELECT n.Id [NoteId], n.Title, n.Content,
                            n.CreateDateTime, n.PublishDateTime, n.UserProfileId,
                            u.FirstName, u.LastName, u.Email, 
                            t.Id [TagId], t.[Name], t.UserProfileId,
                            nt.NoteId [NoteTagNoteId], nt.TagId [NoteTagId]
                         FROM Note n
                            LEFT JOIN UserProfile u ON n.UserProfileId = u.id
                            LEFT JOIN NoteTag nt ON n.Id = nt.NoteId
                            LEFT JOIN Tag t On nt.TagId = t.Id
                            WHERE u.FirebaseUserId = @FirebaseUserId 
                                AND n.CreateDateTime >= @startDate AND n.CreateDateTime <= @endDate";

                    DbUtils.AddParameter(cmd, "@FirebaseUserId", firebaseUserId);
                    DbUtils.AddParameter(cmd, "@startDate", startDate);
                    DbUtils.AddParameter(cmd, "@endDate", endDate);
                    var reader = cmd.ExecuteReader();

                    var notes = new List<Note>();

                    while (reader.Read())
                    {
                        var noteId = reader.GetInt32(reader.GetOrdinal("NoteId"));
                        var existingNote = notes.FirstOrDefault(n => n.Id == noteId);

                        if (existingNote == null)
                        {
                            existingNote = new Note()
                            {
                                Id = noteId,
                                Title = reader.GetString(reader.GetOrdinal("Title")),
                                Content = reader.GetString(reader.GetOrdinal("Content")),
                                CreateDateTime = reader.GetDateTime(reader.GetOrdinal("CreateDateTime")),
                                PublishDateTime = (DateTime)DbUtils.GetNullableDateTime(reader, "PublishDateTime"),

                                UserProfileId = reader.GetInt32(reader.GetOrdinal("UserProfileId")),
                                UserProfile = new UserProfile()
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("UserProfileId")),
                                    FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                                    LastName = reader.GetString(reader.GetOrdinal("LastName")),
                                    Email = reader.GetString(reader.GetOrdinal("Email")),
                                },
                                Tags = new List<Tag>()
                            };

                            notes.Add(existingNote);
                        }
                        if (DbUtils.IsNotDbNull(reader, "Name"))
                        {
                            existingNote.Tags.Add(new Tag()
                            {
                                Id = DbUtils.GetInt(reader, "TagId"),
                                Name = DbUtils.GetString(reader, "Name")
                            });
                        }

                    }

                    reader.Close();

                    return notes;
                }
            }
        }

        public List<Note> GetAllByTagId(int userId, int tagId)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                       SELECT n.Id, n.Title, n.Content,
                              n.CreateDateTime, n.PublishDateTime, n.UserProfileId,
                              u.FirstName, u.LastName, u.Email, 
                              t.Id, t.[Name], nt.NoteId, nt.TagId
                         FROM Note n
                              LEFT JOIN UserProfile u ON n.UserProfileId = u.id
                                LEFT JOIN NoteTag nt ON n.Id = nt.NoteId
                                LEFT JOIN Tag t On nt.TagId = t.Id
                        WHERE u.Id = @UserProfileId AND nt.TagId = @TagId
                        ORDER BY n.CreateDateTime DESC";

                    DbUtils.AddParameter(cmd, "@UserProfileId", userId);
                    DbUtils.AddParameter(cmd, "@TagId", tagId);
                    var reader = cmd.ExecuteReader();

                    var notes = new List<Note>();

                    while (reader.Read())
                    {
                        var noteId = reader.GetInt32(reader.GetOrdinal("Id"));
                        var existingNote = notes.FirstOrDefault(n => n.Id == noteId);

                        if (existingNote == null)
                        {
                            existingNote = new Note()
                            {
                                Id = noteId,
                                Title = reader.GetString(reader.GetOrdinal("Title")),
                                Content = reader.GetString(reader.GetOrdinal("Content")),
                                CreateDateTime = reader.GetDateTime(reader.GetOrdinal("CreateDateTime")),
                                PublishDateTime = (DateTime)DbUtils.GetNullableDateTime(reader, "PublishDateTime"),

                                UserProfileId = reader.GetInt32(reader.GetOrdinal("UserProfileId")),
                                UserProfile = new UserProfile()
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("UserProfileId")),
                                    FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                                    LastName = reader.GetString(reader.GetOrdinal("LastName")),
                                    Email = reader.GetString(reader.GetOrdinal("Email")),
                                },
                                Tags = new List<Tag>()
                            };

                            notes.Add(existingNote);
                        }
                        if (DbUtils.IsNotDbNull(reader, "Name"))
                        {
                            existingNote.Tags.Add(new Tag()
                            {
                                Name = DbUtils.GetString(reader, "Name")
                            });
                        }

                    }

                    reader.Close();

                    return notes;
                }
            }
        }

        public List<Note> GetAllUntagged(int userId)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                       SELECT n.Id, n.Title, n.Content,
                              n.CreateDateTime, n.PublishDateTime, n.UserProfileId,
                              u.FirstName, u.LastName, u.Email, 
                              t.Id, t.[Name], nt.NoteId, nt.TagId
                         FROM Note n
                              LEFT JOIN UserProfile u ON n.UserProfileId = u.id
                                LEFT JOIN NoteTag nt ON n.Id = nt.NoteId
                                LEFT JOIN Tag t On nt.TagId = t.Id
                        WHERE u.Id = @UserProfileId AND nt.TagId IS NULL
                        ORDER BY n.CreateDateTime DESC";

                    DbUtils.AddParameter(cmd, "@UserProfileId", userId);
                    var reader = cmd.ExecuteReader();

                    var notes = new List<Note>();

                    while (reader.Read())
                    {
                        var noteId = reader.GetInt32(reader.GetOrdinal("Id"));
                        var existingNote = notes.FirstOrDefault(n => n.Id == noteId);

                        if (existingNote == null)
                        {
                            existingNote = new Note()
                            {
                                Id = noteId,
                                Title = reader.GetString(reader.GetOrdinal("Title")),
                                Content = reader.GetString(reader.GetOrdinal("Content")),
                                CreateDateTime = reader.GetDateTime(reader.GetOrdinal("CreateDateTime")),
                                PublishDateTime = (DateTime)DbUtils.GetNullableDateTime(reader, "PublishDateTime"),

                                UserProfileId = reader.GetInt32(reader.GetOrdinal("UserProfileId")),
                                UserProfile = new UserProfile()
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("UserProfileId")),
                                    FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                                    LastName = reader.GetString(reader.GetOrdinal("LastName")),
                                    Email = reader.GetString(reader.GetOrdinal("Email")),
                                },
                                Tags = new List<Tag>()
                            };

                            notes.Add(existingNote);
                        }

                        if (DbUtils.IsNotDbNull(reader, "Name"))
                        {
                            existingNote.Tags.Add(new Tag()
                            {
                                Name = DbUtils.GetString(reader, "Name")
                            });
                        }

                    }

                    reader.Close();

                    return notes;
                }
            }
        }

        public Note GetById(int id)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                       SELECT n.Id, n.Title, n.Content, 
                              n.CreateDateTime, n.PublishDateTime, n.UserProfileId,
                              u.FirstName, u.LastName, u.Email, t.[Name], nt.Id [NoteTagId]
                         FROM Note n
                              LEFT JOIN UserProfile u ON n.UserProfileId = u.id
                                LEFT JOIN NoteTag nt ON n.Id = nt.NoteId
                                LEFT JOIN Tag t On nt.TagId = t.Id
                        WHERE n.Id = @id";

                    DbUtils.AddParameter(cmd, "@id", id);
                    var reader = cmd.ExecuteReader();

                    Note note = null;

                    while (reader.Read())
                    {
                        if (note == null)
                        {
                            note = (NewNoteFromReader(reader));

                        }

                        if(DbUtils.IsNotDbNull(reader, "Name"))
                        {
                            note.Tags.Add(new Tag
                            {
                                Name = DbUtils.GetString(reader, "Name")
                            });
                        }
                    }

                    reader.Close();

                    return note;
                }
            }
        }

        public NoteTag GetIdOfNoteTag(int noteId, int tagId)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                       SELECT nt.Id 
                        FROM NoteTag nt
                        WHERE nt.TagId = @TagId AND nt.NoteId = @NoteId  ";

                    DbUtils.AddParameter(cmd, "@TagId", tagId);
                    DbUtils.AddParameter(cmd, "@NoteId", noteId);
                    var reader = cmd.ExecuteReader();

                    NoteTag noteTag = null;

                    if (reader.Read())
                    {
                        noteTag = new NoteTag()
                        {
                            Id = DbUtils.GetInt(reader, "Id")
                        };
                    };

                    reader.Close();

                    return noteTag;
                }
            }
        }

        public void AddTagToNote(int noteId, int tagId)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        INSERT INTO NoteTag (NoteId, TagId)
                        OUTPUT INSERTED.ID VALUES (@NoteId, @TagId)
                        ";

                    DbUtils.AddParameter(cmd, "@NoteId", noteId);
                    DbUtils.AddParameter(cmd, "@TagId", tagId);

                    cmd.ExecuteScalar();

                }
            }
        }

        public void DeleteTagFromNote(int id)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "DELETE FROM NoteTag WHERE Id = @Id";
                    DbUtils.AddParameter(cmd, "@Id", id);
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void Add(Note note)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                       INSERT INTO Note (
                              Title, Content, 
                              CreateDateTime, PublishDateTime, UserProfileId)
                    OUTPUT INSERTED.ID VALUES (@title, @content, SYSDATETIME(), @publishDateTime, @userProfileId)
                        ";

                    DbUtils.AddParameter(cmd, "@title", note.Title);
                    DbUtils.AddParameter(cmd, "@content", note.Content);
                    DbUtils.AddParameter(cmd, "@publishDateTime", DbUtils.ValueOrDBNull(note.PublishDateTime));
                    DbUtils.AddParameter(cmd, "@userProfileId", note.UserProfileId);

                    note.Id = (int)cmd.ExecuteScalar();

                }
            }
        }

        public void Update(Note note)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        UPDATE Note
                           SET Title = @Title,
                               Content = @Content,
                               CreateDateTime = @CreateDateTime,
                               PublishDateTime = @PublishDateTime,
                               UserProfileId = @UserProfileId
                         WHERE Id = @Id";

                    DbUtils.AddParameter(cmd, "@Id", note.Id);
                    DbUtils.AddParameter(cmd, "@Title", note.Title);
                    DbUtils.AddParameter(cmd, "@Content", note.Content);
                    DbUtils.AddParameter(cmd, "@CreateDateTime", note.CreateDateTime);
                    DbUtils.AddParameter(cmd, "@PublishDateTime", note.PublishDateTime);
                    DbUtils.AddParameter(cmd, "@UserProfileId", note.UserProfileId);

                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void Delete(int id)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "DELETE FROM Note WHERE Id = @Id";
                    DbUtils.AddParameter(cmd, "@id", id);
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public List<Note> Search(string criterion)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    var sql = @"
                        SELECT n.Id [NoteId], n.Title, n.Content,
                            n.CreateDateTime, n.PublishDateTime, n.UserProfileId,
                            u.FirstName, u.LastName, u.Email, 
                            t.Id [TagId], t.[Name], t.UserProfileId,
                            nt.NoteId [NoteTagNoteId], nt.TagId [NoteTagId]
                         FROM Note n
                            LEFT JOIN UserProfile u ON n.UserProfileId = u.id
                            LEFT JOIN NoteTag nt ON n.Id = nt.NoteId
                            LEFT JOIN Tag t On nt.TagId = t.Id
                        WHERE n.Title LIKE @Criterion OR n.Content LIKE @Criterion";

                    cmd.CommandText = sql;
                    DbUtils.AddParameter(cmd, "@Criterion", $"%{criterion}%");
                    var reader = cmd.ExecuteReader();

                    var notes = new List<Note>();

                    while (reader.Read())
                    {
                        var noteId = reader.GetInt32(reader.GetOrdinal("NoteId"));
                        var existingNote = notes.FirstOrDefault(n => n.Id == noteId);

                        if (existingNote == null)
                        {
                            existingNote = new Note()
                            {
                                Id = noteId,
                                Title = reader.GetString(reader.GetOrdinal("Title")),
                                Content = reader.GetString(reader.GetOrdinal("Content")),
                                CreateDateTime = reader.GetDateTime(reader.GetOrdinal("CreateDateTime")),
                                PublishDateTime = (DateTime)DbUtils.GetNullableDateTime(reader, "PublishDateTime"),

                                UserProfileId = reader.GetInt32(reader.GetOrdinal("UserProfileId")),
                                UserProfile = new UserProfile()
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("UserProfileId")),
                                    FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                                    LastName = reader.GetString(reader.GetOrdinal("LastName")),
                                    Email = reader.GetString(reader.GetOrdinal("Email")),
                                },
                                Tags = new List<Tag>()
                            };

                            notes.Add(existingNote);
                        }
                        if (DbUtils.IsNotDbNull(reader, "Name"))
                        {
                            existingNote.Tags.Add(new Tag()
                            {
                                Id = DbUtils.GetInt(reader, "TagId"),
                                Name = DbUtils.GetString(reader, "Name")
                            });
                        }

                    }

                    reader.Close();

                    return notes;
                }
            }
        }


        private Note NewNoteFromReader(SqlDataReader reader)
        {
            Note note = new Note()
            {
                Id = reader.GetInt32(reader.GetOrdinal("Id")),
                Title = reader.GetString(reader.GetOrdinal("Title")),
                Content = reader.GetString(reader.GetOrdinal("Content")),
                CreateDateTime = reader.GetDateTime(reader.GetOrdinal("CreateDateTime")),
                PublishDateTime = (DateTime)DbUtils.GetNullableDateTime(reader, "PublishDateTime"),

                UserProfileId = reader.GetInt32(reader.GetOrdinal("UserProfileId")),
                UserProfile = new UserProfile()
                {
                    Id = reader.GetInt32(reader.GetOrdinal("UserProfileId")),
                    FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                    LastName = reader.GetString(reader.GetOrdinal("LastName")),
                    Email = reader.GetString(reader.GetOrdinal("Email")),
                },
                Tags = new List<Tag>()


            };
            return note;
        }
    }
}
   
