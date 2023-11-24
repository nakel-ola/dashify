import { formatErrorMessage } from "@/lib/format-error-message";
import { getAccessToken } from "@/lib/get-access-token";
import { uploadImage } from "../../dashboard/services/upload-image";
import { clean } from "@/utils/clean";

type Args = {
  firstName?: string;
  lastName?: string;
  image?: File;
};
export async function updateUser(args: Args) {
  console.log(args);
  const accessToken = await getAccessToken();

  if (!accessToken) throw new Error("Please login");

  const { image, firstName, lastName } = args;

  let url = null;

  if (image) url = await uploadImage(image, accessToken);

  const res = await fetch(`${process.env.SERVER_URL}/auth/update`, {
    method: "PUT",
    body: JSON.stringify(
      clean({
        firstName,
        lastName,
        photoUrl: url,
      })
    ),
    headers: {
      "Content-type": "application/json",
      "x-access-token": `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(formatErrorMessage(data.message));
  return { ...data, photoUrl: url };
}
