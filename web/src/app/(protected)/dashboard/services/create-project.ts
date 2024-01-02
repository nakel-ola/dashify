import { formatErrorMessage } from "@/lib/format-error-message";
import { getAccessToken } from "@/lib/get-access-token";
import { CreateProjectForm } from "../features/type";

export async function createProject(
  args: Omit<CreateProjectForm, "image"> & {
    projectId: string;
    image: string | null;
  }
) {
  try {
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

    const res = await fetch(`${process.env.SERVER_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "x-access-token": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        logo: image,
        projectId,
        name,
        database: database.toLowerCase(),
        databaseConfig: { name: databaseName, host, port, username, password },
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(formatErrorMessage(data.message));

    return data;
  } catch (error: any) {
    console.log(error);

    throw new Error(error.message);
  }
}
