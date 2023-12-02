const getCreatedAndJoinDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const formatted_date = new Date(date).toLocaleDateString(undefined, options);

  return formatted_date;
}

const getUpdatedAtDate = (updated_at: Date) => {
  const updatedAtDate = new Date(updated_at);
  const currentDate = new Date();

  const timeDifference = currentDate.getTime() - updatedAtDate.getTime();
  const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (daysAgo === 0) {
    return 'Today';
  } else if (daysAgo === 1) {
    return 'Yesterday';
  } else {
    return `${daysAgo} days ago`;
  }
}

export { getCreatedAndJoinDate, getUpdatedAtDate }