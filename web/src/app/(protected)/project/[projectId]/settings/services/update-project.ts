"use server";

import { uploadImage } from "@/app/(protected)/dashboard/services/upload-image";
import { formatErrorMessage } from "@/lib/format-error-message";
import { getAccessToken } from "@/lib/get-access-token";
import { clean } from "@/utils/clean";

type Args = {
  name?: string;
  logo?: File;
  projectId: string;
};

export async function updateProject(args: Args) {
  const accessToken = await getAccessToken();

  if (!accessToken) throw new Error("Please login");

  const { logo, name, projectId } = args;

  let url = null;

  if (logo) url = await uploadImage(logo, accessToken);

  const res = await fetch(`${process.env.SERVER_URL}/projects/${projectId}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      "x-access-token": `Bearer ${accessToken}`,
    },
    body: JSON.stringify(clean({ name, logo: url })),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(formatErrorMessage(data.message));
  return data;
}
