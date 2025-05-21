import { useState } from "react";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function JobPromptMVP() {
  const [userData, setUserData] = useState({
    name: "",
    experience: "",
    skills: "",
    education: "",
    jobDescription: ""
  });
  const [cvText, setCvText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const generateCV = async () => {
    setLoading(true);
    setCvText("");

    const prompt = `Agisci come un esperto HR. Con i dati seguenti, genera un curriculum ottimizzato per il ruolo indicato.\nDati utente:\n- Nome: ${userData.name}\n- Esperienza: ${userData.experience}\n- Skills: ${userData.skills}\n- Formazione: ${userData.education}\nAnnuncio di lavoro:\n${userData.jobDescription}`;

    const response = await fetch("/api/generate-cv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    setCvText(data.cv || "Errore nella generazione del CV.");
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">JobPrompt AI - Genera il tuo CV</h1>
      <Input name="name" placeholder="Nome" onChange={handleChange} />
      <Textarea name="experience" placeholder="Esperienza" onChange={handleChange} />
      <Textarea name="skills" placeholder="Competenze (es: React, Excel...)" onChange={handleChange} />
      <Textarea name="education" placeholder="Formazione" onChange={handleChange} />
      <Textarea name="jobDescription" placeholder="Incolla qui l'annuncio di lavoro" onChange={handleChange} />
      <Button onClick={generateCV} disabled={loading}>{loading ? "Generazione in corso..." : "Genera CV"}</Button>
      {cvText && (
        <div className="mt-6 p-4 border rounded bg-gray-100 whitespace-pre-wrap">
          {cvText}
        </div>
      )}
    </div>
  );
}
