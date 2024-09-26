// Функция для форматирования даты
export const formatDate = (isoDate) => {
    const [year, month, day] = isoDate.split('-');
    const monthNames = {
      '01': 'янв', '02': 'фев', '03': 'мар', '04': 'апр', '05': 'май', '06': 'июн',
      '07': 'июл', '08': 'авг', '09': 'сен', '10': 'окт', '11': 'ноя', '12': 'дек'
    };
    return `${day}-${monthNames[month]}-${year}`;
  };