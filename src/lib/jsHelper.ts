export const formatDID = (did: string, maxLength = 50) => {
  if (did.length <= maxLength) {
    return did;
  }
  const initials = did.slice(0, 20);
  const endChars = did.slice(-5);
  return `${initials}...${endChars}`;
};

export const parseAccessControlList = (acl: string) => JSON.parse(acl);
