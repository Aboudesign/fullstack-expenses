export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer footer-center bg-base-200 text-base-content/60 py-6 px-4 border-t border-base-content/10">
      <aside>
        <p className="text-sm">
          © {year} SEYMA — Tous droits réservés
        </p>
      </aside>
    </footer>
  );
}
