function str_to_date(str) {
  return dateFns.parse(str, "yyyy-MM-dd", new Date());
}

function format_interval(start, end) {
  start = str_to_date(start);
  end = str_to_date(end);
  var fdates;

  if (!dateFns.isSameYear(start, end)) {
    fdates = [
      dateFns.format(start, "d.MM.yyyy"),
      dateFns.format(end, "d.MM.yyyy"),
    ];
  } else if (!dateFns.isSameMonth(start, end)) {
    fdates = [dateFns.format(start, "d.MM."), dateFns.format(end, "d.MM.yyyy")];
  } else {
    fdates = [dateFns.format(start, "d."), dateFns.format(end, "d.MM.yyyy")];
  }
  // use the beautifuly em-dash here!
  return fdates.join("—");
}

const days = (start, end) => {
  return dateFns.formatDistanceStrict(str_to_date(start), str_to_date(end), {
    locale: dateFns.locale.de,
  });
};

export default {
  reservation: ({ name, arrival, departure }) => {
    var rdays = days(arrival, departure);
    return {
      title: `${name} (${rdays})`,
      subtitle: format_interval(arrival, departure),
    };
  },
};
