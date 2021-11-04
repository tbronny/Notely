using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Notely.Utils;
using Notely.Models;

namespace Notely.Repositories
{
    public class TagRepository : BaseRepository, ITagRepository
    {
        public TagRepository(IConfiguration configuration) : base(configuration) { }
        public List<Tag> Get(int userProfileId)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"SELECT t.Id, t.Name, t.UserProfileId, 
                                            up.Id [UserProfileId], up.FirstName, up.LastName, up.Email 
                                        FROM Tag t
                                        LEFT JOIN UserProfile up ON t.UserProfileId = up.Id
                                        WHERE up.Id = @Id 
                                       ORDER BY Name";

                    DbUtils.AddParameter(cmd, "@Id", userProfileId);
                    var tags = new List<Tag>();

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var tag = new Tag
                            {
                                Id = DbUtils.GetInt(reader, "Id"),
                                Name = DbUtils.GetString(reader, "Name"),
                                UserProfileId = DbUtils.GetInt(reader, "UserProfileId"),
                                UserProfile = new UserProfile()
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("UserProfileId")),
                                    FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                                    LastName = reader.GetString(reader.GetOrdinal("LastName")),
                                    Email = reader.GetString(reader.GetOrdinal("Email")),
                                },
                            };
                            tags.Add(tag);
                        }

                    }
                    return tags;
                }
            }
        }
        public Tag GetById(int id)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"SELECT * FROM Tag
                                        WHERE Id = @id";
                    DbUtils.AddParameter(cmd, "@id", id);
                    Tag tag = null;
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            tag = new Tag 
                            { 
                                Id = id, 
                                Name = DbUtils.GetString(reader, "Name"),
                                UserProfileId = DbUtils.GetInt(reader, "UserProfileId"),
                                UserProfile = new UserProfile()
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("UserProfileId")),
                                    FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                                    LastName = reader.GetString(reader.GetOrdinal("LastName")),
                                    Email = reader.GetString(reader.GetOrdinal("Email")),
                                },
                            };
                        }
                    }
                    return tag;
                }
            }
        }
        public void Add(Tag tag)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"INSERT INTO Tag (Name, UserProfileId)
                                        OUTPUT INSERTED.Id
                                        VALUES (@Name, @UserProfileId)";

                    DbUtils.AddParameter(cmd, "@Name", tag.Name);
                    DbUtils.AddParameter(cmd, "@UserProfileId", tag.UserProfileId);

                    tag.Id = (int)cmd.ExecuteScalar();
                }
            }
        }

        public void Update(Tag tag)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"UPDATE TAG SET Name = @Name, UserProfileId = @UserProfileId WHERE Id = @id";

                    DbUtils.AddParameter(cmd, "@UserProfileId", tag.UserProfileId);
                    DbUtils.AddParameter(cmd, "@Name", tag.Name);
                    DbUtils.AddParameter(cmd, "@id", tag.Id);

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
                    cmd.CommandText = @"DELETE FROM TAG
                                        WHERE Id = @id";
                    DbUtils.AddParameter(cmd, "id", id);

                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}
