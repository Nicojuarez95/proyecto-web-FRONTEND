import React, { useState, useEffect } from "react";

export default function RandomText() {
  const textAlerts = [
    {
      text:
        "No lo pienses más, crea tu tienda gratis hoy con unos simples clics",
    },
    {
      text:
        "Acepta pagos desde cualquier método con MercadoPago integrado en tu tienda",
    },
    {
      text: "Un nombre corto y pegadizo es clave para el éxito de tu tienda online",
    },
    { text: "Haz que tu tienda sea visualmente atractiva con una bonita imagen y un banner" },
  ];

  const [isRandomText, setRandomText] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * textAlerts.length);
    setRandomText(textAlerts[randomIndex].text);
  }, []);

  return <div>{isRandomText}</div>;
}
