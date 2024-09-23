export async function fetchSTTField(sttId: string, field: string): Promise<any> {
  try {
    const response = await fetch(`/api/stts/${sttId}`); // Fetch from DB
    const stt = await response.json();

    if (!response.ok) {
      throw new Error(stt.error || "Failed to fetch STT");
    }

    return stt[field]; // Assuming the API returns content in the response
  } catch (error) {
    console.error("Error fetching STT:", error);
    throw new Error(`Error fetching STT data field ${field}`);
  }
}

export async function sendToOpenAI(prompt: string): Promise<any> {
  try {
    const res = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    return data; // Return the OpenAI response
  } catch (error) {
    console.error("Error sending data to OpenAI:", error);
    throw new Error("An unexpected error occurred.");
  }
}

export async function updateUserTokens(userId: string, tokens: number) {
  try {
    // Assume you have a function that updates the user tokens
    await fetch(`/api/users/${userId}/tokens`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tokens }),
    });
  } catch (error) {
    console.error("Error updating user tokens:", error);
    throw new Error("Failed to update user tokens.");
  }
}

export async function getSTTAudioFile(sttId: string) {
  return await fetchSTTField(sttId, "audioId");
}

export async function getSTTContent(sttId: string): Promise<any> {
  return await fetchSTTField(sttId, "content");
}
