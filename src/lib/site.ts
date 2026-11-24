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
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Artificial grass", href: "#turf" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
];

export const mainAction = { label: "Request a quote", href: "#contact" };
export const secondAction = { label: "See our projects", href: "#projects" };

// Every project in the table, in the order shown.
export const projects = [
  { name: "Doha Port Marina", work: "Structural BIM for the marina and container park", role: "With Al Jaber" },
  { name: "Waldorf Astoria, West Bay", work: "Aluminium mashrabiya, drainage and paint repairs", role: "With Harinsa" },
  { name: "Doha Metro, Gold Line", work: "Structural steel for the lifts at seven stations", role: "With Imar" },
  { name: "Qetaifan Island North", work: "Roof steelwork and aluminium details", role: "With Al Jaber" },
  { name: "PPP Schools, Package 1", work: "FIFA-quality turf, Carrara granite and landscaping", role: "With Al Jaber" },
  { name: "Birkat Al Awamer", work: "Warehouse design, steel structure and fireproofing", role: "Main contractor" },
  { name: "Private villas, Al Mashaf", work: "Design and build, with the interiors and MEP", role: "Main contractor" },
];

export const offices = [
  { country: "Qatar", detail: "Doha, head office" },
  { country: "Saudi Arabia", detail: "Contracting and BIM" },
  { country: "United Arab Emirates", detail: "Abu Dhabi branch" },
  { country: "Lebanon", detail: "Zgharta, engineering consulting" },
];
