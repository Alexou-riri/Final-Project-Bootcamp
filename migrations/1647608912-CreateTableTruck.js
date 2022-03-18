exports.up = async (sql) => {
  await sql`
		CREATE TABLE trucks (
			id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			truck_plate varchar (60) NOT NULL,
			trailer_plate varchar (80) NOT NULL

		);
	`;
};

exports.down = async (sql) => {
  await sql`
	DROP TABLE trucks
	`;
};
