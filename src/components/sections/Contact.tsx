import QuoteForm from "./QuoteForm";
import { company, offices } from "@/lib/site";
import styles from "./Contact.module.css";
import Rise from "@/components/Rise";

// The quote form beside the direct lines and the four offices. On a phone the form comes before them.
export default function Contact() {
  return (
    <section className={`section ${styles.contact}`} id="contact" aria-labelledby="contact-title">
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.intro}>
          <Rise id="contact-title">Request a quote</Rise>
          <p className={`lead ${styles.lead}`}>
            Send a short brief, a site plan or drawings. We price design and build, BIM, landscape, artificial grass
            and specialist packages.
          </p>
        </div>

        <div className={styles.form}>
          <QuoteForm />
        </div>

        <div className={styles.details}>
          <div className={styles.direct}>
            <h3 className={styles.h3}>Or reach the Doha office</h3>
            <ul className={styles.lines}>
              <li>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </li>
              {company.phones.map((phone) => (
                <li key={phone.href}>
                  <a href={phone.href}>{phone.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.offices}>
            <h3 className={styles.h3}>Offices</h3>
            <ul className={styles.officeList}>
              {offices.map((office) => (
                <li key={office.country} className={styles.office}>
                  <span className={styles.country}>{office.country}</span>
                  <span className={styles.detail}>{office.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
