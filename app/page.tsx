"use client";

import Image from "next/image";
import { CurtainIntro } from "../components/CurtainIntro";
import { InviteCodeForm } from "../components/InviteCodeForm";
import { RegistrationForm } from "../components/RegistrationForm";
import { SparkleImage } from "../components/SparkleImage";
import { CanvasShimmer } from "../components/CanvasShimmer";
import { useState } from "react";

export default function Home() {
  const [inviteVerified, setInviteVerified] = useState(false);

  return (
    <CurtainIntro>
      <div className="flex min-h-screen flex-col">
        {/* Top navigation bar */}
        <nav className="relative z-20 border-b border-[rgba(247,231,206,0.12)] bg-black/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(247,231,206,0.5)] bg-black/40 text-[0.65rem] font-semibold tracking-[0.3em] text-[rgba(247,231,206,0.85)]">
                CJ
              </div>
              <span className="hidden text-xs text-[rgba(247,231,206,0.75)] sm:block">
                The Curtain Rises · Charleston · 08 · 08 · 26
              </span>
            </div>
            <div className="flex items-center gap-6 text-[0.7rem] uppercase tracking-[0.2em] text-[rgba(247,231,206,0.8)]">
              <button type="button" className="hover:text-ivory">
                Home
              </button>
              <button type="button" className="hover:text-ivory">
                Story
              </button>
              <button type="button" className="hover:text-ivory">
                Party
              </button>
              <button
                type="button"
                className="hover:text-ivory"
                onClick={() => {
                  const section = document.getElementById("rsvp");
                  if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                RSVP
              </button>
              <button type="button" className="hidden hover:text-ivory sm:inline">
                Photos
              </button>
            </div>
          </div>
        </nav>

        {/* Full-width hero with main couple photo */}
        <section className="relative flex h-screen w-full items-center justify-center overflow-hidden border-b border-[rgba(247,231,206,0.14)] bg-black">
          <Image
            src="/images/maincouplephoto.png"
            alt="The couple in a cinematic hero moment"
            fill
            priority
            className="object-contain"
          />
          <CanvasShimmer active density={2.8} />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(11,6,8,0.05),_rgba(11,6,8,0.55))]" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0b0608] via-[rgba(11,6,8,0.65)] to-transparent" />

          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-center">
            <p className="deco-heading text-xs text-[rgba(247,231,206,0.78)]">
              The Curtain Rises
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-ivory sm:text-4xl md:text-5xl">
              Courtney &amp; Matrell
            </h1>
            <p className="mt-2 text-xs tracking-[0.25em] text-[rgba(247,231,206,0.78)]">
              Charleston, South Carolina · 08 · 08 · 26
            </p>
          </div>
        </section>

        <main className="relative mx-auto flex w-full max-w-5xl flex-col px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8">
          {/* Act I – Couple gallery, full-screen feel with staggered sparkles */}
          <section className="flex min-h-[calc(100vh-5rem)] flex-col justify-center gap-8">
          <div className="deco-card px-6 py-6 sm:px-8 sm:py-8">
            <p className="deco-heading text-[0.62rem] text-[rgba(247,231,206,0.7)]">
              Act I · The Couple
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-ivory sm:text-3xl">
              A love story in three frames
            </h2>
            <p className="mt-3 text-sm text-[rgba(247,231,206,0.82)]">
              From first curtain call to final bow, our story has been written in late‑night talks,
              shared playlists, and quiet Charleston streets after the show. Here is a glimpse, in
              three stills.
            </p>

            <div className="mt-5 space-y-4">
              <SparkleImage
                src="/images/maincouplephoto.png"
                alt="The couple in a cinematic moment"
                width={1600}
                height={1000}
                priority
                index={0}
                denseSparkles
                sparkleDurationMs={2600}
                containerClassName="w-full rounded-2xl border border-[rgba(247,231,206,0.28)] bg-black/60 shadow-[0_30px_80px_rgba(0,0,0,0.95)]"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <SparkleImage
                  src="/images/couplekiss.JPG"
                  alt="The couple sharing a kiss"
                  width={900}
                  height={600}
                  index={1}
                  containerClassName="w-full rounded-xl border border-[rgba(247,231,206,0.24)] bg-black/60"
                />
                <SparkleImage
                  src="/images/coupleout.JPG"
                  alt="The couple walking together"
                  width={900}
                  height={600}
                  index={2}
                  containerClassName="w-full rounded-xl border border-[rgba(247,231,206,0.24)] bg-black/60"
                />
              </div>
            </div>
          </div>
          </section>

          {/* Act II – Invitation & RSVP, full-page */}
          <section className="mt-14 flex min-h-screen flex-col gap-10 lg:flex-row">
          <div className="deco-card deco-border relative flex-1 px-7 py-8 sm:px-9 sm:py-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="relative h-40 w-full max-w-[180px] overflow-hidden rounded-xl border border-[rgba(247,231,206,0.28)] bg-black/60 sm:h-52">
                <Image
                  src="/images/invitationdesign.png"
                  alt="Champagne and gold Art Deco invitation design"
                  fill
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(247,231,206,0.2),_transparent_60%)]" />
              </div>

              <div className="flex-1">
                <p className="deco-heading text-xs text-[rgba(247,231,206,0.7)]">
                  Act II · Your Invitation
                </p>
                <h1 className="mt-3 text-3xl font-semibold leading-tight text-ivory sm:text-4xl">
                  An evening in three acts:
                  <br />
                  love, devotion, and a city of lights.
                </h1>
                <p className="mt-4 max-w-xl text-sm text-[rgba(247,231,206,0.82)] sm:text-base">
                  On August 8, 2026, in the heart of Charleston, a private theatre opens its doors
                  for one night only. Behind the curtain: champagne, vows, and the people who made
                  the story possible.
                </p>
                <p className="mt-4 text-sm text-[rgba(247,231,206,0.7)]">
                  This celebration is by invitation only. Your three‑digit code is your key to the
                  evening.
                </p>
                <button
                  type="button"
                  className="btn-primary mt-6"
                  onClick={() => {
                    const section = document.getElementById("rsvp");
                    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  RSVP &amp; Enter
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-6 border-t border-[rgba(247,231,206,0.12)] pt-6 text-sm text-[rgba(247,231,206,0.78)] sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[rgba(247,231,206,0.6)]">
                  Date
                </p>
                <p className="mt-1">Saturday, August 8, 2026</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[rgba(247,231,206,0.6)]">
                  City
                </p>
                <p className="mt-1">Charleston, South Carolina</p>
                <p className="mt-0.5 text-[0.78rem] text-[rgba(247,231,206,0.6)]">
                  Venue details revealed after login.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[rgba(247,231,206,0.6)]">
                  Dress Code
                </p>
                <p className="mt-1">Black‑tie, with a hint of theatre.</p>
              </div>
            </div>
          </div>

          <aside
            id="rsvp"
            className="relative w-full max-w-md flex-1 rounded-[1.4rem] bg-black/30 px-1 py-1 backdrop-blur-xl"
          >
            <div className="deco-card h-full w-full px-5 py-5 sm:px-6 sm:py-6">
              <p className="deco-heading text-[0.62rem] text-[rgba(247,231,206,0.7)]">
                Private theatre entry
              </p>
              <h2 className="mt-3 text-xl font-semibold text-ivory">RSVP &amp; Entry</h2>
              <p className="mt-2 text-sm text-[rgba(247,231,206,0.8)]">
                Begin by confirming your invitation code. Once accepted, your registration and
                private details will appear.
              </p>

              <InviteCodeForm onVerified={() => setInviteVerified(true)} />

              <RegistrationForm inviteVerified={inviteVerified} />
            </div>
          </aside>
          </section>

          {/* Act III – Celebrate / Gift section, full-page */}
          <section className="mt-20 flex min-h-screen items-center">
          <div className="deco-card w-full px-6 py-6 sm:px-8 sm:py-8">
            <p className="deco-heading text-[0.62rem] text-[rgba(247,231,206,0.7)]">
              Act III · Celebrate With Us
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-ivory sm:text-3xl">
              A toast from afar
            </h2>
            <p className="mt-3 text-sm text-[rgba(247,231,206,0.82)]">
              Your presence is the truest gift. For those who wish to honor the celebration with a
              gesture, a Venmo link and optional honeymoon fund will appear in your guest portal
              after registration.
            </p>
            <p className="mt-3 text-xs text-[rgba(247,231,206,0.65)]">
              Details, venue, and guest message wall will be available once you&apos;re signed in.
            </p>
          </div>
          </section>
        </main>
      </div>
    </CurtainIntro>
  );
}

