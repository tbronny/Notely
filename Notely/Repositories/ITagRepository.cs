using Notely.Models;
using System.Collections.Generic;

namespace Notely.Repositories
{
    public interface ITagRepository
    {
        void Add(Tag tag);
        void Delete(int id);
        List<Tag> Get();
        Tag GetById(int id);
        void Update(Tag tag);
    }
}