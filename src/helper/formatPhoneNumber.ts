const formatPhoneNumber = (phoneNumber: string|null) => {
  if (phoneNumber) {
    const formattedNumber = phoneNumber.replace(/^(\d{4})(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3 $4');
    return formattedNumber;
  }
  return phoneNumber;
};

export default formatPhoneNumber;