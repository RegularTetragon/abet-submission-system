
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('whitelist').del()
    .then(function () {
      // Inserts seed entries
      return knex('whitelist').insert([
        {id: 1, email: 'user@uky.edu'},
        {id: 2, email: 'vbma223@uky.edu'},
        {id: 3, email: 'isro223@uky.edu'},
      ]);
    });
};
