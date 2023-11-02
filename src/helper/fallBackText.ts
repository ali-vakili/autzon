const avatarFallBackText= (firstName: string|null, lastName: string|null): string => {
  if (firstName && lastName) {
    const firstLetters = `${firstName[0]}${lastName[0]}`;
    return firstLetters.toUpperCase();
  }
  return "AV";
}

export { avatarFallBackText }