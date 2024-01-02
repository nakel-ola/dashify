import { formatErrorMessage } from "@/lib/format-error-message";

export async function uploadImage(
  file: File,
  accessToken: string
): Promise<string> {
  try {
    const formData = new FormData();

    formData.append("file", file, file.name);

    const res = await fetch(`${process.env.SERVER_URL}/upload`, {
      method: "POST",
      headers: {
        "x-access-token": `Bearer ${accessToken}`,
      },
      body: formData,
    });
    const data = await res.json();

    if (!res.ok) throw new Error(formatErrorMessage(data.message));

    return data.url;
  } catch (error: any) {
    console.log(error);

    throw new Error(error.message);
  }
}
