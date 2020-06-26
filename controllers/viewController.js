exports.getOverview = (req, res) => {
  res.status(200).render('pages/overview', {
    title: 'All tours',
  });
};

exports.getTour = (req, res) => {
  res.status(200).render('pages/tour', {
    title: 'The Forrest Hiker',
  });
};
