const formatPrice = (price: string | number) => {
  const isValidNumber = /^\d+(\.\d+)?$/.test(price.toString());
  
  if (isValidNumber) {
    const floatValue = typeof price === 'string' ? parseFloat(price) : price;
  
    const formattedValue = floatValue.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  
    return { formattedValue, isValid: true };
  } else {
    return { formattedValue: 'Invalid value', isValid: false };
  }
};

export default formatPrice;