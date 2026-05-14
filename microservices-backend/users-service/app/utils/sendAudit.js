// app/utils/sendAudit.js
const sendAudit = async ({ url, headers, body }) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    // 🔥 Si el servidor responde 400/401/403/500, NO entra en catch
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error(
        "[AUDIT] Falló la auditoría:",
        response.status,
        response.statusText,
        text,
      );
    }
  } catch (error) {
    // 🔥 Solo entra aquí si hay ECONNREFUSED, timeout, DNS, etc.
    console.error("[AUDIT] Error en el envío de auditoría", error);
  }
};

export default sendAudit;
