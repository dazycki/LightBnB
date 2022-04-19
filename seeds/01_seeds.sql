INSERT INTO users (name, email, password)
VALUES 
('Dominic Parks', 'victoriablackwell@outlook.com', '1234password'),
('Eva Stanley', 'sebastianguerra@ymail.com', '1234password'),
('Louisa Meyer', 'jacksonrose@hotmail.com', '1234password');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES 
(1, 'Speed lamp', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350','https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 930.61, 6, 4, 8, 'Canada', 536, 'Namsub Highway', 'Sotboske', 'Quebec', 28142, true),
(2, 'Hector Drive', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350','https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 930.61, 6, 4, 8, 'Canada', 536, 'Namsub Highway', 'Kitchener', 'Ontario', 28142, true),
(3, 'Speed lamp', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350','https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 930.61, 6, 4, 8, 'Canada', 536, 'Namsub Highway', 'Sotboske', 'Quebec', 28142, true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES 
(2018-09-11, 2018-09-26, 2, 3),
(2019-01-04, 2019-02-01, 2, 2),
(2021-10-01, 2021-10-14, 1, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES 
(2, 3, 1, 3, "messages"),
(3, 2, 1, 3, "messages"),
(1, 2, 3, 3, "messages");