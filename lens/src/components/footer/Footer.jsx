import "../footer/Footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} mynextduty. All rights reserved.</p>
    </footer>
  );
};
