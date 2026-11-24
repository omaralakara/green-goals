import Image from "next/image";
import Wipe from "@/components/Wipe";
import port from "@/assets/doha-port.jpg";
import waldorf from "@/assets/waldorf-mashrabiya.jpg";
import { projects } from "@/lib/site";
import styles from "./Projects.module.css";
import Rise from "@/components/Rise";

// All seven projects in one table, beside photographs of the first two (neither is in the hero).
export default function Projects() {
  return (
    <section className={`section ${styles.projects}`} id="projects" aria-labelledby="projects-title">
      <div className="wrap">
        <div className={styles.head}>
          <Rise id="projects-title">Recent projects in Qatar</Rise>
          <p className={`lead ${styles.lead}`}>
            Specialist packages for Qatar&rsquo;s main contractors, and our own design and build work.
          </p>
        </div>

        <div className={styles.body}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Project</th>
                <th scope="col">What we did</th>
                <th scope="col">Our role</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.name}>
                  <th scope="row">{project.name}</th>
                  <td>{project.work}</td>
                  <td>{project.role}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.photos}>
            <figure className={styles.figure}>
              <Wipe className={styles.frame}>
                <Image
                  src={port}
                  alt="Shipping containers painted red, yellow, blue and green as shops at the Doha Port container park"
                  fill
                  sizes="(min-width: 900px) 34vw, 100vw"
                  placeholder="blur"
                />
              </Wipe>
              <figcaption className={styles.tag}>Doha Port Marina</figcaption>
            </figure>
            <figure className={styles.figure}>
              <Wipe className={styles.frame} delay={0.12}>
                <Image
                  src={waldorf}
                  alt="Gold aluminium mashrabiya panels running up the stone facade of the Waldorf Astoria tower"
                  fill
                  sizes="(min-width: 900px) 34vw, 100vw"
                  placeholder="blur"
                  style={{ objectPosition: "50% 58%" }}
                />
              </Wipe>
              <figcaption className={styles.tag}>Waldorf Astoria, West Bay</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
