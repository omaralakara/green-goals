"use client";

import { useState, type FormEvent } from "react";
import { company, quoteAction } from "@/lib/site";
import styles from "./QuoteForm.module.css";

type Field = "name" | "email" | "company" | "location" | "brief";

const errorText: Partial<Record<Field, string>> = {
  name: "Write your name.",
  email: "Write an email address with an @, like name@company.com.",
  location: "Write the city or area of the site.",
  brief: "Write a line about the project: a villa, a fit-out, a garden, a model.",
};

// The quote request. There is no server behind this preview, so sending opens the visitor's own email app
// with the request written out. To post to a form service instead, replace the last part of onSubmit.
export default function QuoteForm() {
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (field: Field) => String(data.get(field) ?? "").trim();

    const found: Partial<Record<Field, string>> = {};
    if (!value("name")) found.name = errorText.name;
    if (!/^\S+@\S+\.\S+$/.test(value("email"))) found.email = errorText.email;
    if (!value("location")) found.location = errorText.location;
    if (!value("brief")) found.brief = errorText.brief;
    setErrors(found);

    const first = (Object.keys(found) as Field[])[0];
    if (first) {
      setSent(false);
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const body = [
      `Name: ${value("name")}`,
      `Email: ${value("email")}`,
      ...(value("company") ? [`Company: ${value("company")}`] : []),
      `Project location: ${value("location")}`,
      "",
      value("brief"),
    ].join("\n");

    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(
      `Quote request from ${value("name")}`,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  const field = (name: Field) => ({
    id: `quote-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `quote-${name}-error` : undefined,
  });

  const error = (name: Field) =>
    errors[name] ? (
      <p className={styles.error} id={`quote-${name}-error`}>
        {errors[name]}
      </p>
    ) : null;

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="quote-name">Name</label>
        <input {...field("name")} type="text" autoComplete="name" required />
        {error("name")}
      </div>

      <div className={styles.field}>
        <label htmlFor="quote-email">Email</label>
        <input {...field("email")} type="email" autoComplete="email" inputMode="email" required />
        {error("email")}
      </div>

      <div className={styles.field}>
        <label htmlFor="quote-company">
          Company <span className={styles.optional}>(optional)</span>
        </label>
        <input {...field("company")} type="text" autoComplete="organization" />
      </div>

      <div className={styles.field}>
        <label htmlFor="quote-location">Project location</label>
        <input {...field("location")} type="text" autoComplete="off" required />
        {error("location")}
      </div>

      <div className={`${styles.field} ${styles.full}`}>
        <label htmlFor="quote-brief">What you want to build</label>
        <textarea {...field("brief")} rows={5} required />
        {error("brief")}
      </div>

      <div className={`${styles.send} ${styles.full}`}>
        <button className={`button ${styles.submit}`} type="submit">
          {quoteAction.label}
        </button>
        <p className={styles.note} role="status">
          {sent
            ? `Your email app should now be open with the request. If it is not, write to ${company.email}.`
            : `Sending opens your email app with the request written out, addressed to ${company.email}.`}
        </p>
      </div>
    </form>
  );
}
