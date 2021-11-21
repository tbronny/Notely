using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Notely.Models;
using Notely.Repositories;
using System.Security.Claims;

namespace Notely.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteController : ControllerBase
    {
        private readonly INoteRepository _noteRepository;
        private readonly IUserProfileRepository _userProfileRepository;

        public NoteController(INoteRepository noteRepository, IUserProfileRepository userProfileRepository)
        {
            _noteRepository = noteRepository;
            _userProfileRepository = userProfileRepository;
        }

        //https://localhost:5001/api/note/
        [HttpGet]
        public IActionResult GetAll()
        {
            var user = GetCurrentUserProfileId();
            if (user == null)
            {
                return NotFound();
            }

            var notes = _noteRepository.GetAll(user.Id);
            return Ok(notes);
        }

        [HttpGet("GetAllUntagged")]
        public IActionResult GetAllUntagged()
        {
            var user = GetCurrentUserProfileId();
            if (user == null)
            {
                return NotFound();
            }

            var notes = _noteRepository.GetAllUntagged(user.Id);
            return Ok(notes);
        }

        [HttpGet("GetByTag/{tagId}")]
        public IActionResult GetAllByTagId(int tagId)
        {
            var user = GetCurrentUserProfileId();
            if (user == null)
            {
                return NotFound();
            }

            var notes = _noteRepository.GetAllByTagId(user.Id, tagId);
            return Ok(notes);
        }

        [HttpGet("GetByMonth")]
        public IActionResult GetByMonth()
        {
            int month = DateTime.Now.Month;
            int year = DateTime.Now.Year;
            int day = DateTime.Now.Day;
            int hour = DateTime.Now.Hour;
            int minute = DateTime.Now.Minute;
            int second = DateTime.Now.Second;
            var endDate = new DateTime(year, month, day, hour, minute, second);
            var startDate = endDate.AddDays(-30);

            var user = GetCurrentUserProfileId();
            if (user == null)
            {
                return NotFound();
            }

            var getByDates = _noteRepository.GetAllByDateRange(user.FirebaseUserId, startDate, endDate);

            return Ok(getByDates);
        }

        [HttpGet("GetToday")]
        public IActionResult GetToday()
        {
            int month = DateTime.Now.Month;
            int year = DateTime.Now.Year;
            int day = DateTime.Now.Day;
            int hour = DateTime.Now.Hour;
            int minute = DateTime.Now.Minute;
            int second = DateTime.Now.Second;
            var endDate = new DateTime(year, month, day, hour, minute, second);
            var startDate = new DateTime(year, month, day);

            var user = GetCurrentUserProfileId();
            if (user == null)
            {
                return NotFound();
            }

            var getByDates = _noteRepository.GetAllByDateRange(user.FirebaseUserId, startDate, endDate);

            return Ok(getByDates);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var note = _noteRepository.GetById(id);
            if (note == null)
            {
                return NotFound();
            }
            return Ok(note);
        }

        [HttpPost("AddTagToNote")]
        public IActionResult AddTagToNote(NoteTag noteTag)
        {
            _noteRepository.AddTagToNote(noteTag.NoteId, noteTag.TagId);
            return Ok();
        }

        [HttpDelete("DeleteTagFromNote/{noteId}/{tagId}")]
        public IActionResult DeleteNoteTag(int noteId, int tagId)
        {

            var matchingNoteTag = _noteRepository.GetIdOfNoteTag(noteId, tagId);
            
            _noteRepository.DeleteTagFromNote(matchingNoteTag.Id);
            return NoContent();
        }

        [HttpPost]
        public IActionResult Post(Note note)
        {
            var currentUser = GetCurrentUserProfileId();

            note.UserProfileId = currentUser.Id;
            note.PublishDateTime = DateTime.Now;

            _noteRepository.Add(note);
            return CreatedAtAction("Get", new { id = note.Id }, note);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, Note note)
        {
            var currentUser = GetCurrentUserProfileId();
            if (id != note.Id)
            {
                return BadRequest();
            }
            note.UserProfileId = currentUser.Id;
            note.CreateDateTime = DateTime.Now;
            note.PublishDateTime = DateTime.Now;

            _noteRepository.Update(note);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _noteRepository.Delete(id);
            return NoContent();
        }

        [HttpGet("search")]
        public IActionResult Search(string q)
        {
            var currentUser = GetCurrentUserProfileId();
            return Ok(_noteRepository.Search(currentUser.Id, q));
        }

        private UserProfile GetCurrentUserProfileId()
        {
            var firebaseUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return _userProfileRepository.GetByFirebaseUserId(firebaseUserId);
        }
    }
}
