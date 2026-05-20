"use client";

import Image from "next/image";
import { CurtainIntro } from "../components/CurtainIntro";
import { InviteCodeForm } from "../components/InviteCodeForm";
import { RegistrationForm } from "../components/RegistrationForm";
import {
  RsvpLookupForm,
  RsvpLookupSuccess,
  type LookupGuest,
} from "../components/RsvpLookupForm";
import { CanvasShimmer } from "../components/CanvasShimmer";
import { RoomBlockSection } from "../components/RoomBlockSection";
import { useEffect, useState } from "react";

const HONEYFUND_URL = "https://www.honeyfund.com/site/johnson-mccray-08-08-2026";

export default function Home() {
  const [inviteVerified, setInviteVerified] = useState(false);
  const [lookupMode, setLookupMode] = useState(false);
  const [lookupGuests, setLookupGuests] = useState<LookupGuest[] | null>(null);
  const [venueVisible, setVenueVisible] = useState(false);
  const [venueText, setVenueText] = useState<string | null>(null);
  const [venueTime, setVenueTime] = useState<string | null>(null);

  // Used after the invite code is verified to gently nudge the viewport so
  // the RSVP details come fully into view.
  const scrollToRsvpCard = () => {
    window.scrollBy({ top: 600, behavior: "smooth" });
  };

  // Used by the navbar RSVP link to scroll precisely to the RSVP card,
  // regardless of screen size.
  const scrollNavToRsvp = () => {
    const card = document.getElementById("rsvp-card");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const offset = window.scrollY + rect.top - 80;
    window.scrollTo({ top: offset, behavior: "smooth" });
  };
  const scrollToVenueInfo = () => {
    setTimeout(() => {
      const section = document.getElementById("event-info");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const offset = window.scrollY + rect.top - 80;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }, 800);
  };

  const revealVenue = async () => {
    try {
      const res = await fetch("/api/venue");
      if (res.ok) {
        const data = (await res.json()) as {
          name?: string;
          address?: string;
          time?: string;
        };
        const location = [data.name, data.address].filter(Boolean).join(" · ");
        if (location) setVenueText(location);
        if (data.time?.trim()) setVenueTime(data.time.trim());
      }
    } catch {
      // fail silently; just don't show venue text
    }
    setVenueVisible(true);
  };

  const handleLookupSuccess = async (guests: LookupGuest[]) => {
    setLookupGuests(guests);
    await revealVenue();
    scrollToVenueInfo();
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      const hasVenueCookie = document.cookie
        .split(";")
        .some(
          (c) =>
            c.trim().startsWith("cm_rsvp_venue=1") ||
            c.trim().startsWith("cm_rsvp_attending=1")
        );
      if (hasVenueCookie) {
        revealVenue();
      }
    }
  }, []);

  return (
    <CurtainIntro>
      <div className="flex min-h-screen flex-col">
        {/* Top navigation bar */}
        <nav className="nav-montserrat relative z-20 border-b border-[rgba(247,231,206,0.12)] bg-black">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-4 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(247,231,206,0.5)] bg-black/40 text-xs font-bold tracking-[0.15em] text-[rgba(247,231,206,0.85)]">
                C &amp; M
              </div>
              <span className="hidden text-sm font-bold text-[rgba(247,231,206,0.85)] sm:block">
                A Celebration of Love · Charleston · 08 · 08 · 26
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[rgba(247,231,206,0.9)] sm:gap-6 sm:text-sm sm:tracking-[0.2em]">
              <button
                type="button"
                className="hover:text-ivory"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Home
              </button>
              <button
                type="button"
                className="hover:text-ivory"
                onClick={scrollNavToRsvp}
              >
                RSVP
              </button>
              <button
                type="button"
                className="hover:text-ivory"
                onClick={() => {
                  const section = document.getElementById("stay");
                  if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Stay
              </button>
              <button
                type="button"
                className="hover:text-ivory"
                onClick={() => {
                  const section = document.getElementById("gift");
                  if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Gift
              </button>
              <button
                type="button"
                className="hidden hover:text-ivory sm:inline"
                onClick={() => {
                  const section = document.getElementById("photos");
                  if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
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
              A Celebration of Love
            </p>
            <h1 className="primary-script mt-3 text-4xl sm:text-5xl md:text-6xl">
              Courtney &amp; Matrell
            </h1>
            <p className="mt-2 text-xs tracking-[0.25em] text-[rgba(247,231,206,0.78)]">
              Charleston, South Carolina · 08 · 08 · 26
            </p>
          </div>
        </section>

        <main className="relative mx-auto flex w-full max-w-5xl flex-col px-2 pb-16 invitation-section-bg sm:px-3 sm:pb-20 lg:px-4">
          {/* Invitation artwork */}
          <section id="invitation" className="nav-montserrat mt-14 w-full">
            <div className="flex h-screen w-full items-center justify-center">
              <div className="mx-auto h-full max-w-4xl px-2 sm:px-3 lg:px-4">
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
          </section>

          {/* Event information: date, location & time, dress code */}
          <section
            id="event-info"
            className="nav-montserrat mx-auto mt-6 w-full max-w-5xl border-t border-[rgba(247,231,206,0.12)] pt-6 text-center text-sm text-[rgba(247,231,206,0.78)]"
          >
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[rgba(247,231,206,0.6)]">
                  Date
                </p>
                <p className="mt-1">Saturday, August 8, 2026</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[rgba(247,231,206,0.6)]">
                  Location &amp; Time
                </p>

                {!venueVisible && (
                  <>
                    <p className="mt-0.5 text-[0.78rem] text-[rgba(247,231,206,0.6)]">
                      Venue details revealed after login.
                    </p>
                    <p className="mt-1">Charleston, South Carolina</p>
                  </>
                )}
                {venueVisible && (venueText || venueTime) && (
                  <div className="mt-0.5 text-[0.78rem] text-[rgba(247,231,206,0.9)] transition-all duration-700 ease-out opacity-100 translate-y-0">
                    {venueText && <p>{venueText}</p>}
                    {venueTime && <p className={venueText ? "mt-1" : ""}>{venueTime}</p>}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[rgba(247,231,206,0.6)]">
                  Dress Code
                </p>
                <p className="mt-1">Bond-Inspired Cocktail Attire</p>
              </div>
            </div>
          </section>

          <p className="nav-montserrat mx-auto mt-10 max-w-2xl px-4 text-center text-sm italic leading-relaxed text-[rgba(247,231,206,0.82)]">
            Courtney and Matrell privately exchanged vows and are now looking forward to celebrating
            their marriage surrounded by the people they love most.
          </p>

          {/* RSVP section */}
          <section id="rsvp" className="nav-montserrat w-full">
            <div
              id="rsvp-card"
              className="mx-auto mt-10 w-full max-w-5xl rounded-[1.4rem] bg-black/30 p-[1px] backdrop-blur-xl"
            >
              <div className="deco-card h-full w-full px-5 py-5 sm:px-6 sm:py-6">
                <h2 className="mt-3 text-xl font-semibold text-ivory">RSVP</h2>
                <p className="mt-2 text-sm text-[rgba(247,231,206,0.8)]">
                  Begin by confirming your invitation code. Once accepted, your registration and
                  private details will appear.
                </p>

                {!lookupMode && !lookupGuests && (
                  <>
                    <InviteCodeForm onVerified={() => setInviteVerified(true)} />
                    <p className="mt-4 text-center text-sm text-[rgba(247,231,206,0.78)]">
                      <button
                        type="button"
                        className="text-[rgba(247,231,206,0.9)] underline-offset-2 hover:text-ivory hover:underline"
                        onClick={() => setLookupMode(true)}
                      >
                        Already RSVP&apos;d? Click here to view venue information
                      </button>
                    </p>
                  </>
                )}

                {lookupMode && !lookupGuests && (
                  <RsvpLookupForm
                    onSuccess={handleLookupSuccess}
                    onBack={() => setLookupMode(false)}
                  />
                )}

                {lookupGuests && <RsvpLookupSuccess guests={lookupGuests} />}

                {!lookupMode && (
                  <RegistrationForm
                    inviteVerified={inviteVerified}
                    onVenueRevealed={revealVenue}
                    onVisible={scrollToRsvpCard}
                    onSubmitted={scrollToVenueInfo}
                  />
                )}
              </div>
            </div>
          </section>

          <RoomBlockSection />

          {/* Celebrate / Gift section, full-page */}
          <section id="gift" className="mt-10 flex items-center">
            <div className="deco-card nav-montserrat w-full px-6 py-6 sm:px-8 sm:py-8">
              <h2 className="mt-3 text-xl font-semibold text-ivory">
                Honeymoon Fund
              </h2>
              <p className="mt-3 text-sm text-[rgba(247,231,206,0.82)]">
                While your presence is our greatest gift, for friends and family who have asked, we
                have chosen to create a honeymoon fund in place of a registry.
              </p>
              <p className="mt-2 text-sm text-[rgba(247,231,206,0.82)]">
                Your generosity will help us create lasting memories as newlyweds.
              </p>

              <div className="mt-6 grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-3 md:items-center md:gap-6">
                <div className="flex w-full min-w-0 flex-col items-center text-center md:items-start md:text-left">
                  <p className="max-w-xl text-sm text-[rgba(247,231,206,0.82)]">
                    Our honeymoon fund and wishlist live on Honeyfund. Visit the site to contribute
                    any amount or choose an experience from our list.
                  </p>
                  <a
                    href={HONEYFUND_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary mt-8 inline-block"
                  >
                    Visit our Honeyfund
                  </a>
                  <p className="mt-4 text-[0.7rem] text-[rgba(247,231,206,0.55)]">
                    Opens our Honeyfund page in a new tab.
                  </p>
                </div>

                <div className="flex items-center justify-center self-center">
                  <span className="primary-script text-4xl text-ivory">OR</span>
                </div>

                <div className="flex flex-col items-center gap-3 self-center md:items-end md:justify-self-end">
                  <p className="text-xs uppercase tracking-[0.18em] text-[rgba(247,231,206,0.7)]">
                    Scan to visit Honeyfund
                  </p>
                  <a
                    href={HONEYFUND_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-[rgba(247,231,206,0.4)] bg-black/60 p-4 transition hover:border-[rgba(247,231,206,0.55)]"
                  >
                    <Image
                      src="/images/qrcode.png"
                      alt="QR code linking to Honeyfund"
                      width={160}
                      height={160}
                      className="h-40 w-40 object-contain"
                    />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Photos section */}
          <section id="photos" className="mt-10 flex items-center">
            <div className="deco-card nav-montserrat w-full px-6 py-6 sm:px-8 sm:py-8">
              <h2 className="mt-3 text-xl font-semibold text-ivory">
                Photos
              </h2>
              <p className="mt-3 text-sm text-[rgba(247,231,206,0.82)]">
                A few favorite moments leading up to the celebration.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
                <div className="overflow-hidden rounded-2xl border border-[rgba(247,231,206,0.25)] bg-black/60">
                  <Image
                    src="/images/maincouplephoto.png"
                    alt="Portrait of the couple"
                    width={600}
                    height={800}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl border border-[rgba(247,231,206,0.25)] bg-black/60">
                  <Image
                    src="/images/coupleout.JPG"
                    alt="The couple walking out together"
                    width={600}
                    height={800}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl border border-[rgba(247,231,206,0.25)] bg-black/60">
                  <Image
                    src="/images/coupletree.JPG"
                    alt="The couple smiling together under a palm tree"
                    width={600}
                    height={800}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </CurtainIntro>
  );
}

