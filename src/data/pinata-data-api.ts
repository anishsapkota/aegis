"use server";
import { pinata } from "@/utils/config";
import { FileListResponse, GetCIDResponse } from "pinata";
import { getCurrentUser } from "@/lib/server-side-session";
import { MedicalRecord } from "./medical-data-demo";

export async function getFilesList(
  patientDID: string,
): Promise<FileListResponse> {
  return await pinata.files.list().metadata({ patientDID: patientDID });
}

export async function getPatientFiles(
  patientDID: string,
): Promise<MedicalRecord[]> {
  const user = await getCurrentUser();
  const patientFilesMetadataList = (
    await pinata.files.list().metadata({ patientDID: patientDID })
  ).files;
  const accessibleCIDs = patientFilesMetadataList
    .filter((file) => {
      const accessControlList = file.keyvalues.accessControlList
        ? JSON.parse(file.keyvalues.accessControlList)
        : null;

      // Check if practitionerDID has 'READ'
      return (
        accessControlList &&
        accessControlList[user.userDID] &&
        ["READ"].some((access) =>
          accessControlList[user.userDID].includes(access),
        )
      );
    })
    .map((file) => file.cid);
  const medicalRecords = await Promise.all(
    accessibleCIDs.map((cid) => getFileByCID(cid)),
  );

  return medicalRecords.map(
    (record) => record.data,
  ) as unknown as MedicalRecord[];
}

export async function getFileByCID(cid: string): Promise<GetCIDResponse> {
  return await pinata.gateways.get(cid);
}

export async function uploadJsonPinata(
  filename: string,
  json: object,
  patientDID: string,
  practitionerDID: string,
) {
  return await pinata.upload.json(json).addMetadata({
    name: filename,
    keyvalues: {
      accessControlList: JSON.stringify([]),
      practitionerDID,
      patientDID,
    },
  });
}

export async function updateFileACL(
  fileId: string,
  currentACL: Array<{ [key: string]: string }>,
) {
  return await pinata.files.update({
    id: fileId,
    keyvalues: {
      accessControlList: JSON.stringify(currentACL),
    },
  });
}
