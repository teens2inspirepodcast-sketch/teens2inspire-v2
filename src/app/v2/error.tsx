"use client";

export default function V2Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="error-page"><span className="eyebrow">A small pause</span><h1>That did not load.</h1><p>Your library is still here. Try refreshing this page.</p><button className="button button-primary" onClick={() => reset()}>Try again</button></main>;
}
