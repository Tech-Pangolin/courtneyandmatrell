const ROOM_BLOCK_CUTOFF_LABEL = "Monday, July 6, 2026";
const ROOM_BLOCK_BOOKING_URL =
  "https://www.marriott.com/event-reservations/reservation-link.mi?id=1774383430184&key=GRP&app=resvlink&_branch_match_id=1296470904404831506&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXTywo0MtNLCrKzC8p0UvOz9UvSi3OyczLtgdK2ALZZSCOWmaKraG5uYmxhbGJsYGhhYladmqlrXt";

export function RoomBlockSection() {
  return (
    <section id="stay" className="nav-montserrat mt-10 w-full scroll-mt-24">
      <div className="deco-card w-full px-6 py-6 sm:px-8 sm:py-8">
        <h2 className="mt-3 text-xl font-semibold text-ivory">Where to stay</h2>
        <p className="mt-3 max-w-xl text-sm text-[rgba(247,231,206,0.82)]">
          We have reserved a room block for our celebration in Charleston. Please book by the
          cut-off date below to receive the group rate.
        </p>
        <div className="mx-auto mt-6 w-full max-w-md rounded-2xl border border-[rgba(247,231,206,0.2)] bg-black/40 px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-[rgba(247,231,206,0.6)]">
            Room block cut-off
          </p>
          <p className="mt-1 text-sm font-medium text-[rgba(247,231,206,0.95)]">
            {ROOM_BLOCK_CUTOFF_LABEL}
          </p>
        </div>
        <a
          href={ROOM_BLOCK_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-8 inline-block"
        >
          Book your room
        </a>
        <p className="mt-4 text-[0.7rem] text-[rgba(247,231,206,0.55)]">
          Opens Marriott reservation page in a new tab.
        </p>
      </div>
    </section>
  );
}
