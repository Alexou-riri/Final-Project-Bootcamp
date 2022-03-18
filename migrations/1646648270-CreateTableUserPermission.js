exports.up = async (sql) => {
  await sql`
		CREATE TABLE user_permission (
			id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			description varchar (200) NOT NULL

		);
	`;
};

exports.down = async (sql) => {
  await sql`
	DROP TABLE user_permission
	`;
};
