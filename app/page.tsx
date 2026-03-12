"use client";

import Image from "next/image";
import { CurtainIntro } from "../components/CurtainIntro";
import { InviteCodeForm } from "../components/InviteCodeForm";
import { RegistrationForm } from "../components/RegistrationForm";
import { CanvasShimmer } from "../components/CanvasShimmer";
import { useEffect, useState } from "react";

export default function Home() {
  const [inviteVerified, setInviteVerified] = useState(false);
  const [venueVisible, setVenueVisible] = useState(false);
  const [venueText, setVenueText] = useState<string | null>(null);
  const [venmoHandle, setVenmoHandle] = useState<string | null>("CojoLLC");
  const [venmoAmount, setVenmoAmount] = useState("");
  const [venmoNote, setVenmoNote] = useState("");
  const [venmoError, setVenmoError] = useState<string | null>(null);

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
  const scrollToEventInfo = () => {
    setTimeout(() => {
      const section = document.getElementById("event-info");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const offset = window.scrollY + rect.top - 80;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }, 2000);
  };

  const handleAttendingConfirmed = async () => {
    if (!venueText) {
      try {
        const res = await fetch("/api/venue");
        if (res.ok) {
          const data = (await res.json()) as { name?: string; address?: string };
          if (data.name || data.address) {
            const combined = [data.name, data.address].filter(Boolean).join(" · ");
            setVenueText(combined);
          }
        }
      } catch {
        // fail silently; just don't show venue text
      }
    }
    setVenueVisible(true);
  };

  useEffect(() => {
    // If the user has already RSVP'd as attending before, show the venue automatically.
    if (typeof document !== "undefined") {
      const hasCookie = document.cookie
        .split(";")
        .some((c) => c.trim().startsWith("cm_rsvp_attending=1"));
      if (hasCookie) {
        handleAttendingConfirmed();
      }
    }
  }, []);

  useEffect(() => {
    async function loadVenmo() {
      try {
        const res = await fetch("/api/settings/venmo");
        if (!res.ok) return;
        const data = (await res.json()) as { venmoHandle?: string };
        if (!venmoHandle && data.venmoHandle) {
          setVenmoHandle(data.venmoHandle);
        }
      } catch {
        // ignore
      }
    }
    loadVenmo();
  }, []);

  const handleVenmoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!venmoHandle) return;
    const trimmedAmount = venmoAmount.trim();
    if (!trimmedAmount || Number(trimmedAmount) <= 0) {
      setVenmoError("Please enter an amount to send your toast.");
      return;
    }
    setVenmoError(null);
    const recipient = encodeURIComponent(venmoHandle);
    const amount = encodeURIComponent(trimmedAmount);
    const note = venmoNote ? encodeURIComponent(venmoNote) : "";
    const url = `https://account.venmo.com/payment-link?recipients=${recipient}${
      amount ? `&amount=${amount}&txn=pay` : ""
    }${note ? `&note=${note}` : ""}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

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

          {/* Event information: date, city, dress code */}
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
                  City
                </p>
               
                {!venueVisible && (<>
                  <p className="mt-0.5 text-[0.78rem] text-[rgba(247,231,206,0.6)]">
                    Venue details revealed after login.
                  </p> 
                  <p className="mt-1">Charleston, South Carolina</p>
                  </>
                )}
                {venueVisible && venueText && (
                  <p className="mt-0.5 text-[0.78rem] text-[rgba(247,231,206,0.9)] transition-all duration-700 ease-out opacity-100 translate-y-0">
                    {venueText}
                  </p>
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

          {/* RSVP section */}
          <section id="rsvp" className="nav-montserrat w-full min-h-screen">
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

                <InviteCodeForm onVerified={() => setInviteVerified(true)} />

                <RegistrationForm
                  inviteVerified={inviteVerified}
                  onAttendingConfirmed={handleAttendingConfirmed}
                  onVisible={scrollToRsvpCard}
                  onSubmitted={scrollToEventInfo}
                />
              </div>
            </div>
          </section>

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

              {venmoHandle && (
                <div className="mt-6 grid items-start gap-6 md:grid-cols-[minmax(0,2fr)_auto_minmax(0,1fr)]">
                  <form onSubmit={handleVenmoSubmit} className="space-y-4 text-sm">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.18em] text-[rgba(247,231,206,0.7)]">
                        Amount
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="mt-1 w-full rounded-lg border border-[rgba(247,231,206,0.35)] bg-black/40 px-3 py-2 text-sm text-ivory outline-none ring-0 transition focus:border-[rgba(247,231,206,0.9)] focus:bg-black/60"
                        value={venmoAmount}
                        onChange={(e) => setVenmoAmount(e.target.value)}
                        placeholder="Please enter an amount"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.18em] text-[rgba(247,231,206,0.7)]">
                        Note
                      </label>
                      <textarea
                        rows={3}
                        maxLength={280}
                        className="mt-1 w-full rounded-lg border border-[rgba(247,231,206,0.35)] bg-black/40 px-3 py-2 text-sm text-ivory outline-none ring-0 transition focus:border-[rgba(247,231,206,0.9)] focus:bg-black/60"
                        value={venmoNote}
                        onChange={(e) => setVenmoNote(e.target.value)}
                        placeholder="A toast to your forever"
                      />
                      <p className="mt-1 text-[0.7rem] text-[rgba(247,231,206,0.65)]">
                        {venmoNote.length}/280 characters
                      </p>
                    </div>

                    <button type="submit" className="btn-primary mt-2">
                      Send Your Toast
                    </button>
                    {venmoError && (
                      <p className="text-xs text-[rgba(255,161,181,0.9)]">
                        {venmoError}
                      </p>
                    )}
                  </form>

                  <div className="flex h-full items-center justify-center md:justify-center">
                    <span className="primary-script text-4xl text-ivory">OR</span>
                  </div>

                  <div className="flex flex-col items-center gap-3 md:items-start">
                    <p className="text-xs uppercase tracking-[0.18em] text-[rgba(247,231,206,0.7)]">
                      Scan to send a toast
                    </p>
                    <div className="rounded-2xl border border-[rgba(247,231,206,0.4)] bg-black/60 p-4">
                      <Image
                        src="/images/qrcode.png"
                        alt="Venmo QR code"
                        width={160}
                        height={160}
                        className="h-40 w-40 object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}

              {!venmoHandle && (
                <p className="mt-4 text-xs text-[rgba(247,231,206,0.65)]">
                  Venmo details will appear here once configured in the back office.
                </p>
              )}
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

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="overflow-hidden rounded-2xl border border-[rgba(247,231,206,0.25)] bg-black/60">
                  <Image
                    src="/images/couplekiss.JPG"
                    alt="The couple sharing a kiss"
                    width={600}
                    height={800}
                    className="h-full w-full object-cover"
                  />
                </div>
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
              </div>
            </div>
          </section>
        </main>
      </div>
    </CurtainIntro>
  );
}

