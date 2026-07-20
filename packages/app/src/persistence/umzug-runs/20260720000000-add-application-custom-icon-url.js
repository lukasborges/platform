export default {
  up(query, DataTypes) {
    return query.addColumn('application', 'customIconURL', DataTypes.TEXT);
  },

  down(query) {
    return query.removeColumn('application', 'customIconURL');
  },
};
