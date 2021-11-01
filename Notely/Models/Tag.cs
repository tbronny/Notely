using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Notely.Models
{
    public class Tag
    {
        public int Id { get; set; }
        
        public string Name { get; set; }

        public int IconId { get; set; }

        public Icon Icon { get; set; }
    }
}
