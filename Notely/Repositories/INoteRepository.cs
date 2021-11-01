using Notely.Models;
using System;
using System.Collections.Generic;

namespace Notely.Repositories
{
    public interface INoteRepository
    {
        List<Note> GetAll(string firebaseUserId);
        List<Note> GetAllByDateRange(string firebaseUserId, DateTime startDate, DateTime endDate);
        Note GetById(int id);
        void Add(Note note);
        void Update(Note note);
        void Delete(int id);
    }
}