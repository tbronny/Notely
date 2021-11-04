using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Notely.Repositories;
using Notely.Models;
using System.Security.Claims;

namespace Notely.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagController : ControllerBase
    {
        private readonly ITagRepository _tagRepository;
        private readonly IUserProfileRepository _userProfileRepository;

        public TagController(ITagRepository tagRepository, IUserProfileRepository userProfileRepository)
        {
            _tagRepository = tagRepository;
            _userProfileRepository = userProfileRepository;
        }
        [HttpGet]
        public IActionResult Get()
        {
            var user = GetCurrentUserProfileId();
            if (user == null)
            {
                return NotFound();
            }

            var tags = _tagRepository.Get(user.Id);

            if (tags.Count == 0)
            {
                return NoContent();
            }
            else
            {
                return Ok(tags);
            }
        }
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                var tag = _tagRepository.GetById(id);
                return Ok(tag);
            }
            catch
            {
                return BadRequest();
            }
        }
        [HttpPost]
        public IActionResult Post(Tag tag)
        {
            var user = GetCurrentUserProfileId();

            tag.UserProfileId = user.Id;
            try
            {
                _tagRepository.Add(tag);

                return CreatedAtAction("Get", new { id = tag.Id }, tag);
            }
            catch
            {
                return BadRequest();
            }
        }
        [HttpPut]
        public IActionResult Update(int id, Tag tag)
        {
            var user = GetCurrentUserProfileId();
            if (id != tag.Id)
            {
                return BadRequest();
            }
            tag.UserProfileId = user.Id;
            try
            {
                _tagRepository.Update(tag);

                return Ok(tag);
            }
            catch
            {
                return BadRequest();
            }
        }
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                _tagRepository.Delete(id);

                return NoContent();
            }
            catch
            {
                return BadRequest();
            }
        }

        private UserProfile GetCurrentUserProfileId()
        {
            var firebaseUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return _userProfileRepository.GetByFirebaseUserId(firebaseUserId);
        }
    }
}
