using Notely.Models;
using System;
using System.Collections.Generic;

namespace Notely.Repositories
{
    public interface INoteRepository
    {
        List<Note> GetAll(int id);
        List<Note> GetAllByDateRange(string firebaseUserId, DateTime startDate, DateTime endDate);
        List<Note> GetAllByTagId(int userId, int tagId);
        List<Note> GetAllUntagged(int userId);
        Note GetById(int id);
        NoteTag GetIdOfNoteTag(int noteId, int tagId);
        void AddTagToNote(int noteId, int tagId);
        void DeleteTagFromNote(int id);
        void Add(Note note);
        void Update(Note note);
        void Delete(int id);
        List<Note> Search(int userId, string criterion);
    }
}