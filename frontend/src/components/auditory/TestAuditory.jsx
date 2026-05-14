import { useState } from "react";

const TestAuditory = () => {
  const [response, setResponse] = useState(null);
  const handleTestButtonAuditory = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL_AUDITORIES}/prueba`, {
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data?.error) {
      setResponse(data.error?.message);
    } else {
      setResponse(data.welcomeMessage);
    }
    
  };

  return (
    <div className="w-full flex bg-gray-700 p-4 rounded-md flex-col items-center gap-4">
      <button
        type="button"
        className="bg-buttons hover:bg-buttons-hover cursor-pointer text-black px-4 py-2 rounded"
        onClick={handleTestButtonAuditory}
      >
        Test Auditory
      </button>
      {response && <p>{response}</p>}
    </div>
  );
};

export default TestAuditory;
