using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Notely.Models
{
    public class NoteTag
    {
        public int Id { get; set; }

        public int NoteId { get; set; }

        public int TagId { get; set; }
    }
}
