interface DidStore {
  [practitionerDID: string]: Set<string>;
}

// Initialize from localStorage if available
const STORAGE_KEY = "didStore";

function initializeStore(): DidStore {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      // Convert the plain objects back to Sets
      const parsedData = JSON.parse(storedData);
      const reconstructedStore: DidStore = {};

      Object.keys(parsedData).forEach((key) => {
        reconstructedStore[key] = new Set(parsedData[key]);
      });

      return reconstructedStore;
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
  }
  return {};
}

// Initialize the store
let didStore: DidStore = initializeStore();

// Helper function to persist store to localStorage
function persistStore() {
  try {
    // Convert Sets to arrays for JSON serialization
    const serializable = Object.fromEntries(
      Object.entries(didStore).map(([key, value]) => [key, Array.from(value)]),
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

// Get all registered patients for a practitioner
export function getAllRegisteredPatients(practitionerDID: string): string[] {
  return Array.from(didStore[practitionerDID] ?? new Set());
}

// Add a patient to a practitioner's set of patients
export function addPatient(
  patientDID: string,
  practitionerDID: string,
): string[] {
  if (!didStore[practitionerDID]) {
    didStore[practitionerDID] = new Set();
  }
  didStore[practitionerDID].add(patientDID);

  // Persist changes to localStorage
  persistStore();

  return Array.from(didStore[practitionerDID]);
}

// Optional: Add a function to clear the store
export function clearStore() {
  didStore = {};
  localStorage.removeItem(STORAGE_KEY);
}

// Optional: Add a function to remove a specific patient
export function removePatient(
  patientDID: string,
  practitionerDID: string,
): string[] {
  if (didStore[practitionerDID]) {
    didStore[practitionerDID].delete(patientDID);
    persistStore();
  }
  return Array.from(didStore[practitionerDID] || new Set());
}
