exports.up = async (sql) => {
  await sql`
		CREATE TABLE loads (
			id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			pallet_quantity_given INTEGER NOT NULL,
			pallet_quantity_received INTEGER,
			loading_place_id INTEGER NOT NULL REFERENCES addresses (id),
			offloading_place_id INTEGER NOT NULL REFERENCES addresses (id),
			truck_id INTEGER NOT NULL REFERENCES trucks (id) ON DELETE CASCADE,
			reference VARCHAR(100),
			loading_date TIMESTAMP(0) NOT NULL,
    	offloading_date TIMESTAMP(0) NOT NULL,
			request_date TIMESTAMP(0) NOT NULL,
			document_id INTEGER NOT NULL REFERENCES palnote(id) ON DELETE CASCADE,
			user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE

		);
	`;
};

exports.down = async (sql) => {
  await sql`
	DROP TABLE loads
	`;
};
