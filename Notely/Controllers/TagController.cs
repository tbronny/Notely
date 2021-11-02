using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Notely.Repositories;
using Notely.Models;

namespace Notely.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagController : ControllerBase
    {
        private readonly ITagRepository _tagRepository;

        public TagController(ITagRepository tagRepository)
        {
            _tagRepository = tagRepository;
        }
        [HttpGet]
        public IActionResult Get()
        {
            var tags = _tagRepository.Get();

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
        public IActionResult Update(Tag tag)
        {
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
    }
}
