const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg'); // import node-postgres

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function(email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      if (result.rows) { // checks if valid result (ie. user) is found in db
        return result.rows[0]; // returns first result from array
      } else { // if no valid result is found, returns null
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      if (result.rows) { // checks if valid result (ie. user) is found in db
        return result.rows[0]; // returns first result from array
      } else { // if no valid result is found, returns null
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

const addUser =  function(user) {
  return pool
    .query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`, [user.name, user.email, user.password])
    .then((result) => {
      if (result.rows) { // checks if valid result (ie. user) is found in db
        return result.rows[0]; // returns first result from array
      } else { // if no valid result is found, returns null
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
// const getAllReservations = function(guest_id, limit = 10) {
//   return getAllProperties(null, 2);
// }

const getAllReservations = function(guest_id, limit = 10) {
  const queryString = `
    SELECT properties.*, reservations.*, avg(rating) as average_rating
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id 
    WHERE reservations.guest_id = $1
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2;
  `;

  const values = [guest_id, limit];

  return pool
    .query(queryString, values)
    .then((result) => {
      return result.rows; // returns first result from array
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// const getAllProperties = function(options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// }

const getAllProperties = (options, limit = 10) => {
  // define queryParams that may be passed into query
  const queryParams = [];
  // the starter code that will be modified/ appended to based on filters used
  let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
   `;
 
  // query modification to search by city
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length}`;
  }
 
  // query modification to search by OwnerID
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    if (queryParams.length === 1) { //checks if more than 1 WHERE clauses is needed, to see if AND is required
      queryString += `WHERE owner_id = $${queryParams.length} `;
    } else {
      queryString += `AND owner_id = $${queryParams.length} `;
    }
  }

  // query modification to search by min and max price per night
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100, options.maximum_price_per_night * 100); // *100 to convert from dollars to cents
    if (queryParams.length === 2) { //checks if more than 1 WHERE clauses is needed, to see if AND is required
      queryString += `WHERE cost_per_night >= $${queryParams.length - 1} AND cost_per_night <= $${queryParams.length} `;
    } else {
      queryString += `AND cost_per_night >= $${queryParams.length - 1} AND cost_per_night <= $${queryParams.length} `;
    }
  }

  // query parameters that come after the WHERE clause
  queryString += `
  GROUP BY properties.id
  `;
   
  // query modification to search by minimum star rating
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  }
  
  // final part of the query that is to be added at the very end
  queryParams.push(limit);
  queryString += `
   ORDER BY cost_per_night
   LIMIT $${queryParams.length};
   `;

  // logs final query to confirm it was constructed properly
  console.log(queryString, queryParams);
 
  // returns the query that will be run by the application
  return pool.query(queryString, queryParams).then((res) => res.rows);
};

exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryString = `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
  `;
  
  const values = [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms];
  
  return pool
    .query(queryString, values)
    .then((result) => {
      if (result.rows) { // checks if valid result (ie. propertt was added)
        return result.rows[0]; // returns first result from array
      } else { // if no valid result is found, returns null
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addProperty = addProperty;
