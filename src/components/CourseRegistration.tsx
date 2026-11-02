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
import { registerForCourse, RegistrationError, type CourseRegistrationResult } from "@/lib/api";

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
  if (v.courses.length === 0) e.courses = "Choose at least one course.";
  if (v.fullName.trim().length < 2) e.fullName = "Enter your full name.";
  if (!normalizePhone(v.phone)) e.phone = "Enter a valid phone number, e.g. 0911 223344.";
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Check the email address, or leave it empty.";
  return e;
}

function CheckMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function CourseRegistration() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CourseRegistrationResult | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // /courses?course=wedding_videography preselects that course.
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("course");
    if (code && COURSES.some((c) => c.code === code)) setValues((v) => ({ ...v, courses: [code] }));
  }, []);

  // Bring the confirmation into view once it has rendered (the form above it is taller).
  useEffect(() => {
    if (result) topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key] || errors.form) setErrors((e) => ({ ...e, [key]: undefined, form: undefined }));
  }

  function toggle(key: "courses" | "equipment", value: string, order: readonly string[]) {
    const list = values[key];
    set(key, list.includes(value) ? list.filter((x) => x !== value) : order.filter((x) => x === value || list.includes(x)));
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`reg-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const res = await registerForCourse({
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
      setResult(res);
    } catch (err) {
      if (err instanceof RegistrationError && Object.keys(err.fields).length) {
        const fields = Object.fromEntries(
          Object.entries(err.fields).map(([k, msg]) => [k.startsWith("course") ? "courses" : k, msg]),
        );
        setErrors({ ...fields, form: "Please check the highlighted fields." } as Errors);
      } else {
        setErrors({ form: err instanceof Error ? err.message : "Something went wrong. Please try again." });
      }
    } finally {
      setSubmitting(false);
    }
  }

  const fieldProps = (key: keyof Values) => ({
    id: `reg-${key}`,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `reg-${key}-err` : undefined,
  });

  const err = (k: keyof Values) =>
    errors[k] ? (
      <p className="rg-err" id={`reg-${k}-err`} role="alert">
        {errors[k]}
      </p>
    ) : null;

  return <div className="rg-anchor" ref={topRef}>{result ? renderDone(result) : renderForm()}</div>;

  function renderDone(result: CourseRegistrationResult) {
    const first = values.fullName.trim().split(/\s+/)[0];
    return (
      <div className="rg-card rg-done" role="status" aria-live="polite">
        <span className="rg-done-icon">
          <CheckMark />
        </span>
        <h2>You&apos;re registered, {first}.</h2>
        <p>
          We will call you on <strong>{values.phone.trim()}</strong> to confirm the start date, class times and fee.
        </p>
        <ul className="rg-refs">
          {result.registrations.map((r) => (
            <li key={r.reference}>
              <span>{r.courseName}</span>
              <code>{r.reference}</code>
            </li>
          ))}
        </ul>
        {result.alreadyRegistered.length > 0 && (
          <p className="rg-muted">
            Already registered before: {result.alreadyRegistered.map((a) => `${a.courseName} (${a.reference})`).join(", ")}.
          </p>
        )}
        <div className="rg-done-actions">
          <button
            type="button"
            className="rg-btn rg-btn-ghost"
            onClick={() => {
              setResult(null);
              setValues((v) => ({ ...EMPTY, fullName: v.fullName, phone: v.phone, email: v.email }));
            }}
          >
            Register for another course
          </button>
          <Link className="rg-link" href="/">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  function renderForm() {
  const count = values.courses.length;

  return (
    <form className="rg-card" onSubmit={onSubmit} noValidate>
      {/* 1 — courses */}
      <fieldset className="rg-step">
        <legend>
          <span className="rg-num">1</span>
          Choose your courses
          <span className="rg-hint">one or more</span>
        </legend>
        <div className="rg-courses" id="reg-courses" tabIndex={-1} aria-describedby={errors.courses ? "reg-courses-err" : undefined}>
          {COURSES.map((c) => {
            const on = values.courses.includes(c.code);
            return (
              <label key={c.code} className={`rg-course${on ? " on" : ""}`}>
                <input
                  type="checkbox"
                  name="courses"
                  value={c.code}
                  checked={on}
                  onChange={() => toggle("courses", c.code, COURSES.map((x) => x.code))}
                />
                <span className="rg-box" aria-hidden="true">
                  <CheckMark />
                </span>
                <span className="rg-course-body">
                  <span className="rg-course-name">{c.name}</span>
                  <span className="rg-course-sum">{c.summary}</span>
                  <span className="rg-course-meta">
                    {c.track} · {COURSE_WEEKS} weeks
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        {err("courses")}
      </fieldset>

      {/* 2 — contact */}
      <fieldset className="rg-step">
        <legend>
          <span className="rg-num">2</span>
          Your details
        </legend>
        <div className="rg-grid">
          <div className="rg-field rg-full">
            <label htmlFor="reg-fullName">Full name</label>
            <input
              {...fieldProps("fullName")}
              className="rg-input"
              autoComplete="name"
              value={values.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="Selam Abebe"
              maxLength={100}
            />
            {err("fullName")}
          </div>
          <div className="rg-field">
            <label htmlFor="reg-phone">Phone number</label>
            <input
              {...fieldProps("phone")}
              className="rg-input"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="0911 223344"
              maxLength={32}
            />
            {err("phone")}
          </div>
          <div className="rg-field">
            <label htmlFor="reg-email">
              Email <span className="rg-hint">optional</span>
            </label>
            <input
              {...fieldProps("email")}
              className="rg-input"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@example.com"
              maxLength={254}
            />
            {err("email")}
          </div>
        </div>
      </fieldset>

      {/* 3 — optional context */}
      <fieldset className="rg-step">
        <legend>
          <span className="rg-num">3</span>
          About you
          <span className="rg-hint">optional</span>
        </legend>
        <div className="rg-grid">
          <div className="rg-field">
            <label htmlFor="reg-experience">Experience</label>
            <select {...fieldProps("experience")} className="rg-input rg-select" value={values.experience} onChange={(e) => set("experience", e.target.value)}>
              {EXPERIENCE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="rg-field">
            <label htmlFor="reg-preferredSchedule">Best time for classes</label>
            <select
              {...fieldProps("preferredSchedule")}
              className="rg-input rg-select"
              value={values.preferredSchedule}
              onChange={(e) => set("preferredSchedule", e.target.value)}
            >
              <option value="">Any time</option>
              {SCHEDULE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="rg-field">
            <label htmlFor="reg-heardFrom">How did you hear about us?</label>
            <select {...fieldProps("heardFrom")} className="rg-input rg-select" value={values.heardFrom} onChange={(e) => set("heardFrom", e.target.value)}>
              <option value="">Choose one</option>
              {HEARD_FROM_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="rg-field">
            <span className="rg-label">Equipment you have</span>
            <div className="rg-checks">
              {EQUIPMENT_OPTIONS.map((o) => (
                <label key={o.value} className="rg-check">
                  <input
                    type="checkbox"
                    checked={values.equipment.includes(o.value)}
                    onChange={() => toggle("equipment", o.value, EQUIPMENT_OPTIONS.map((x) => x.value))}
                  />
                  {o.value === "camera" ? "Camera" : "Laptop"}
                </label>
              ))}
            </div>
          </div>
          <div className="rg-field rg-full">
            <label htmlFor="reg-message">Message</label>
            <textarea
              {...fieldProps("message")}
              className="rg-input rg-textarea"
              rows={3}
              value={values.message}
              onChange={(e) => set("message", e.target.value)}
              placeholder="Questions or a preferred start date"
              maxLength={1000}
            />
            {err("message")}
          </div>
        </div>
      </fieldset>

      {errors.form && (
        <p className="rg-alert" role="alert">
          {errors.form}
        </p>
      )}

      <button type="submit" className="rg-btn rg-submit" disabled={submitting}>
        {submitting ? "Sending…" : count > 1 ? `Register for ${count} courses` : "Register"}
      </button>
      <p className="rg-fine">
        No payment now. We only use your details to arrange your class (<Link href="/privacy">privacy</Link>).
      </p>
    </form>
  );
  }
}
