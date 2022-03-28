exports.up = async (sql) => {
  await sql`
		CREATE TABLE addresses (
			id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			company_name varchar (100) NOT NULL,
			street_number integer NOT NULL,
			street_name varchar (100) NOT NULL,
			zipcode varchar (30) NOT NULL,
			city varchar (100) NOT NULL,
			country varchar (100) NOT NULL
		);
	`;
};

exports.down = async (sql) => {
  await sql`
	DROP TABLE addresses
	`;
};
