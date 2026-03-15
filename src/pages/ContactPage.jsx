export default function ContactPage() {
  return (
    <>
      <header className="page-header">
        <h1>Контакты</h1>
        <p>Свяжитесь со мной удобным способом.</p>
      </header>
      <div className="contact-content">
        <p><a href="mailto:hello@example.com">hello@example.com</a></p>
        <p><a href="https://t.me/pnkprty" target="_blank" rel="noopener noreferrer">Telegram: @pnkprty</a></p>
      </div>
    </>
  );
}
