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

        public List<Note> GetAll(string firebaseUserId)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                       SELECT n.Id, n.Title, n.Content,
                              n.CreateDateTime, n.PublishDateTime, n.UserProfileId,
                              u.FirstName, u.LastName, u.Email, u.FirebaseUserId
                         FROM Note n
                              LEFT JOIN UserProfile u ON n.UserProfileId = u.id
                        WHERE u.FirebaseUserId = @FirebaseUserId
                        ORDER BY n.CreateDateTime DESC";

                    DbUtils.AddParameter(cmd, "@FirebaseUserId", firebaseUserId);
                    var reader = cmd.ExecuteReader();

                    var notes = new List<Note>();

                    while (reader.Read())
                    {
                        notes.Add(NewNoteFromReader(reader));
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
                            SELECT n.Id, n.Title, n.Content, n.CreateDateTime, n.PublishDateTime, 
                                n.UserProfileId, u.Id [UserProfileId], u.FirstName, u.LastName, u.Email
                            FROM Note n
                            LEFT JOIN [UserProfile] u ON n.UserProfileId = u.Id 
                            WHERE u.FirebaseUserId = @FirebaseUserId 
                                AND n.CreateDateTime >= @startDate AND n.CreateDateTime <= @endDate";

                    DbUtils.AddParameter(cmd, "@FirebaseUserId", firebaseUserId);
                    DbUtils.AddParameter(cmd, "@startDate", startDate);
                    DbUtils.AddParameter(cmd, "@endDate", endDate);
                    var reader = cmd.ExecuteReader();

                    var notes = new List<Note>();

                    while (reader.Read())
                    {
                        notes.Add(NewNoteFromReader(reader));
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
                              u.FirstName, u.LastName, u.Email
                         FROM Note n
                              LEFT JOIN UserProfile u ON n.UserProfileId = u.id
                        WHERE n.Id = @id
                        ";

                    DbUtils.AddParameter(cmd, "@id", id);
                    var reader = cmd.ExecuteReader();

                    Note note = null;

                    if (reader.Read())
                    {
                        note = (NewNoteFromReader(reader));
                    }

                    reader.Close();

                    return note;
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
                }

            };
            return note;
        }
    }
}
   
