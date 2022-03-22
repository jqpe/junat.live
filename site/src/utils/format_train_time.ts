export const formatTrainTime = (dateString: string) =>
  Intl.DateTimeFormat('fi', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(Date.parse(dateString))
