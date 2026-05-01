export const uploadImage = async (
  file: File,
  folder: "recipes" | "profiles",
): Promise<string> => {
  // validate size client side before sending
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("File size must be less than 5MB");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Upload failed");
  }

  return data.url; // returns Cloudinary URL
};
