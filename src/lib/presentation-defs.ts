import { v4 } from "uuid";

export const presentation_def_pid = {
  id: `${v4()}`,
  name: "PersonalIdentityCardProof",
  format: {
    jwt_vc: {
      alg: ["ES256"],
    },
  },
  input_descriptors: [
    {
      id: `${v4()}`,
      format: {
        jwt_vc: {
          alg: ["ES256"],
        },
      },
      constraints: {
        fields: [
          {
            path: [
              "$.credentialSubject.given_name",
              "$.vc.credentialSubject.given_name",
            ],
          },
          {
            path: [
              "$.credentialSubject.family_name",
              "$.vc.credentialSubject.family_name",
            ],
          },
          {
            path: [
              "$.credentialSubject.birth_date",
              "$.vc.credentialSubject.birth_date",
            ],
          },
          {
            path: [
              "$.credentialSubject.age_over_18",
              "$.vc.credentialSubject.age_over_18",
            ],
          },
          {
            path: [
              "$.credentialSubject.issuance_date",
              "$.vc.credentialSubject.issuance_date",
            ],
          },
          {
            path: [
              "$.credentialSubject.expiry_date",
              "$.vc.credentialSubject.expiry_date",
            ],
          },
          {
            path: [
              "$.credentialSubject.issuing_authority",
              "$.vc.credentialSubject.issuing_authority",
            ],
          },
          {
            path: [
              "$.credentialSubject.issuing_country",
              "$.vc.credentialSubject.issuing_country",
            ],
          },
        ],
      },
      limit_disclosure: "required",
    },
  ],
};
