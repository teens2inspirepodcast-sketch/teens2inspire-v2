import Link from "next/link";
export default function NotFound() { return <main className="error-page"><span className="eyebrow">Not on this page</span><h1>We could not find that one.</h1><p>The story may have moved. The library has more to explore.</p><Link className="button button-primary" href="/v2/discover">Explore the library</Link></main>; }
