exports.up = async (sql) => {
  await sql`
		CREATE TABLE users (
			id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			user_permission_id integer REFERENCES user_permission(id) ON DELETE CASCADE,
			password_hash varchar (80) NOT NULL,
			company varchar (60) NOT NULL UNIQUE

		);
	`;
};

exports.down = async (sql) => {
  await sql`
	DROP TABLE users
	`;
};
