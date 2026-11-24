import Image, { type StaticImageData } from "next/image";
import Wipe from "@/components/Wipe";
import saadeh from "@/assets/team-saadeh.jpg";
import sami from "@/assets/team-sami.jpg";
import hawari from "@/assets/team-hawari.jpg";
import kert from "@/assets/team-kert.jpg";
import styles from "./Team.module.css";
import Rise from "@/components/Rise";

type Person = { name: string; role: string; text: string; image: StaticImageData; alt: string; position: string };

const people: Person[] = [
  {
    name: "Mustafa Abdul Aziz Saadeh",
    role: "Founder and general manager",
    text: "Runs Green Goals from Doha, with more than 20 years in construction.",
    image: saadeh,
    alt: "Mustafa Abdul Aziz Saadeh at his desk in the Doha office",
    position: "50% 30%",
  },
  {
    name: "Eng. Amer Sami",
    role: "Project manager, Qatar",
    text: "Coordinates the trades on site and keeps projects on time and within budget.",
    image: sami,
    alt: "Eng. Amer Sami",
    position: "78% 50%",
  },
  {
    name: "Arch. Ahmad Hawari",
    role: "Architect",
    text: "Designs homes and private villas. Studied architectural engineering at the Lebanese University.",
    image: hawari,
    alt: "Arch. Ahmad Hawari holding a white hard hat",
    position: "50% 20%",
  },
  {
    name: "Eng. Ahmad Ali Kert",
    role: "Manager, Abu Dhabi branch",
    text: "Leads the UAE office, with more than 25 years in construction across the region.",
    image: kert,
    alt: "Eng. Ahmad Ali Kert",
    position: "50% 40%",
  },
];

// Four people, all on screen at once. The portraits open one after another as the row scrolls into view.
export default function Team() {
  return (
    <section className={`section ${styles.team}`} id="team" aria-labelledby="team-title">
      <div className="wrap">
        <div className={styles.head}>
          <Rise id="team-title">The people who run your project</Rise>
          <p className={`lead ${styles.lead}`}>
            Four of the people behind Green Goals, from the founder to the engineers on site.
          </p>
        </div>

        <ul className={styles.people}>
          {people.map((person, i) => (
            <li key={person.name} className={styles.person}>
              <Wipe className={styles.portrait} from="bottom" delay={i * 0.1}>
                <Image
                  src={person.image}
                  alt={person.alt}
                  fill
                  sizes="(min-width: 900px) 24vw, (min-width: 560px) 46vw, 120px"
                  placeholder="blur"
                  style={{ objectPosition: person.position }}
                />
              </Wipe>
              <div className={styles.about}>
                <h3 className={styles.name}>{person.name}</h3>
                <p className={styles.role}>{person.role}</p>
                <p className={styles.text}>{person.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
