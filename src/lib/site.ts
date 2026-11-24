// All the words on the homepage that are facts about the company. They come from green-goals.com and its company profile.

export const company = {
  name: "Green Goals",
  legalName: "Green Goals Trading and Contracting",
  email: "info@green-goals.com",
  phones: [
    { label: "+974 5058 3239", href: "tel:+97450583239" },
    { label: "+974 4460 2997", href: "tel:+97444602997" },
  ],
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Artificial grass", href: "#turf" },
  { label: "Team", href: "#team" },
];

// The button in the header.
export const contactAction = { label: "Contact us", href: "#contact" };
// The button in the hero.
export const projectsAction = { label: "See our projects", href: "#projects" };
// The name of the form at the foot of the page, and of its button. It is used nowhere else.
export const quoteAction = { label: "Request a quote", href: "#contact" };

// Every project in the table, in the order shown. Each row is a slide of the company profile on green-goals.com:
// the project, the scope of work and the main contractor are taken from that slide.
export const projects = [
  { name: "Doha Port Marina", work: "Structural BIM for the marina and container park", role: "Al Jaber" },
  { name: "Waldorf Astoria, West Bay", work: "Aluminium mashrabiya, drainage and paint repairs", role: "Harinsa" },
  { name: "Doha Metro, Gold Line", work: "Structural steel for the lifts at seven stations", role: "Imar" },
  { name: "Qetaifan Island North", work: "Roof steelwork and aluminium details", role: "Al Jaber" },
  { name: "PPP Schools, Package 1", work: "FIFA-quality turf, Carrara granite and landscaping", role: "Al Jaber" },
  { name: "Birkat Al Awamer", work: "Warehouse design, steel structure and fireproofing", role: "Green Goals" },
  { name: "Private villa, Al Mashaf", work: "Design and build, with the interiors and MEP", role: "Green Goals" },
];

export const offices = [
  { country: "Qatar", detail: "Doha, head office" },
  { country: "Saudi Arabia", detail: "Contracting and BIM" },
  { country: "United Arab Emirates", detail: "Abu Dhabi branch" },
  { country: "Lebanon", detail: "Zgharta, engineering consulting" },
];
