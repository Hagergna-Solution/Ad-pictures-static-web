"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  COURSES,
  COURSE_WEEKS,
  EQUIPMENT_OPTIONS,
  EXPERIENCE_OPTIONS,
  HEARD_FROM_OPTIONS,
  SCHEDULE_OPTIONS,
} from "@/lib/content";
import {
  registerForCourse,
  registrationEnabled,
  RegistrationError,
  type CourseRegistrationResult,
} from "@/lib/api";
import { waLink } from "@/lib/whatsapp";
import { ArrowIcon, WhatsAppIcon } from "./icons";

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

type Values = {
  courses: string[];
  fullName: string;
  phone: string;
  email: string;
  experience: string;
  equipment: string[];
  preferredSchedule: string;
  heardFrom: string;
  message: string;
};

type Errors = Partial<Record<keyof Values | "form", string>>;

const EMPTY: Values = {
  courses: [],
  fullName: "",
  phone: "",
  email: "",
  experience: "none",
  equipment: [],
  preferredSchedule: "",
  heardFrom: "",
  message: "",
};

/** Same rules as the backend: Ethiopian numbers as people type them, others with +code. */
function normalizePhone(raw: string): string | null {
  let s = raw.trim().replace(/[\s().-]/g, "");
  if (s.startsWith("00")) s = `+${s.slice(2)}`;
  if (/^251\d{9}$/.test(s)) s = `+${s}`;
  else if (/^0[79]\d{8}$/.test(s)) s = `+251${s.slice(1)}`;
  else if (/^[79]\d{8}$/.test(s)) s = `+251${s}`;
  return /^\+[1-9]\d{6,14}$/.test(s) ? s : null;
}

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.courses.length === 0) e.courses = "Choose at least one masterclass.";
  if (v.fullName.trim().length < 2) e.fullName = "Enter your full name.";
  if (!normalizePhone(v.phone)) e.phone = "Enter a valid phone number, e.g. 0911 223344 or +251 911 223344.";
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Check the email address, or leave it empty.";
  return e;
}

function courseName(code: string): string {
  return COURSES.find((c) => c.code === code)?.name ?? code;
}

/** "A", "A and B", "A, B and C" */
function joinNames(names: string[]): string {
  return names.length <= 1 ? (names[0] ?? "") : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

function whatsappMessage(v: Values): string {
  const picked = v.courses.length ? joinNames(v.courses.map(courseName)) : "your";
  const lines = [`Hi AD Pictures, I would like to register for the ${picked} masterclass${v.courses.length > 1 ? "es" : ""}.`];
  if (v.fullName.trim()) lines.push(`Name: ${v.fullName.trim()}`);
  if (v.phone.trim()) lines.push(`Phone: ${v.phone.trim()}`);
  return lines.join("\n");
}

export function CourseRegistration() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CourseRegistrationResult | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // A link like /courses?course=wedding_videography#register preselects the course.
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("course");
    if (code && COURSES.some((c) => c.code === code)) {
      setValues((v) => ({ ...v, courses: [code] }));
    }
  }, []);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key] || errors.form) setErrors((e) => ({ ...e, [key]: undefined, form: undefined }));
  }

  function toggleEquipment(value: string) {
    set(
      "equipment",
      values.equipment.includes(value)
        ? values.equipment.filter((x) => x !== value)
        : [...values.equipment, value],
    );
  }

  /** Add or remove a course; keeps the catalog order so the summary reads naturally. */
  function toggleCourse(code: string) {
    const next = values.courses.includes(code)
      ? values.courses.filter((c) => c !== code)
      : COURSES.map((c) => c.code).filter((c) => c === code || values.courses.includes(c));
    set("courses", next);
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      document.getElementById(`reg-${first}`)?.focus();
      return;
    }
    if (!registrationEnabled) {
      window.open(waLink(whatsappMessage(values)), "_blank", "noopener,noreferrer");
      return;
    }

    setSubmitting(true);
    try {
      const reg = await registerForCourse({
        courses: values.courses,
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        email: values.email.trim() || undefined,
        experience: values.experience,
        equipment: values.equipment,
        preferredSchedule: values.preferredSchedule || undefined,
        heardFrom: values.heardFrom || undefined,
        message: values.message.trim() || undefined,
      });
      setResult(reg);
      requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (err) {
      if (err instanceof RegistrationError && Object.keys(err.fields).length) {
        const fields = Object.fromEntries(
          Object.entries(err.fields).map(([k, msg]) => [k.startsWith("courses") || k === "course" ? "courses" : k, msg]),
        );
        setErrors({ ...fields, form: "Please fix the highlighted fields." } as Errors);
      } else {
        setErrors({ form: err instanceof Error ? err.message : "Something went wrong. Please try again." });
      }
    } finally {
      setSubmitting(false);
    }
  }

  function registerAnother() {
    setResult(null);
    setValues((v) => ({ ...EMPTY, fullName: v.fullName, phone: v.phone, email: v.email }));
    setErrors({});
  }

  const fieldProps = (key: keyof Values) => ({
    id: `reg-${key}`,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `reg-${key}-err` : undefined,
  });

  const ErrorText = ({ k }: { k: keyof Values }) =>
    errors[k] ? (
      <p className="ac-err" id={`reg-${k}-err`} role="alert">
        {errors[k]}
      </p>
    ) : null;

  return (
    <>
      {/* ---------- the four masterclasses ---------- */}
      <section className="ac-courses" id="masterclasses" aria-labelledby="ac-courses-title">
        <div className="wrap">
          <span className="eyebrow">The masterclasses</span>
          <h2 id="ac-courses-title" className="ac-h2">
            Four courses. <span className="red">Two weeks each.</span>
          </h2>
          <ol className="ac-list">
            {COURSES.map((c, i) => {
              const on = values.courses.includes(c.code);
              return (
                <li key={c.code} className={`ac-row${on ? " on" : ""}`}>
                  <span className="ac-idx">{String(i + 1).padStart(2, "0")}</span>
                  <div className="ac-main">
                    <h3 className="ac-name">{c.name}</h3>
                    <p className="ac-sum">{c.summary}</p>
                    <ul className="ac-out">
                      {c.outcomes.map((o) => (
                        <li key={o}>{o}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="ac-side">
                    <span className="ac-meta">
                      {c.track} · {COURSE_WEEKS} weeks · Basic
                    </span>
                    <button
                      type="button"
                      className="ac-pick"
                      onClick={() => toggleCourse(c.code)}
                      aria-pressed={on}
                      aria-label={`${on ? "Remove" : "Add"} ${c.name}`}
                    >
                      {on ? "Added" : "Add"}
                      {on ? <CheckIcon /> : <PlusIcon />}
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className={`ac-selbar${values.courses.length ? " show" : ""}`} aria-live="polite">
            <p>
              {values.courses.length === 0
                ? "Add one or more masterclasses to register."
                : `${values.courses.length} selected: ${joinNames(values.courses.map(courseName))}`}
            </p>
            {values.courses.length > 0 && (
              <button type="button" className="btn-primary" onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>
                Continue to register
                <ArrowIcon className="ar" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ---------- registration ---------- */}
      <section className="ac-register" id="register" aria-labelledby="ac-register-title">
        <div className="wrap ac-grid">
          <aside className="ac-aside">
            <span className="eyebrow">Register</span>
            <h2 id="ac-register-title" className="ac-h2">
              Save your <span className="red">seat.</span>
            </h2>
            <p className="ac-lead">
              It takes a minute. No payment now: we call you to confirm the start date, class times and fee.
            </p>
            <ol className="ac-steps">
              <li>
                <span className="n">1</span>
                <div>
                  <strong>Pick your masterclasses</strong>
                  <p>Choose one or more, then add your name and phone number.</p>
                </div>
              </li>
              <li>
                <span className="n">2</span>
                <div>
                  <strong>We call you</strong>
                  <p>Usually within one working day, to confirm your schedule and fee.</p>
                </div>
              </li>
              <li>
                <span className="n">3</span>
                <div>
                  <strong>Learn. Shoot. Edit. Create.</strong>
                  <p>Two weeks of hands-on classes at our studio in Bole Medhanialem.</p>
                </div>
              </li>
            </ol>
            <a className="ac-help" href={waLink("Hi AD Pictures, I have a question about the masterclasses.")} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="wa" />
              Questions? Ask us on WhatsApp
            </a>
          </aside>

          <div className="ac-card" ref={formRef}>
            {result ? (
              <div className="ac-done" role="status" aria-live="polite">
                <span className="ac-check" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <h3>You&apos;re registered.</h3>
                <p>
                  Thank you, {values.fullName.trim().split(/\s+/)[0]}. Your seat request
                  {result.registrations.length > 1 ? "s are" : " is"} in. We will call you on{" "}
                  <strong>{values.phone.trim()}</strong> to confirm the start date and fee.
                </p>
                <ul className="ac-refs">
                  {result.registrations.map((r) => (
                    <li key={r.reference} className="ac-ref">
                      <span>{r.courseName}</span>
                      <strong>{r.reference}</strong>
                    </li>
                  ))}
                </ul>
                {result.alreadyRegistered.length > 0 && (
                  <p className="ac-note">
                    You were already registered for {joinNames(result.alreadyRegistered.map((a) => `${a.courseName} (${a.reference})`))}, so
                    we kept that registration.
                  </p>
                )}
                <div className="ac-done-actions">
                  <button type="button" className="btn-ghost" onClick={registerAnother}>
                    Register for another course
                  </button>
                  <Link className="ac-link" href="/">
                    Back to the studio
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <fieldset className="ac-fs">
                  <legend className="ac-label">
                    Masterclasses <span className="req">*</span> <span className="opt">choose one or more</span>
                  </legend>
                  <div
                    className="ac-options ac-course-opts"
                    id="reg-courses"
                    tabIndex={-1}
                    aria-describedby={errors.courses ? "reg-courses-err" : undefined}
                  >
                    {COURSES.map((c, i) => {
                      const on = values.courses.includes(c.code);
                      return (
                        <label key={c.code} className={`ac-course-opt${on ? " on" : ""}`}>
                          <input type="checkbox" name="courses" value={c.code} checked={on} onChange={() => toggleCourse(c.code)} />
                          <span className="i">{String(i + 1).padStart(2, "0")}</span>
                          <span className="t">{c.name}</span>
                          <span className="m">
                            {c.track} · {COURSE_WEEKS} weeks
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <ErrorText k="courses" />
                </fieldset>

                <div className="ac-row2">
                  <div className="ac-field ac-span2">
                    <label className="ac-label" htmlFor="reg-fullName">
                      Full name <span className="req">*</span>
                    </label>
                    <input
                      {...fieldProps("fullName")}
                      className="ac-input"
                      autoComplete="name"
                      value={values.fullName}
                      onChange={(e) => set("fullName", e.target.value)}
                      placeholder="e.g. Selam Abebe"
                      maxLength={100}
                    />
                    <ErrorText k="fullName" />
                  </div>
                  <div className="ac-field">
                    <label className="ac-label" htmlFor="reg-phone">
                      Phone number <span className="req">*</span>
                    </label>
                    <input
                      {...fieldProps("phone")}
                      className="ac-input"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={values.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="0911 223344"
                      maxLength={32}
                    />
                    <ErrorText k="phone" />
                  </div>
                  <div className="ac-field">
                    <label className="ac-label" htmlFor="reg-email">
                      Email <span className="opt">optional</span>
                    </label>
                    <input
                      {...fieldProps("email")}
                      className="ac-input"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="you@example.com"
                      maxLength={254}
                    />
                    <ErrorText k="email" />
                  </div>
                </div>

                <fieldset className="ac-fs">
                  <legend className="ac-label">Your experience</legend>
                  <div className="ac-options">
                    {EXPERIENCE_OPTIONS.map((o) => (
                      <label key={o.value} className={`ac-chip${values.experience === o.value ? " on" : ""}`}>
                        <input
                          type="radio"
                          name="experience"
                          value={o.value}
                          checked={values.experience === o.value}
                          onChange={() => set("experience", o.value)}
                        />
                        {o.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="ac-fs">
                  <legend className="ac-label">
                    Equipment <span className="opt">tick what you have</span>
                  </legend>
                  <div className="ac-options">
                    {EQUIPMENT_OPTIONS.map((o) => (
                      <label key={o.value} className={`ac-chip${values.equipment.includes(o.value) ? " on" : ""}`}>
                        <input
                          type="checkbox"
                          value={o.value}
                          checked={values.equipment.includes(o.value)}
                          onChange={() => toggleEquipment(o.value)}
                        />
                        {o.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="ac-fs">
                  <legend className="ac-label">
                    Best time for classes <span className="opt">optional</span>
                  </legend>
                  <div className="ac-options">
                    {SCHEDULE_OPTIONS.map((o) => (
                      <label key={o.value} className={`ac-chip${values.preferredSchedule === o.value ? " on" : ""}`}>
                        <input
                          type="radio"
                          name="preferredSchedule"
                          value={o.value}
                          checked={values.preferredSchedule === o.value}
                          onChange={() => set("preferredSchedule", o.value)}
                        />
                        {o.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="ac-row2">
                  <div className="ac-field">
                    <label className="ac-label" htmlFor="reg-heardFrom">
                      How did you hear about us? <span className="opt">optional</span>
                    </label>
                    <select
                      {...fieldProps("heardFrom")}
                      className="ac-input ac-select"
                      value={values.heardFrom}
                      onChange={(e) => set("heardFrom", e.target.value)}
                    >
                      <option value="">Choose one</option>
                      {HEARD_FROM_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="ac-field ac-span2">
                    <label className="ac-label" htmlFor="reg-message">
                      Anything we should know? <span className="opt">optional</span>
                    </label>
                    <textarea
                      {...fieldProps("message")}
                      className="ac-input ac-textarea"
                      rows={3}
                      value={values.message}
                      onChange={(e) => set("message", e.target.value)}
                      placeholder="Questions, preferred start date, what you want to learn…"
                      maxLength={1000}
                    />
                    <ErrorText k="message" />
                  </div>
                </div>

                {errors.form && (
                  <div className="ac-alert" role="alert">
                    <p>{errors.form}</p>
                    <a href={waLink(whatsappMessage(values))} target="_blank" rel="noopener noreferrer">
                      Or register on WhatsApp instead
                    </a>
                  </div>
                )}

                <button type="submit" className="btn-primary ac-submit" disabled={submitting}>
                  {registrationEnabled ? (
                    <>
                      {submitting
                        ? "Sending…"
                        : values.courses.length > 1
                          ? `Register for ${values.courses.length} masterclasses`
                          : "Register for the masterclass"}
                      {!submitting && <ArrowIcon className="ar" />}
                    </>
                  ) : (
                    <>
                      <WhatsAppIcon className="wa" />
                      Register on WhatsApp
                    </>
                  )}
                </button>
                <p className="ac-fine">
                  We only use your details to arrange your class. See our{" "}
                  <Link href="/privacy">privacy policy</Link>.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
