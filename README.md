# Aegis

Aegis is a platform that allows patients to securely access their health records using verifiable credentials, such as Personal Identity Cards or Health Insurance Cards. Patients can selectively disclose data to medical practitioners or healthcare providers and revoke access at any time.

## Getting Started

### Prerequisites

- Ensure that **Docker** is installed and running on your machine.
- Install **Node.js** and **npm** if you haven’t already.

### Installation and Setup

1. `npm install`
2. `npm run build`

## Setting up env variables

- Replace `PINATA_JWT`, `NEXT_PUBLIC_GATEWAY_URL`, `SERVER_URL` ( with your [ngrok](https://ngrok.com/) url for :3000 port)

## Stating docker container

- `docker compose up`

## Get your demo credentials

Send a POST request to: ( recommendation postman)

```bash
https://senecahub.eu/offer
```

JSON body

```
{
    "credentialSubject": {
        "given_name": "John",
        "family_name":"Doe",
        "birth_date": "2000/1/1",
        "age_over_18": true,
        "issuance_date": "2023/10/30",
        "expiry_date": "2030/10/30",
        "issuing_authority": "bürger amt friedrichhein",
        "issuing_country": "DE"
    },
    "type": ["PersonalIdentityCardProof"]
}
```

```

{
    "credentialSubject": {
        "license_id":"hkljh2398rhohfwlsvsbvlkjhb",
        "given_name": "John",
        "family_name":"Doe",
        "birth_date": "2000/1/1",
        "issuance_date": "2023/10/30",
        "expiry_date": "2030/10/30",
        "issuing_authority": "Charite",
        "issuing_country": "DE"
    },
    "type": ["Approbation","MedicalLicense"]
}

```

- Copy the response URL (`open-credential-offer://...`) to a QR code generator (e.g., [QRCode Generator](https://www.qrcode-generator.de)).

- Scan the QR code with your wallet app, such as [iGrant.io DataWallet](https://igrant.io/datawallet.html).
- PIN: 1234
```

```
