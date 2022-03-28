exports.up = async (sql) => {
  await sql`
		CREATE TABLE loads (
			id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			loading_place_id INTEGER NOT NULL REFERENCES addresses (id),
			offloading_place_id INTEGER NOT NULL REFERENCES addresses (id),
			loading_date DATE NOT NULL,
    	offloading_date DATE NOT NULL,
			reference VARCHAR(100),
			truck_id INTEGER NOT NULL REFERENCES trucks (id) ON DELETE CASCADE,
			pallet_quantity_given INTEGER NOT NULL,
			pallet_quantity_received INTEGER,
			document_id INTEGER REFERENCES palnote(id) ON DELETE CASCADE,
			user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE

		);
	`;
};

exports.down = async (sql) => {
  await sql`
	DROP TABLE loads
	`;
};
