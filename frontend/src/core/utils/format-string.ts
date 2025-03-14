/**
 * Extracts the first name from a full name string
 * @param fullName String containing the full name
 * @returns First name or full name if no space is present, or an empty string if invalid
 * @example
 * getFirstName("João Silva") // returns "João"
 * getFirstName("Maria dos Santos") // returns "Maria"
 * getFirstName("João") // returns "João"
 * getFirstName("") // returns ""
 */
export const getFirstName = (fullName: string): string => {
  if (!fullName) return '';
  
  const nameParts = fullName.split(' ');
  return nameParts.length > 1 ? nameParts[0].trim() : fullName.trim();
};
