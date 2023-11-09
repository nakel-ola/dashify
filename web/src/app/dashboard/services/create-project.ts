"use server";
import { formatErrorMessage } from "@/lib/format-error-message";
import { getAccessToken } from "@/lib/get-access-token";
import { CreateProjectForm } from "../features/type";
import { uploadImage } from "./upload-image";

export async function createProject(
  args: CreateProjectForm & { projectId: string }
) {
  const accessToken = await getAccessToken();

  if (!accessToken) throw new Error("Please login");

  const {
    database,
    databaseName,
    host,
    image,
    name,
    password,
    port,
    username,
    projectId,
  } = args;

  let url = null;

  if (image) url = await uploadImage(image, accessToken);

  const res = await fetch(`${process.env.SERVER_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "x-access-token": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      logo: url,
      projectId,
      name,
      database: database.toLowerCase(),
      databaseConfig: { name: databaseName, host, port, username, password },
    }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(formatErrorMessage(data.message));

  return data;
}
