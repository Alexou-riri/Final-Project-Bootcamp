exports.up = async (sql) => {
  await sql`
INSERT INTO user_permission
(description)
VALUES
('client'),
('subcompany')
`;
};

exports.down = async (sql) => {
  await sql`
 DELETE FROM user_permission
 `;
};
