"use client";

import Image from "next/image";
import { CurtainIntro } from "../components/CurtainIntro";
import { InviteCodeForm } from "../components/InviteCodeForm";
import { RegistrationForm } from "../components/RegistrationForm";
import { CanvasShimmer } from "../components/CanvasShimmer";
import { useState } from "react";

export default function Home() {
  const [inviteVerified, setInviteVerified] = useState(false);

  return (
    <CurtainIntro>
      <div className="flex min-h-screen flex-col">
        {/* Top navigation bar */}
        <nav className="nav-montserrat relative z-20 border-b border-[rgba(247,231,206,0.12)] bg-black">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(247,231,206,0.5)] bg-black/40 text-xs font-bold tracking-[0.15em] text-[rgba(247,231,206,0.85)]">
                C &amp; M
              </div>
              <span className="hidden text-sm font-bold text-[rgba(247,231,206,0.85)] sm:block">
                The Curtain Rises · Charleston · 08 · 08 · 26
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm font-bold uppercase tracking-[0.2em] text-[rgba(247,231,206,0.9)]">
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

        {/* Full-height hero with video intro and shimmer flanking center 400px */}
        <section className="relative flex h-screen w-full items-center justify-center overflow-hidden border-b border-[rgba(247,231,206,0.14)] bg-black">
          {/* Video fills hero */}
          <video
            className="max-h-full w-full object-contain"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://dev.cojollc.com/cm.MP4" type="video/mp4" />
          </video>

          {/* Shimmer overlays on left and right, leaving middle 400px clear */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 hidden md:block"
            style={{ width: "calc((100vw - 400px) / 2)" }}
          >
            <CanvasShimmer active density={1.6} className="h-full w-full" />
          </div>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 hidden md:block"
            style={{ width: "calc((100vw - 400px) / 2)" }}
          >
            <CanvasShimmer active density={1.6} className="h-full w-full -scale-x-100" />
          </div>

          {/* Subtle radial/vertical gradients over full hero */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(11,6,8,0.05),_rgba(11,6,8,0.55))]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0b0608] via-[rgba(11,6,8,0.65)] to-transparent" />

          {/* Hero text overlay centered over video */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-12 text-center">
            <p className="deco-heading text-xs text-[rgba(247,231,206,0.88)]">
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

        <main className="relative mx-auto flex w-full max-w-5xl flex-col px-2 pb-16 pt-10 invitation-section-bg sm:px-3 sm:pb-20 lg:px-4">
          {/* Invitation & RSVP, full-width section */}
          <section
            id="rsvp"
            className="nav-montserrat mt-14 w-full min-h-screen"
          >
            {/* Full-height invitation artwork */}
            <div className="w-full h-screen flex items-center justify-center">
              <div className="mx-auto h-full max-w-4xl px-2 pt-6 sm:px-3 lg:px-4">
                <Image
                  src="/images/invitationdesign-v2.png"
                  alt="Champagne and gold Art Deco save the date invitation"
                  width={768}
                  height={1152}
                  className="mx-auto h-full w-auto max-w-full object-contain"
                  priority
                />
              </div>
            </div>

            <div className="mx-auto mt-6 grid max-w-5xl gap-6 border-t border-[rgba(247,231,206,0.12)] pt-6 text-sm text-[rgba(247,231,206,0.78)] sm:grid-cols-3">
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

            {/* RSVP & Private Entry card, separate beneath Act II */}
            <div className="mx-auto mt-10 w-full max-w-5xl rounded-[1.4rem] bg-black/30 p-[1px] backdrop-blur-xl">
              <div className="deco-card h-full w-full px-5 py-5 sm:px-6 sm:py-6">
                <p className="deco-heading text-[0.62rem] text-[rgba(247,231,206,0.7)]">
                  Private theatre entry
                </p>
                <h2 className="mt-3 text-xl font-semibold text-ivory">
                  RSVP &amp; Private Entry
                </h2>
                <p className="mt-2 text-sm text-[rgba(247,231,206,0.8)]">
                  Begin by confirming your invitation code. Once accepted, your registration and
                  private details will appear.
                </p>

                <InviteCodeForm onVerified={() => setInviteVerified(true)} />

                <RegistrationForm inviteVerified={inviteVerified} />
              </div>
            </div>
          </section>

          {/* Celebrate / Gift section, full-page */}
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

