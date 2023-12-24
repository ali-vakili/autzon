const getCreatedAndJoinDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const formatted_date = new Date(date).toLocaleDateString('en-US', options);

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

function formatDateTime(date_time: Date) {

  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  };

  const formatted_date_time = new Date(date_time).toLocaleDateString('en-US', options);

  return formatted_date_time;
}


export { getCreatedAndJoinDate, getUpdatedAtDate, formatDateTime }