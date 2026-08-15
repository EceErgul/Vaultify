export const getSuggestions = <T extends string>(
  input: string, 
  options: T[]
): T[] => {
  if (!input.trim()) return [];
  const lowerInput = input.toLowerCase();
  return options.filter(option => 
    option.toLowerCase().includes(lowerInput)
  );
};