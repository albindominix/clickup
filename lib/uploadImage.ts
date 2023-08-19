import   {  ID, storage } from "@/appwrite";

const uploadImage = async (file: File) => {
  if (!file) return;

  const fileUploaded = await storage.createFile(
    "64dd23613b8d8b5e5e8b",
    ID.unique(),
    file
  );
  return fileUploaded
};
export default  uploadImage 