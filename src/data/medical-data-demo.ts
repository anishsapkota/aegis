import { FileListItem } from "pinata";

// Types and Interfaces
export interface MedicalRecord {
  id: string;
  patientId: string;
  cid?: string;
  recordType: RecordType;
  createdAt: string;
  updatedAt: string;
  status: RecordStatus;
  metadata: RecordMetadata;
  //accessControl: AccessControl;
  attachments?: Attachment[];
  provider?: Provider | string;
  diagnosis?: Diagnosis[];
  medications?: Medication[];
  vitals?: VitalSigns;
}

export type RecordType =
  | "PRESCRIPTION"
  | "LAB_RESULT"
  | "IMAGING"
  | "CONSULTATION"
  | "SURGERY"
  | "VACCINATION"
  | "ALLERGY"
  | "DISCHARGE_SUMMARY"
  | "FOLLOW_UP";

export type RecordStatus = "ACTIVE" | "ARCHIVED" | "PENDING_REVIEW";

interface RecordMetadata {
  title: string;
  description: string;
  specialtyType?: string;
  urgencyLevel?: "LOW" | "MEDIUM" | "HIGH";
  confidentialityLevel: "NORMAL" | "SENSITIVE" | "HIGHLY_SENSITIVE";
  language?: string;
}

export interface Attachment {
  id: string;
  cid: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

interface Provider {
  id: string;
  name: string;
  specialization: string;
  institution: string;
  licenseNumber: string;
  contact: {
    email: string;
    phone: string;
  };
}

interface Diagnosis {
  code: string;
  name: string;
  type: string;
  date: string;
  status: "ACTIVE" | "RESOLVED" | "CHRONIC";
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  instructions: string;
}

interface VitalSigns {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  recordedAt: string;
}

export const medicalRecordMetaData: FileListItem[] = [
  {
    id: "FL-2024-001",
    name: "Cardiology Consultation Record",
    cid: "Qm1234567890abcdef1234567890abcdef1234567890abcd",
    size: 3072000,
    number_of_files: 1,
    mime_type: "application/pdf",
    keyvalues: {
      practitionerDID: "did:ebsi:zmRrEp7pS7XhVDdZbMgD9Yq",
      signature: "ejkslvnskjhfoiusghskjgskjl",
      accessControlList: JSON.stringify({
        "did:ebsi:zmRrEp7pS7XhVDdZbMgD9Yq": "READ",
        "did:ebsi:jkjshvkjlsndvkjsv": "READ",
      }),
      patientId:
        "did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbnnEH34izCkkQgC2BKsgSWqNhAU3B6kwMxnEipxwUYKG6tA3b4jZ6H6Pz5aGxi7jZHYQNq4JxgCb24dB6Kg3aPptjWXfqPGxfrcVA952uD6653A8kjd26oomHHHGK4L6yfi",
    },
    group_id: "G-001",
    created_at: "2024-03-15T09:30:00Z",
  },
  {
    id: "FL-2024-002",
    name: "Neurology Follow-up Record",
    cid: "Qmabcdef1234567890abcdef1234567890abcdef12345678",
    size: 4096000, // 4MB
    number_of_files: 1,
    mime_type: "application/pdf",
    keyvalues: {
      practitionerDID: "did:ebsi:zmRrEp7pS7XhVDdZbMgD9Yq",
      signature: "ejkslvnskjhfoiusghskjgskjl",
      accessControlList: JSON.stringify({
        "did:ebsi:zmRrEp7pS7XhVDdZbMgD9Yq": {
          accessLevel: "READ",
          exp: "2024/10/12 ",
        },
        "did:ebsi:jkjshvkjlsndvkjsv": "WRITE",
      }),
      patientId:
        "did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbnnEH34izCkkQgC2BKsgSWqNhAU3B6kwMxnEipxwUYKG6tA3b4jZ6H6Pz5aGxi7jZHYQNq4JxgCb24dB6Kg3aPptjWXfqPGxfrcVA952uD6653A8kjd26oomHHHGK4L6yfi",
    },
    group_id: "G-002",
    created_at: "2024-04-10T14:15:00Z",
  },
  {
    id: "FL-2024-003",
    name: "Dermatology Treatment Record",
    cid: "Qm123abc456def7890abcdef1234567890abcdef567890",
    size: 2560000, // 2.5MB
    number_of_files: 1,
    mime_type: "application/pdf",
    keyvalues: {
      practitionerDID: "did:ebsi:zmRrEp7pS7XhVDdZbMgD9Yq",
      signature: "ejkslvnskjhfoiusghskjgskjl",
      accessControlList: JSON.stringify({
        "did:ebsi:jkjshvkjlsndvkjsv": "WRITE",
      }),
      patientId:
        "did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbnnEH34izCkkQgC2BKsgSWqNhAU3B6kwMxnEipxwUYKG6tA3b4jZ6H6Pz5aGxi7jZHYQNq4JxgCb24dB6Kg3aPptjWXfqPGxfrcVA952uD6653A8kjd26oomHHHGK4L6yfi",
    },
    group_id: "G-003",
    created_at: "2024-05-22T11:30:00Z",
  },
];

export const medicalRecordsData: MedicalRecord[] = [
  {
    id: "MR-2024-001",
    patientId:
      "did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbnnEH34izCkkQgC2BKsgSWqNhAU3B6kwMxnEipxwUYKG6tA3b4jZ6H6Pz5aGxi7jZHYQNq4JxgCb24dB6Kg3aPptjWXfqPGxfrcVA952uD6653A8kjd26oomHHHGK4L6yfi",
    cid: "Qm1234567890abcdef1234567890abcdef1234567890abcd",
    recordType: "CONSULTATION",
    createdAt: "2024-03-15T09:30:00Z",
    updatedAt: "2024-03-15T09:30:00Z",
    status: "ACTIVE",
    metadata: {
      title: "Initial Cardiology Consultation",
      description: "First consultation for reported chest pain",
      specialtyType: "Cardiology",
      urgencyLevel: "MEDIUM",
      confidentialityLevel: "NORMAL",
      language: "en-US",
    },
    attachments: [
      {
        id: "ATT-001",
        cid: "Qm9876543210fedcba9876543210fedcba9876543210fedc",
        fileName: "ecg_report.pdf",
        fileType: "application/pdf",
        fileSize: 2048576,
        uploadedAt: "2024-03-15T09:35:00Z",
      },
    ],
    provider: {
      id: "DR-001",
      name: "Dr. Sarah Johnson",
      specialization: "Cardiology",
      institution: "Heart Care Center",
      licenseNumber: "MD123456",
      contact: {
        email: "sarah.johnson@heartcare.example",
        phone: "+1234567890",
      },
    },
    diagnosis: [
      {
        code: "I20.9",
        name: "Angina Pectoris",
        type: "Preliminary",
        date: "2024-03-15",
        status: "ACTIVE",
      },
    ],
    vitals: {
      bloodPressure: "130/85",
      heartRate: 78,
      temperature: 37.2,
      respiratoryRate: 16,
      oxygenSaturation: 98,
      recordedAt: "2024-03-15T09:25:00Z",
    },
  },
  {
    id: "MR-2024-002",
    patientId:
      "did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbnnEH34izCkkQgC2BKsgSWqNhAU3B6kwMxnEipxwUYKG6tA3b4jZ6H6Pz5aGxi7jZHYQNq4JxgCb24dB6Kg3aPptjWXfqPGxfrcVA952uD6653A8kjd26oomHHHGK4L6yfi",
    cid: "Qmabcdef1234567890abcdef1234567890abcdef12345678",
    recordType: "FOLLOW_UP",
    createdAt: "2024-04-10T14:00:00Z",
    updatedAt: "2024-04-10T14:15:00Z",
    status: "PENDING_REVIEW",
    metadata: {
      title: "Neurology Follow-up Visit",
      description: "Follow-up consultation for migraine management",
      specialtyType: "Neurology",
      urgencyLevel: "HIGH",
      confidentialityLevel: "HIGHLY_SENSITIVE",
      language: "en-US",
    },
    attachments: [
      {
        id: "ATT-002",
        cid: "Qmabcdefgh1234567890abcdef1234567890abcdef123456",
        fileName: "brain_mri_report.pdf",
        fileType: "application/pdf",
        fileSize: 4096000,
        uploadedAt: "2024-04-10T14:05:00Z",
      },
    ],
    provider: {
      id: "DR-002",
      name: "Dr. James Carter",
      specialization: "Neurology",
      institution: "Neurology Specialist Center",
      licenseNumber: "MD654321",
      contact: {
        email: "james.carter@neurocenter.example",
        phone: "+0987654321",
      },
    },
    diagnosis: [
      {
        code: "G43.9",
        name: "Migraine, unspecified",
        type: "Ongoing",
        date: "2024-04-10",
        status: "ACTIVE",
      },
    ],
  },
  {
    id: "MR-2024-003",
    patientId:
      "did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbnnEH34izCkkQgC2BKsgSWqNhAU3B6kwMxnEipxwUYKG6tA3b4jZ6H6Pz5aGxi7jZHYQNq4JxgCb24dB6Kg3aPptjWXfqPGxfrcVA952uD6653A8kjd26oomHHHGK4L6yfi",
    cid: "Qm123abc456def7890abcdef1234567890abcdef567890",
    recordType: "IMAGING",
    createdAt: "2024-05-22T11:15:00Z",
    updatedAt: "2024-05-22T11:30:00Z",
    status: "ACTIVE",
    metadata: {
      title: "Dermatology Treatment Record",
      description: "Skin rash treatment and follow-up",
      specialtyType: "Dermatology",
      urgencyLevel: "LOW",
      confidentialityLevel: "NORMAL",
      language: "en-US",
    },
    attachments: [
      {
        id: "ATT-003",
        cid: "Qma1b2c3d4e5f6789abcdef1234567890abcdefabcdef987",
        fileName: "treatment_summary.pdf",
        fileType: "application/pdf",
        fileSize: 2560000,
        uploadedAt: "2024-05-22T11:20:00Z",
      },
    ],
    provider: {
      id: "DR-003",
      name: "Dr. Lisa Wang",
      specialization: "Dermatology",
      institution: "Skin Health Clinic",
      licenseNumber: "MD789012",
      contact: {
        email: "lisa.wang@skinclinic.example",
        phone: "+1122334455",
      },
    },
    diagnosis: [
      {
        code: "L30.9",
        name: "Dermatitis, unspecified",
        type: "Primary",
        date: "2024-05-22",
        status: "ACTIVE",
      },
    ],
  },
];

// Helper function to get records by patient ID
export const getRecordsByPatient = (
  patientId: string,
  practitionerDID: string,
): MedicalRecord[] => {
  // Step 1: Filter medicalRecordMetaData to get CIDs where practitionerDID has READ or WRITE access
  const accessibleCIDs = medicalRecordMetaData
    .filter((file) => {
      const accessControlList = file.keyvalues.accessControlList
        ? JSON.parse(file.keyvalues.accessControlList)
        : null;

      // Check if practitionerDID has 'READ' or 'WRITE' access
      return (
        accessControlList &&
        accessControlList[practitionerDID] &&
        ["READ", "WRITE"].some((access) =>
          accessControlList[practitionerDID].includes(access),
        )
      );
    })
    .map((file) => file.cid);

  // Step 2: Filter medicalRecordsData based on patientId and accessible CIDs
  return medicalRecordsData.filter(
    (record) =>
      record.patientId === patientId && accessibleCIDs.includes(record.cid!),
  );
};

// Helper function to get records by provider ID
// export const getRecordsByProvider = (providerId: string): MedicalRecord[] => {
//   return medicalRecordsData.filter((record) =>
//     record.accessControl.allowedProviders.includes(providerId),
//   );
// };

// export const getPatientRecords = (
//   patientDID: string,
//   practitionerDID: string,
// ): MedicalRecord[] => {};

export const getMedicalRecordMetaData = () => {
  return medicalRecordMetaData;
};

export const getMedicalRecordFromCID = (
  cid: string,
): MedicalRecord | undefined => {
  return medicalRecordsData.find((record) => record.cid === cid);
};

// Helper function to get records by type
export const getRecordsByType = (type: RecordType): MedicalRecord[] => {
  return medicalRecordsData.filter((record) => record.recordType === type);
};
