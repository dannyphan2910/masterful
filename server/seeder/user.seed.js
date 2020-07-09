const seeder = require('mongoose-seed');
const faker = require('faker');
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;

require('dotenv').config({ path: '../.env' });
const uri = process.env.ATLAS_URI;


let users = [];
for (i = 1; i <= 100; i++) {
    users.push({
        'firstName': faker.name.firstName(),
        'lastName': faker.name.lastName(),
        'email': 'testing' + i + '@gmail.com',
        'password': bcrypt.hashSync('123456', saltRounds)
    });
}


fs.writeFileSync('./seed_files/users.json', JSON.stringify(users, null, 4));

let usersData = [{
    'model': 'User',
    'documents': users
}]

// connect mongodb
seeder.connect(uri, function () {
    seeder.loadModels([
        '../models/user.model'  // load mongoose model 
    ]);
    seeder.clearModels(['User'], function () {
        seeder.populateModels(usersData, function () {
            seeder.disconnect();
        });
    });
});



