module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('files', 'path', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('files', 'path');
  },
};
