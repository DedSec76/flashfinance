import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="app-main gate">
      <section className="card form-panel">
        <h1>Unauthorized</h1>
        <p>Your session is missing or expired, or you do not have access to this resource.</p>
        <div className="form-actions">
          <Link href="/login" className="btn btn-primary">
            Go to sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
