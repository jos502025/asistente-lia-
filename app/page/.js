import ChatBox from "../components/ChatBox";

export default function Page() {
  return (
    <main style={{ maxWidth: 860, margin: "40px auto", padding: "0 20px" }}>
      <h1>Asistente LÍA 🤖</h1>
      <p style={{ color: "#555", marginTop: -10 }}>
        Pregúntame sobre compra, inversión y negociación inmobiliaria.
      </p>
      <ChatBox />
      <footer style={{ marginTop: 40, fontSize: 12, color: "#777" }}>
        Hecho con Next.js en Netlify.
      </footer>
    </main>
  );
}
