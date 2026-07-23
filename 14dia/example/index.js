const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function hashPassword(password) {
  const salt = await bycrypt.genSalt(10);
  const hashedPassword = await bycrypt.hash(password, salt);
  const isMatch = await bycrypt.compare(password1, hashedPassword);

  const token = jwt.sign({ id: userId}, 'your-secret-key', { expiresIn: '1h' });
  const decoded = jwt.verify(token, 'your-secret-key');

  return { hashedPassword, isMatch, token, decoded };
}
