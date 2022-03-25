exports.up = async (sql) => {
  await sql`
		CREATE TABLE palnote (
			id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			content_pal_note varchar (400),
			document_url varchar (300),
			user_id INTEGER NOT NULL

		);
	`;
};

exports.down = async (sql) => {
  await sql`
	DROP TABLE addresses
	`;
};
